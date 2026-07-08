// Situation membership for HappensWithin(e, Situation(x)): which internal
// transition events open and close each named state. The ontology gives every
// Situation a TimeInterval; the runtime realizes it through the transition
// stamps the state machines already record in `object._events`. An event is
// "within" a situation iff its timestamp falls inside the situation's most
// recent episode -- [entry, exit] when the state was left, [entry, now) while
// the object is still in it. States with no exit events are terminal.
//
// When an object carries no transition stamps (e.g. constructed by hand or
// restored by an older serializer), the check falls back to the historical
// state-based semantics: event happened AND object is in the state now.
//
// Timestamps have minute granularity (Event.happen truncates seconds for
// cross-peer determinism), so same-minute boundary cases resolve inclusively.
const SITUATION_EPISODES = {
  'Obligation.Create': { entry: ['Triggered'], exit: ['Activated', 'Expired', 'Terminated'] },
  'Obligation.Active': { entry: ['Activated'], exit: ['Fulfilled', 'Violated', 'Discharged', 'Terminated'] },
  'Obligation.InEffect': { entry: ['Activated', 'Resumed'], exit: ['Suspended', 'Fulfilled', 'Violated', 'Discharged', 'Terminated'] },
  'Obligation.Suspension': { entry: ['Suspended'], exit: ['Resumed', 'Terminated'] },
  'Obligation.Violation': { entry: ['Violated'], exit: [] },
  'Obligation.Fulfillment': { entry: ['Fulfilled'], exit: [] },
  'Obligation.Discharge': { entry: ['Discharged', 'Expired'], exit: [] },
  'Obligation.UnsuccessfulTermination': { entry: ['Terminated'], exit: [] },
  'Power.Create': { entry: ['Triggered'], exit: ['Activated', 'Expired', 'Terminated'] },
  'Power.Active': { entry: ['Activated'], exit: ['Exerted', 'Expired', 'Terminated'] },
  'Power.InEffect': { entry: ['Activated', 'Resumed'], exit: ['Suspended', 'Exerted', 'Expired', 'Terminated'] },
  'Power.Suspension': { entry: ['Suspended'], exit: ['Resumed', 'Terminated'] },
  'Power.SuccessfulTermination': { entry: ['Exerted', 'Expired'], exit: [] },
  'Power.UnsuccessfulTermination': { entry: ['Terminated'], exit: [] },
  'Contract.InEffect': { entry: ['Activated', 'Resumed'], exit: ['Suspended', 'FulfilledObligations', 'Terminated', 'Rescinded'] },
  'Contract.Suspension': { entry: ['Suspended'], exit: ['Resumed', 'Terminated'] },
  'Contract.Rescission': { entry: ['Rescinded'], exit: [] },
  'Contract.SuccessfulTermination': { entry: ['FulfilledObligations'], exit: [] },
  'Contract.UnsuccessfulTermination': { entry: ['Terminated'], exit: [] },
};

function isInState(object, state) {
  switch (state) {
    case 'Power.Create':
      return object.isCreate();
    case 'Power.UnsuccessfulTermination':
      return object.isUnsuccessfulTermination();
    case 'Power.Active':
      return object.isActive();
    case 'Power.InEffect':
      return object.isInEffect();
    case 'Power.Suspension':
      return object.isSuspended();
    case 'Power.SuccessfulTermination':
      return object.isSuccessfulTermination();

    case 'Obligation.Create':
      return object.isCreated();
    case 'Obligation.Discharge':
      return object.isDischarged();
    case 'Obligation.Active':
      return object.isActive();
    case 'Obligation.InEffect':
      return object.isInEffect();
    case 'Obligation.Suspension':
      return object.isSuspended();
    case 'Obligation.Violation':
      return object.isViolated();
    case 'Obligation.Fulfillment':
      return object.isFulfilled();
    case 'Obligation.UnsuccessfulTermination':
      return object.isUnsuccessfulTermination();

    case 'Contract.Form':
      return object.isForm();
    case 'Contract.UnAssign':
      return object.isUnassign();
    case 'Contract.InEffect':
      return object.isInEffect();
    case 'Contract.Suspension':
      return object.isSuspended();
    case 'Contract.Rescission':
      return object.isRescission();
    case 'Contract.SuccessfulTermination':
      return object.isSuccessfulTermination();
    case 'Contract.UnsuccessfulTermination':
      return object.isUnsuccessfulTermination();
    case 'Contract.Active':
      return object.isActive();
    default:
      return false;
  }
}

// Latest timestamp among the named transition events, optionally at/after t0.
function latestTransitionTime(events, names, t0) {
  let latest = null;
  for (const name of names) {
    const ev = events[name];
    if (ev != null && ev.hasHappened() && ev._timestamp != null
      && (t0 == null || ev._timestamp >= t0)
      && (latest == null || ev._timestamp > latest)) {
      latest = ev._timestamp;
    }
  }
  return latest;
}

const Predicates = {
  happens(e) {
    return e == null ? false : e.hasHappened();
  },

  happensAfter(e, ts) {
    if (e == null) {
      return false;
    }
    if (ts == null) {
      return false;
    }
    return Predicates.happens(e) && e._timestamp > ts;
  },

  weakHappensBefore(e, ts) {
    if (e == null) {
      return false;
    }
    if (Predicates.happens(e) && ts == null) {
      return true;
    }
    return Predicates.happens(e) && e._timestamp <= ts;
  },

  strongHappensBefore(e, ts) {
    if (e == null || ts == null) {
      return false;
    }
    return Predicates.happens(e) && e._timestamp <= ts;
  },

  happensWithin(e, arg1, arg2) {
    if (e == null) {
      return false;
    }
    if ((typeof arg2 === 'string' || arg2 instanceof String)
      && (arg2.indexOf('Power.') !== -1 || arg2.indexOf('Obligation.') !== -1
      || arg2.indexOf('Contract.') !== -1)) {
      return Predicates.happensWithinSituation(e, arg1, arg2);
    }
    return Predicates.happensWithinInterval(e, arg1, arg2);
  },

  happensWithinSituation(e, object, state) {
    if (object == null || e == null || !e.hasHappened()) {
      return false;
    }
    const inStateNow = isInState(object, state);
    const episode = SITUATION_EPISODES[state];
    const events = object._events || {};
    const entryTime = episode == null ? null
      : latestTransitionTime(events, episode.entry, null);
    if (entryTime == null) {
      // No transition stamps for this state: historical state-based check.
      return inStateNow;
    }
    const t = e._timestamp;
    if (inStateNow) {
      // Open episode: [entry, now).
      return t != null && t >= entryTime;
    }
    const exitTime = latestTransitionTime(events, episode.exit, entryTime);
    if (exitTime == null) {
      // Entered and left the state, but the exit transition left no stamp
      // (or the state was never really entered); nothing to bound the
      // episode with -- the situation does not currently hold.
      return false;
    }
    // Closed (most recent) episode: [entry, exit].
    return t != null && t >= entryTime && t <= exitTime;
  },

  happensWithinInterval(e, start, end) {
    if (start == null) {
      return false;
    }
    if (end == null) {
      return e.hasHappened() && e._timestamp >= start;
    }
    return e.hasHappened() && e._timestamp >= start && e._timestamp <= end;
  },
};

module.exports.Predicates = Predicates;
