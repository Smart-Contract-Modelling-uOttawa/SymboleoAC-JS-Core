const { SymboleoContract } = require('./SymboleoContract.js');
const { Resource } = require('./Resource.js');


//deleted -->here I added resources = [], and below this._resources = resources; resources = []// deleted
// here I added aAuthentication, ...allController in the constructor and send them to the super
//***we did not decied controller 
class Role extends Resource  {
  constructor(id, contract, party = null, debt = [], credit = []) {
    super();
    this._id = id;
    this._contract = contract;
    this._debt = debt;
    this._credit = credit;
    this._party = party;

  }

  getDebt(index) {
    return this._debt[index];
  }

  getDebts() {
    return this._debt;
  }

  numberOfDebt() {
    return this._debt.length;
  }

  hasDebt() {
    return this._debt.length > 0;
  }

  getCredit(index) {
    return this._credit[index];
  }

  getCredits() {
    return this._credit;
  }

  numberOfCredit() {
    return this._credit.length;
  }

  hasCredit() {
    return this._credit.length > 0;
  }

  getParty() {
    return this._party;
  }

  hasParty() {
    return this._party != null;
  }

  getContract() {
    console.log("I am inside get Contracttttttttttttttttttttttttttttttttttttt")
    return this._contract;
  }

  indexOfDebt(a) {
    const index = this._debt.findIndex((o) => o.equals(a));
    return index;
  }

  indexOfCredit(a) {
    const index = this._credit.findIndex((o) => o.equals(a));
    return index;
  }

  //sofana AC for addController (bidirectional assosication)
  /*
  getResource(index) {
    return this._resources[index];
  }

  numberOfResources() {
    return this._resources.length;
  }

  hasResources() {
    return this._resources.length > 0;
  }

  indexOfResource(aResource) {
    const index = this._resources.findIndex((o) => o.equals(aResource));
    return index;
    }

  addResource(aResource) {
    console.log("I am insde addResource in Role class")
      let wasAdded = false;
  
      if (this._resources.some(aResource.equals)) {
          return false;
      }
  
      this._resources.push(aResource);
  
      if (aResource.indexOfController(this) !== -1) {
          wasAdded = true;
      } else {
          wasAdded = aResource.addController(this);
  
          if (!wasAdded) {
            const index = this._resources.findIndex((o) => o.equals(aResource));
            this._resources.splice(index, 1);
          }
      }
  
      return wasAdded;
  } 

  removeResource(aResource) {
    let wasRemoved = false;
    if (!this._resources.some((o) => o.equals(aResource))) {
      return wasRemoved;
    }

    const oldIndex = this._resources.findIndex((o) => o.equals(aResource));
    this._resources.splice(oldIndex, 1);
    if (aResource.indexOfController(this) === -1) {
      wasRemoved = true;
    } else {
      wasRemoved = aResource.removeController(this);
      if (!wasRemoved) {
        this._resources.splice(oldIndex, 0, aResource);
      }
    }
    return wasRemoved;
  }
  */
  //sofana

  //Sofana-AC
  // line 48 "model.ump"
authorize(role, resource, operation) {
  // Your implementation here
}

// line 51 "model.ump"
authorize(role, resource, attribute, permission) {
  // Your implementation here
}

// line 53 "model.ump"
authorize(role, resource, permission) {
  // Your implementation here
}

// line 55 "model.ump"
deAuthorize(role, resource, operation) {
  // Your implementation here
}

// line 57 "model.ump"
deAuthorize(role, resource, attribute, permission) {
  // Your implementation here
}

// line 59 "model.ump"
deAuthorize(role, resource, permission) {
  // Your implementation here
}
//Sofana-AC
 
  addDebt(aDebt) {
    let wasAdded = false;
    if (this._debt.some((o) => o.equals(aDebt))) {
      return false;
    }
    const existingDebtor = aDebt.getDebtor();
    const isNewDebtor = existingDebtor != null && !this.equals(existingDebtor);
    if (isNewDebtor) {
      aDebt.setDebtor(this);
    } else {
      this._debt.push(aDebt);
    }
    wasAdded = true;
    return wasAdded;
  }

  removeDebt(aDebt) {
    let wasRemoved = false;
    if (!this.equals(aDebt.getDebtor())) {
      const index = this._debt.findIndex((o) => o.equals(aDebt));
      this._debt.splice(index, 1);
      wasRemoved = true;
    }
    return wasRemoved;
  }

  addCredit(aCredit) {
    let wasAdded = false;
    if (this._credit.some((d) => d.equals(aCredit))) {
      return false;
    }
    const existingCreditor = aCredit.getCreditor();
    const isNewCreditor = existingCreditor != null && !this.equals(existingCreditor);
    if (isNewCreditor) {
      aCredit.setCreditor(this);
    } else {
      this._credit.push(aCredit);
    }
    wasAdded = true;
    return wasAdded;
  }

  removeCredit(aCredit) {
    let wasRemoved = false;
    if (!this.equals(aCredit.getCreditor())) {
      const index = this._credit.findIndex((o) => o.equals(aCredit));
      this._credit.splice(index, 1);
      wasRemoved = true;
    }
    return wasRemoved;
  }

  static minimumNumberOfDebt() {
    return 0;
  }

  static minimumNumberOfCredit() {
    return 0;
  }

  setParty(aParty) {
    let wasSet = false;
    let existingParty = this._party;

    if (existingParty == null) {
      if (aParty != null) {
        if (aParty.addRole(this)) {
          existingParty = aParty;
          wasSet = true;
        }
      }
    } else if (existingParty != null) {
      if (aParty == null) {
        if (existingParty.minimumNumberOfRoles() < existingParty.numberOfRoles()) {
          existingParty.removeRole(this);
          existingParty = aParty;
          wasSet = true;
        }
      } else if (existingParty.minimumNumberOfRoles()
      < existingParty.numberOfRoles()) {
        existingParty.removeRole(this);
        aParty.addRole(this);
        existingParty = aParty;
        wasSet = true;
      }
    }
    if (wasSet) {
      this._party = existingParty;
    }
    return wasSet;
  }

  setContract(aContract) {
    let wasSet = false;
    if (aContract == null) {
      return wasSet;
    }

    if (this._contract != null
      && this._contract.numberOfRoles() <= SymboleoContract.minimumNumberOfRoles()) {
      return wasSet;
    }

    const existingContract = this._contract;
    this._contract = aContract;
    if (existingContract != null && !existingContract.equals(aContract)) {
      const didRemove = existingContract.removeRole(this);
      if (!didRemove) {
        this._contract = existingContract;
        return wasSet;
      }
    }
    this._contract.addRole(this);
    wasSet = true;
    return wasSet;
  }

  delete() {
    for (let i = this._debt.size(); i > 0; i--) {
      const aDebt = this._debt[i - 1];
      aDebt.delete();
    }
    for (let i = this._credit.size(); i > 0; i--) {
      const aCredit = this._credit[i - 1];
      aCredit.delete();
    }
    if (this._party != null) {
      if (this._party.numberOfRoles() <= 1) {
        this._party.delete();
      } else {
        const placeholderParty = this._party;
        this.party = null;
        placeholderParty.removeRole(this);
      }
    }
    const placeholderContract = this._contract;
    this._contract = null;
    if (placeholderContract != null) {
      placeholderContract.removeRole(this);
    }
  }

  equals(obj) {
    return obj._id != null && obj instanceof Role && obj._id === this._id;
  }
}

module.exports.Role = Role;
