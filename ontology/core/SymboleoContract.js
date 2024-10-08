const { Event } = require('./Event.js');
const { Party } = require('./Party.js');
//sofana-AC
const { Resource } = require('./Resource.js');


const { Events } = require('../Events.js');
const {
  InternalEvent,
  InternalEventSource,
  InternalEventType,
} = require('./InternalEvents.js');

const ContractState = {
  Form: 'Form',
  Active: 'Active',
  SuccessfulTermination: 'SuccessfulTermination',
  UnsuccessfulTermination: 'UnsuccessfulTermination',
};

const ContractActiveState = {
  Null: 'Null',
  InEffect: 'InEffect',
  Suspension: 'Suspension',
  Unassign: 'Unassign',
  Rescission: 'Rescission',
};

//AC- extends and controller to constructor and super
class SymboleoContract extends Resource {
  constructor(name,controllerList) {//controllerList
    //Sofana-AC
    super(controllerList);
    const now = new Date();
    // eslint-disable-next-line max-len
    this.id = `${name}_${now.getUTCFullYear()}${now.getUTCMonth()}${now.getUTCDate()}${now.getUTCHours()}`;
    this.setActiveState(ContractActiveState.Null);
    this.setState(ContractState.Form);
    this._events = {};
    this._roles = [];
    this._parties = [];
    this._assets = [];
    this._legalPositions = [];
    this._subContracts = [];
    this._terminators = [];
    this._parentContract = null;
  }

  isInEffect() {
    return this.state === ContractState.Active
    && this.activeState === ContractActiveState.InEffect;
  }

  isActive() {
    return this.state === ContractState.Active;
  }

  isForm() {
    return this.state === ContractState.Form;
  }

  isUnassign() {
    return this.state === ContractState.Active
    && this.activeState === ContractActiveState.Unassign;
  }

  isRescission() {
    return this.state === ContractState.Active
    && this.activeState === ContractActiveState.Rescission;
  }

  isSuspended() {
    return this.state === ContractState.Active
    && this.activeState === ContractActiveState.Suspension;
  }

  isUnsuccessfulTermination() {
    return this.state === ContractState.UnsuccessfulTermination;
  }

  isSuccessfulTermination() {
    return this.state === ContractState.SuccessfulTermination;
  }

  // checks that is in an end state
  isFinished() {
    return this.state === ContractState.SuccessfulTermination
      || this.state === ContractState.UnsuccessfulTermination;
  }

  activated() {
    let wasEventProcessed = false;

    const aStatus = this.state;
    switch (aStatus) {
      case ContractState.Form:
        this.setActiveState(ContractActiveState.InEffect);
        wasEventProcessed = true;
        this._events.Activated = new Event();
        this._events.Activated.happen();
        Events.emitEvent(
          this,
          new InternalEvent(
            InternalEventSource.contract,
            InternalEventType.contract.Activated,
            this,
          ),
        );
        break;
      default:
      // Other states do respond to this event
    }

    return wasEventProcessed;
  }

  terminated() {
    let wasEventProcessed = false;

    const aStatus = this.state;
    switch (aStatus) {
      case ContractState.Active:
        this.exitStatus();
        this.setState(ContractState.UnsuccessfulTermination);
        wasEventProcessed = true;
        this._events.Terminated = new Event();
        this._events.Terminated.happen();
        Events.emitEvent(
          this,
          new InternalEvent(
            InternalEventSource.contract,
            InternalEventType.contract.Terminated,
            this,
          ),
        );
        break;
      default:
      // Other states do respond to this event
    }

    return wasEventProcessed;
  }

  rescinded() {
    let wasEventProcessed = false;

    const aStatusActive = this.activeState;
    switch (aStatusActive) {
      case ContractActiveState.InEffect:
        this.exitStatusActive();
        this.setActiveState(ContractActiveState.Rescission);
        wasEventProcessed = true;
        this._events.Rescinded = new Event();
        this._events.Rescinded.happen();
        Events.emitEvent(
          this,
          new InternalEvent(
            InternalEventSource.contract,
            InternalEventType.contract.Rescinded,
            this,
          ),
        );
        break;
      default:
      // Other states do respond to this event
    }

    return wasEventProcessed;
  }

  suspended() {
    let wasEventProcessed = false;

    const aStatusActive = this.activeState;
    switch (aStatusActive) {
      case ContractActiveState.InEffect:
        this.exitStatusActive();
        this.setActiveState(ContractActiveState.Suspension);
        wasEventProcessed = true;
        this._events.Suspended = new Event();
        this._events.Suspended.happen();
        Events.emitEvent(
          this,
          new InternalEvent(
            InternalEventSource.contract,
            InternalEventType.contract.Suspended,
            this,
          ),
        );
        break;
      default:
      // Other states do respond to this event
    }

    return wasEventProcessed;
  }

  fulfilledActiveObligations() {
    let wasEventProcessed = false;

    const aStatusActive = this.activeState;
    switch (aStatusActive) {
      case ContractActiveState.InEffect:
        this.exitStatus();
        this.setState(ContractState.SuccessfulTermination);
        wasEventProcessed = true;
        this._events.FulfilledObligations = new Event();
        this._events.FulfilledObligations.happen();
        Events.emitEvent(
          this,
          new InternalEvent(
            InternalEventSource.contract,
            InternalEventType.contract.FulfilledObligations,
            this,
          ),
        );

        break;
      default:
      // Other states do respond to this event
    }
    return wasEventProcessed;
  }

  resumed() {
    let wasEventProcessed = false;

    const aStatusActive = this.activeState;
    switch (aStatusActive) {
      case ContractActiveState.Suspension:
        this.exitStatusActive();
        this.setActiveState(ContractActiveState.InEffect);
        wasEventProcessed = true;
        this._events.Resumed = new Event();
        this._events.Resumed.happen();
        Events.emitEvent(
          this,
          new InternalEvent(
            InternalEventSource.contract,
            InternalEventType.contract.Resumed,
            this,
          ),
        );
        break;
      default:
      // Other states do respond to this event
    }

    return wasEventProcessed;
  }

  exitStatus() {
    switch (this.state) {
      case ContractState.Active:
        this.exitStatusActive();
        break;
      default: break;
    }
  }

  setState(aStatus) {
    this.state = aStatus;
    // entry actions and do activities
    switch (this.state) {
      case ContractState.Active:
        if (this.activeState === ContractActiveState.Null) {
          this.setActiveState(ContractActiveState.InEffect);
        }
        break;
      case ContractState.SuccessfulTermination:
        // delete();
        break;
      case ContractState.UnsuccessfulTermination:
        // delete();
        break;
      default: break;
    }
  }

  exitStatusActive() {
    switch (this.activeState) {
      case ContractActiveState.InEffect:
        this.setActiveState(ContractActiveState.Null);
        break;
      case ContractActiveState.Suspension:
        // delete();
        this.setActiveState(ContractActiveState.Null);
        // delete();
        break;
      case ContractActiveState.Unassign:
        this.setActiveState(ContractActiveState.Null);
        break;
      case ContractActiveState.Rescission:
        this.setActiveState(ContractActiveState.Null);
        break;
      default: break;
    }
  }

  setActiveState(aStatusActive) {
    this.activeState = aStatusActive;
    if (this.state !== ContractState.Active
      && aStatusActive !== ContractActiveState.Null) {
      this.setState(ContractState.Active);
    }

    // entry actions and do activities
    switch (aStatusActive) {
      case ContractActiveState.Rescission:
        // delete();
        break;
      default: break;
    }
  }

  getLegalPosition(index) {
    return this._legalPositions[index];
  }

  getLegalPositions() {
    return this._legalPositions;
  }

  numberOfLegalPositions() {
    return this._legalPositions.length;
  }

  hasLegalPositions() {
    return this._legalPositions.length > 0;
  }

  indexOfLegalPosition(aLegalPosition) {
    const index = this._legalPositions.findIndex((o) => o.equals(aLegalPosition));
    return index;
  }

  getRole(index) {
    return this._roles[index];
  }

  getRoles() {
    return this._roles;
  }

  numberOfRoles() {
    return this._roles.length;
  }

  hasRoles() {
    return this._roles.length > 0;
  }

  indexOfRole(aRole) {
    const index = this._roles.findIndex((o) => o.equals(aRole));
    return index;
  }

  getParty(index) {
    return this._parties[index];
  }

  getParties() {
    return this._parties;
  }

  numberOfParties() {
    return this._parties.length;
  }

  hasParties() {
    return this._parties.length > 0;
  }

  indexOfParty(aParty) {
    const index = this._parties.findIndex((o) => o.equals(aParty));
    return index;
  }

  getAsset(index) {
    return this._assets[index];
  }

  getAssets() {
    return this._assets;
  }

  numberOfAssets() {
    return this._assets.length;
  }

  hasAssets() {
    return this._assets.length > 0;
  }

  indexOfAsset(aAsset) {
    const index = this._assets.findIndex((o) => o.equals(aAsset));
    return index;
  }

  getSubContract(index) {
    return this._subContracts[index];
  }

  getSubContracts() {
    return this._subContracts;
  }

  numberOfSubContracts() {
    return this._subContracts.length;
  }

  hasSubContracts() {
    return this._subContracts.length > 0;
  }

  indexOfSubContract(aSubContract) {
    const index = this._subContracts.findIndex((o) => o.equals(aSubContract));
    return index;
  }

  getTerminator(index) {
    return this._terminators[index];
  }

  getTerminators() {
    return this._terminators;
  }

  numberOfTerminators() {
    return this._terminators.length;
  }

  hasTerminators() {
    return this._terminators.length > 0;
  }

  indexOfTerminator(aTerminator) {
    const index = this._terminators.findIndex((o) => o.equals(aTerminator));
    return index;
  }

  getParentContract() {
    return this._parentContract;
  }

  hasParentContract() {
    const has = this._parentContract != null;
    return has;
  }

  isNumberOfLegalPositionsValid() {
    const isValid = this.numberOfLegalPositions()
    >= this.minimumNumberOfLegalPositions();
    return isValid;
  }

  static minimumNumberOfLegalPositions() {
    return 2;
  }

  addLegalPosition(aLegalPosition) {
    let wasAdded = false;
    if (this._legalPositions.some((o) => o.equals(aLegalPosition))) {
      return false;
    }
    const existingContract = aLegalPosition.getContract();
    const isNewContract = existingContract != null
    && !this.equals(existingContract);

    if (isNewContract && existingContract.numberOfLegalPositions()
     <= this.minimumNumberOfLegalPositions()) {
      return wasAdded;
    }
    if (isNewContract) {
      aLegalPosition.setContract(this);
    } else {
      this._legalPositions.push(aLegalPosition);
    }
    wasAdded = true;
    return wasAdded;
  }

  removeLegalPosition(aLegalPosition) {
    let wasRemoved = false;
    if (this.equals(aLegalPosition.getContract())) {
      return wasRemoved;
    }

    if (this.numberOfLegalPositions() <= this.minimumNumberOfLegalPositions()) {
      return wasRemoved;
    }

    const index = this._legalPositions.findIndex((o) => o.equals(aLegalPosition));
    this._legalPositions.splice(index, 1);
    wasRemoved = true;
    return wasRemoved;
  }

  isNumberOfRolesValid() {
    const isValid = this.numberOfRoles() >= this.minimumNumberOfRoles();
    return isValid;
  }

  static minimumNumberOfRoles() {
    return 2;
  }

  addRole(aRole) {
    let wasAdded = false;
    if (this._roles.some((o) => o.equals(aRole))) {
      return false;
    }
    //console.log("I am in addRoleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
    const existingContract = aRole.getContract();
    const isNewContract = existingContract != null
    && !this.equals(existingContract);

    if (isNewContract
      && existingContract.numberOfRoles() <= this.minimumNumberOfRoles()) {
      return wasAdded;
    }
    if (isNewContract) {
      aRole.setContract(this);
    } else {
      this._roles.push(aRole);
    }
    wasAdded = true;
    return wasAdded;
  }

  removeRole(aRole) {
    let wasRemoved = false;
    if (this.equals(aRole.getContract())) {
      return wasRemoved;
    }

    if (this.numberOfRoles() <= this.minimumNumberOfRoles()) {
      return wasRemoved;
    }

    const index = this._roles.findIndex((o) => o.equals(aRole));
    this._roles.splice(index, 1);
    wasRemoved = true;
    return wasRemoved;
  }

  isNumberOfPartiesValid() {
    const isValid = this.numberOfParties() >= this.minimumNumberOfParties();
    return isValid;
  }

  static minimumNumberOfParties() {
    return 2;
  }

  addParty(aParty) {
    let wasAdded = false;
    if (this._parties.some((o) => o.equals(aParty))) { return false; }
    this._parties.push(aParty);
    if (aParty.indexOfContract(this) !== -1) {
      wasAdded = true;
    } else {
      wasAdded = aParty.addContract(this);
      if (!wasAdded) {
        const index = this._parties.findIndex((o) => o.equals(aParty));
        this._parties.splice(index, 1);
      }
    }

    return wasAdded;
  }

  removeParty(aParty) {
    let wasRemoved = false;
    if (!this._parties.some((o) => o.equals(aParty))) {
      return wasRemoved;
    }

    if (this.numberOfParties() <= this.minimumNumberOfParties()) {
      return wasRemoved;
    }

    const oldIndex = this._parties.findIndex((o) => o.equals(aParty));
    this._parties.splice(oldIndex, 1);
    if (aParty.indexOfContract(this) === -1) {
      wasRemoved = true;
    } else {
      wasRemoved = aParty.removeContract(this);
      if (!wasRemoved) {
        this._parties.splice(oldIndex, 0, aParty);
      }
    }
    return wasRemoved;
  }

  static minimumNumberOfAssets() {
    return 0;
  }

  addAsset(aAsset) {
    let wasAdded = false;
    if (this._assets.some((o) => o.equals(aAsset))) {
      return false;
    }
    const existingContract = aAsset.getContract();
    const isNewContract = existingContract != null
    && !this.equals(existingContract);
    if (isNewContract) {
      aAsset.setContract(this);
    } else {
      this._assets.add(aAsset);
    }
    wasAdded = true;
    return wasAdded;
  }

  removeAsset(aAsset) {
    let wasRemoved = false;
    if (!this.equals(aAsset.getContract())) {
      const index = this._assets.findIndex((o) => o.equals(aAsset));
      this._assets.splice(index, 1);
      wasRemoved = true;
    }
    return wasRemoved;
  }

  static minimumNumberOfSubContracts() {
    return 0;
  }

  addSubContract(aSubContract) {
    let wasAdded = false;
    if (this._subContracts.contains(aSubContract)) {
      return false;
    }
    const existingParentContract = aSubContract.getParentContract();
    if (existingParentContract == null) {
      aSubContract.setParentContract(this);
    } else if (!this.equals(existingParentContract)) {
      existingParentContract.removeSubContract(aSubContract);
      this.addSubContract(aSubContract);
    } else {
      this._subContracts.push(aSubContract);
    }
    wasAdded = true;
    return wasAdded;
  }

  removeSubContract(aSubContract) {
    let wasRemoved = false;
    if (this._subContracts.some((o) => o.equals(aSubContract))) {
      const index = this._subContracts.findIndex((o) => o.equals(aSubContract));
      this._subContracts.splice(index, 1);
      aSubContract.setParentContract(null);
      wasRemoved = true;
    }
    return wasRemoved;
  }

  static minimumNumberOfTerminators() {
    return 0;
  }

  addTerminator(aTerminator) {
    let wasAdded = false;
    if (this._terminators.some((o) => o.equals(aTerminator))) {
      return false;
    }
    const existingTerminated = aTerminator.getTerminated();
    if (existingTerminated == null) {
      aTerminator.setTerminated(this);
    } else if (!this.equals(existingTerminated)) {
      existingTerminated.removeTerminator(aTerminator);
      this.addTerminator(aTerminator);
    } else {
      this._terminators.push(aTerminator);
    }
    wasAdded = true;
    return wasAdded;
  }

  removeTerminator(aTerminator) {
    let wasRemoved = false;
    if (this._terminators.some((o) => o.equals(aTerminator))) {
      const index = this._terminators.findIndex((o) => o.equals(aTerminator));
      this._terminators.splice(index, 1);
      aTerminator.setTerminated(null);
      wasRemoved = true;
    }
    return wasRemoved;
  }

  setParentContract(aParentContract) {
    let wasSet = false;
    const existingParentContract = this._parentContract;
    this._parentContract = aParentContract;
    if (existingParentContract != null
      && !existingParentContract.equals(aParentContract)) {
      existingParentContract.removeSubContract(this);
    }
    if (aParentContract != null) {
      aParentContract.addSubContract(this);
    }
    wasSet = true;
    return wasSet;
  }

  delete() {
    while (this._legalPositions.length > 0) {
      const aLegalPosition = this._legalPositions[this._legalPositions.length - 1];
      aLegalPosition.delete();
      const index = this._legalPositions.findIndex((o) => o.equals(aLegalPosition));
      this._legalPositions.splice(index, 1);
    }

    while (this._roles.length > 0) {
      const aRole = this._roles[this._roles.length - 1];
      aRole.delete();
      const index = this._roles.findIndex((o) => o.equals(aRole));
      this._roles.splice(index, 1);
    }

    for (const aParty of this._parties) {
      if (aParty.numberOfContracts() <= Party.minimumNumberOfContracts()) {
        aParty.delete();
      } else {
        aParty.removeContract(this);
      }
    }
    for (let i = this._assets.length; i > 0; i--) {
      const aAsset = this._assets[i - 1];
      aAsset.delete();
    }
    while (this._subContracts.length > 0) {
      this._subContracts[0].setParentContract(null);
    }
    while (this._terminators.length > 0) {
      this._terminators[0].setTerminated(null);
    }
    if (this._parentContract != null) {
      const placeholderParentContract = this._parentContract;
      this._parentContract = null;
      placeholderParentContract.removeSubContract(this);
    }
  }

  equals(obj) {
    return obj.id != null && obj instanceof SymboleoContract && obj.id === this.id;
  }
}

module.exports.SymboleoContract = SymboleoContract;
module.exports.ContractState = ContractState;
module.exports.ContractActiveState = ContractActiveState;
