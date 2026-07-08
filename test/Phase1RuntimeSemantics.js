/* eslint-disable max-len, no-unused-expressions */
// Phase-1 runtime semantics (SymboleoAC-Incoterms iteration plan, items
// O9/R4 and R1; see coverage/symboleoac-improvements.md in that repository):
// 1. a violation terminates the contract only when UNHANDLED -- a remedial
//    power created by it, a live pre-existing power, or a reparation
//    obligation it creates all defer the decision to the power holder
//    (the ontology's contract state machine terminates only via a power);
// 2. HappensWithin(e, Situation(x)) is interval-based over the situation's
//    most recent episode, not a check of the object's current state.
const { expect } = require('chai');
const { Events } = require('../Events.js');
const { Predicates } = require('../ontology/core/Predicates.js');
const { Obligation } = require('../ontology/core/Obligation.js');
const { Power } = require('../ontology/core/Power.js');
const { Role } = require('../ontology/core/Role.js');
const { SymboleoContract } = require('../ontology/core/SymboleoContract.js');
const { Event } = require('../ontology/core/Event.js');
const {
  InternalEvent, InternalEventSource, InternalEventType,
} = require('../ontology/core/InternalEvents.js');

function freshContract() {
  const contract = new SymboleoContract('c1');
  contract.obligations = {};
  contract.powers = {};
  // Creation transitions emit internal events; give them an empty map so
  // helpers can run before each test installs its own subscriptions.
  Events.init([], { unsuccessfullyTerminateContract() {}, successfullyTerminateContract() {} });
  return contract;
}

function inEffectObligation(name, contract) {
  const creditor = new Role('creditor', contract);
  const debtor = new Role('debtor', contract);
  const o = new Obligation(name, creditor, debtor, contract);
  o.trigerredUnconditional();
  contract.obligations[name] = o;
  return o;
}

function livePower(name, contract) {
  const creditor = new Role('creditor', contract);
  const debtor = new Role('debtor', contract);
  const p = new Power(name, creditor, debtor, contract);
  p.trigerredUnconditional();
  contract.powers[name] = p;
  return p;
}

function spyListeners() {
  const calls = { unsuccessful: 0, successful: 0 };
  return {
    calls,
    unsuccessfullyTerminateContract() { calls.unsuccessful += 1; },
    successfullyTerminateContract() { calls.successful += 1; },
  };
}

describe('violation policy (O9/R4)', () => {
  it('terminates the contract on an UNHANDLED violation (default policy)', () => {
    const contract = freshContract();
    const o = inEffectObligation('oX', contract);
    const listeners = spyListeners();
    Events.init([], listeners);
    o.violated();
    expect(listeners.calls.unsuccessful).to.equal(1);
  });

  it('defers termination when a live remedial power already exists', () => {
    const contract = freshContract();
    const o = inEffectObligation('oX', contract);
    livePower('pRemedy', contract);
    const listeners = spyListeners();
    Events.init([], listeners);
    o.violated();
    expect(listeners.calls.unsuccessful).to.equal(0);
    expect(contract.isUnsuccessfulTermination()).to.be.false;
  });

  it('defers termination when the violation creates a reparation obligation', () => {
    const contract = freshContract();
    const o = inEffectObligation('oX', contract);
    const listeners = spyListeners();
    const subscription = [
      [new InternalEvent(InternalEventSource.obligation, InternalEventType.obligation.Violated, o)],
      (c) => { inEffectObligation('oReparation', c); },
    ];
    Events.init([subscription], listeners);
    o.violated();
    expect(listeners.calls.unsuccessful).to.equal(0);
    expect(contract.obligations.oReparation.isInEffect()).to.be.true;
  });

  it('defers termination when the violation creates a power (legacy behaviour kept)', () => {
    const contract = freshContract();
    const o = inEffectObligation('oX', contract);
    const listeners = spyListeners();
    const subscription = [
      [new InternalEvent(InternalEventSource.obligation, InternalEventType.obligation.Violated, o)],
      (c) => { livePower('pRemedy', c); return { powerCreated: true, powerName: 'pRemedy' }; },
    ];
    Events.init([subscription], listeners);
    o.violated();
    expect(listeners.calls.unsuccessful).to.equal(0);
    expect(o._createdPowerNames).to.deep.equal(['pRemedy']);
  });

  it("policy 'eager' ignores pre-existing powers (legacy semantics)", () => {
    const contract = freshContract();
    contract.violationPolicy = 'eager';
    const o = inEffectObligation('oX', contract);
    livePower('pRemedy', contract);
    const listeners = spyListeners();
    Events.init([], listeners);
    o.violated();
    expect(listeners.calls.unsuccessful).to.equal(1);
  });

  it("policy 'manual' never auto-terminates (ontology-strict)", () => {
    const contract = freshContract();
    contract.violationPolicy = 'manual';
    const o = inEffectObligation('oX', contract);
    const listeners = spyListeners();
    Events.init([], listeners);
    o.violated();
    expect(listeners.calls.unsuccessful).to.equal(0);
  });

  it('a finished power does not count as a live remedy', () => {
    const contract = freshContract();
    const o = inEffectObligation('oX', contract);
    const p = livePower('pSpent', contract);
    p.exerted();
    const listeners = spyListeners();
    Events.init([], listeners);
    o.violated();
    expect(listeners.calls.unsuccessful).to.equal(1);
  });
});

describe('interval-based HappensWithin (R1)', () => {
  function happenedAt(iso) {
    const e = new Event();
    e.happen();
    e._timestamp = iso;
    return e;
  }

  it('an event from before the suspension does not count as within it', () => {
    const contract = freshContract();
    const o = inEffectObligation('oX', contract);
    Events.init([], spyListeners());
    const before = happenedAt('2020-01-01T00:00:00.000Z');
    o.suspended();
    expect(o.isSuspended()).to.be.true;
    expect(Predicates.happensWithin(before, o, 'Obligation.Suspension')).to.be.false;
  });

  it('an event during an open suspension counts', () => {
    const contract = freshContract();
    const o = inEffectObligation('oX', contract);
    Events.init([], spyListeners());
    o.suspended();
    const during = new Event();
    during.happen();
    expect(Predicates.happensWithin(during, o, 'Obligation.Suspension')).to.be.true;
  });

  it('an event during a CLOSED suspension episode still counts after resume', () => {
    const contract = freshContract();
    const o = inEffectObligation('oX', contract);
    Events.init([], spyListeners());
    o.suspended();
    const during = new Event();
    during.happen();
    o.resumed();
    expect(o.isSuspended()).to.be.false;
    // Historical (state-based) semantics returned false here.
    expect(Predicates.happensWithin(during, o, 'Obligation.Suspension')).to.be.true;
  });

  it('an event from before a closed episode does not count', () => {
    const contract = freshContract();
    const o = inEffectObligation('oX', contract);
    Events.init([], spyListeners());
    const before = happenedAt('2020-01-01T00:00:00.000Z');
    o.suspended();
    o.resumed();
    expect(Predicates.happensWithin(before, o, 'Obligation.Suspension')).to.be.false;
  });

  it('falls back to state-based semantics when no transition stamps exist', () => {
    const contract = freshContract();
    const creditor = new Role('creditor', contract);
    const debtor = new Role('debtor', contract);
    const o = new Obligation('oX', creditor, debtor, contract);
    // Force the state without going through the stamped transitions.
    o.setActiveState('Suspension');
    o._events = {};
    const e = happenedAt('2020-01-01T00:00:00.000Z');
    expect(Predicates.happensWithin(e, o, 'Obligation.Suspension')).to.be.true;
  });
});
