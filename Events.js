const { InternalEventSource } = require('./ontology/core/InternalEvents.js');
const { InternalEventType } = require('./ontology/core/InternalEvents.js');

// How the runtime reacts to an obligation's violation. Per the ontology's
// contract state machine, a contract reaches UnsuccessfulTermination only via
// `terminated` -- i.e. through a power's exercise -- so a violation that is
// "handled" (a remedial power exists or the violation itself brought a
// reparation to life) must NOT terminate the contract; the decision belongs
// to the party holding the power. Auto-termination remains the fallback for
// truly unhandled violations so a breached contract cannot linger forever.
//
// Select per contract by setting `contract.violationPolicy`:
//   'auto'   (default) terminate only if the violation is unhandled: no power
//            was created by it, no live (unexpired, unexerted) power exists,
//            and it created no new obligation (reparation);
//   'eager'  legacy behaviour: terminate unless this very violation created a
//            power (pre-existing powers and reparations are ignored);
//   'manual' never auto-terminate: termination happens only through a power
//            (the ontology's state machine, strictly).
// The property is read at violation time; absence means 'auto'.
const ViolationPolicy = {
  Auto: 'auto',
  Eager: 'eager',
  Manual: 'manual',
};

const EventsObject = {

  init(eventsMap, listeners) {
    EventsObject.eventsMap = eventsMap;
    EventsObject.listeners = listeners;
  },

  emitEvent(contract, emittedEvent) {
    const obligationViolated = emittedEvent.source === InternalEventSource.obligation
      && emittedEvent.type === InternalEventType.obligation.Violated;
    // Snapshot the live main obligations before the subscriptions run, so a
    // violation-triggered reparation (an obligation the violation itself
    // creates) can be recognized as handling the violation.
    const obligationsBefore = obligationViolated
      ? EventsObject.liveObligationKeys(contract) : null;
    const effects = { powerNames: [] };
    for (const subscription of EventsObject.eventsMap) {
      const events = subscription[0];
      const callback = subscription[1];
      for (const event of events) {
        if (EventsObject.eventsMatch(emittedEvent, event)) {
          const res = callback(contract);
          if (res != null && res.powerCreated) {
            effects.powerCreated = true;
            effects.powerNames.push(res.powerName);
          }
        }
      }
    }
    if (emittedEvent.source === InternalEventSource.obligation) {
      // eslint-disable-next-line no-param-reassign
      emittedEvent.object._createdPowerNames = effects.powerNames;
    }
    if (obligationViolated) {
      const policy = contract.violationPolicy || ViolationPolicy.Auto;
      const handled = effects.powerCreated === true
        || (policy === ViolationPolicy.Auto
          && (EventsObject.hasLivePower(contract)
            || EventsObject.hasNewObligation(contract, obligationsBefore)));
      if (policy !== ViolationPolicy.Manual && !handled) {
        // Unhandled violation: no remedy exists or was created, terminate.
        EventsObject.listeners.unsuccessfullyTerminateContract(contract);
      }
      // Handled violation: leave the contract in effect; whichever power
      // handles it decides between Suspended/Resumed/Terminated (O9/R4).
      return;
    }
    if (emittedEvent.source === InternalEventSource.obligation) {
      // check if we can successfully terminate the contract
      EventsObject.listeners.successfullyTerminateContract(contract);
    }
  },

  liveObligationKeys(contract) {
    const keys = new Set();
    for (const key of Object.keys(contract.obligations || {})) {
      const o = contract.obligations[key];
      if (o != null && !o.isFinished()) {
        keys.add(key);
      }
    }
    return keys;
  },

  hasNewObligation(contract, before) {
    return Object.keys(contract.obligations || {}).some((key) => {
      const o = contract.obligations[key];
      return o != null && !o.isFinished() && !before.has(key);
    });
  },

  hasLivePower(contract) {
    return Object.keys(contract.powers || {}).some((key) => {
      const p = contract.powers[key];
      return p != null && !p.isFinished();
    });
  },

  eventsMatch(a, b) {
    if (b.object == null) {
      return false;
    }
    if (a.source === b.source && a.type === b.type) {
      if (a.source === InternalEventSource.obligation
        || a.source === InternalEventSource.power) {
        return a.object.name === b.object.name;
      } if (a.source === InternalEventSource.contract
        || a.source === InternalEventSource.contractEvent) {
        return a.object._name === b.object._name;
      }
      return false;
    }
    return false;
  },
};

module.exports.Events = EventsObject;
module.exports.ViolationPolicy = ViolationPolicy;
