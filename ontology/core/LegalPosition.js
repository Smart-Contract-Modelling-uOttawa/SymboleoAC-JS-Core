const { SymboleoContract } = require('./SymboleoContract.js');
//sofana
const { Party } = require('./Party.js');
const { Resource } = require('./Resource.js');
const { LegalSituation } = require('./LegalSituation.js');
const _ = require('lodash');


//sofana

//sofana-AC here I added extends
//sofana-AC here I added controller in the constucture
//Sofana-AC here I added name, controller to super, name cuz I get an error without it, and I need it to work for equlas in Resource, myabe I need to define id insted of name for class resource
//Sofana-AC here I added Rule and in the super as well 
//Sofana-Ac for controller the default we add it to the constrctor in the legal position class, and here (serlizer) we retrive the last value of controller in obligation.controller
class LegalPosition extends Resource  {
  constructor(name, creditor, debtor, contract,controller,aLegalSituation) {
    //Sofana-AC
    super(controller)
    //Sofana-AC
    this.name = name;
    this.creditor = creditor;
    this.debtor = debtor;
    this.contract = contract;
    this._performer = []; 
    //Sofana-AC (1) to add default valur to performer 
    this._performer.push(debtor);
    //Sofana-AC
    this._liable = [];
    //Sofana-AC (2) to add default valur to liable 
    this._liable.push(debtor);
    //Sofana-AC
    this._rightHolder = [];
    //Sofana-AC (3) to add default valur to rightholder 
    this._rightHolder.push(creditor);
    //Sofana-AC
    this.asset = null;
    //AC
    ////console.log("aLegalSituation")
    ////console.log(aLegalSituation)
    this.antecedent = [];
    this.consequent = [];

    if(typeof aLegalSituation === 'object' && !Array.isArray(aLegalSituation)){
      if(aLegalSituation === null)
      return
      if(typeof aLegalSituation === 'undefined')
      return
      this.antecedent = aLegalSituation.getAntecedentOfAll();
      this.consequent = aLegalSituation.getConsequentOfAll();
    }else{//this if check if the controller is a list of objects 
      if (typeof aLegalSituation === 'undefined' || aLegalSituation === null || aLegalSituation.length <= 0 || typeof aLegalSituation[0] === 'undefined') { //|| !Array.isArray(allController)
        //////console.log("return without adding in resource-------------------------------------");
        return;
      }
      this.antecedent = aLegalSituation.getAntecedentOfAll();
      this.consequent = aLegalSituation.getConsequentOfAll();
    }//else

   
    //this.antecedent = aLegalSituation.getAntecedentOfAll();
    //AC
    //this.consequent = aLegalSituation.getConsequentOfAll();
    this.trigger = null;
  }

  getPerformer(index) {
    const aPerformer = this.performer[index];
    return aPerformer;
  }

  getPerformerAll() {
    return this.performer;
  }

  numberOfPerformer() {
    return this.performer.length;
  }

  hasPerformer() {
    return this.performer.length > 0;
  }

  indexOfPerformer(aPerformer) {
    const index = this.performer.findIndex((o) => o.equals(aPerformer));
    return index;
  }
  
  //AC
  //utlity function
  findPerformer(aPerformer){
    //console.log("aPerformer")
    //console.log(aPerformer)
    //console.log("this._performer")
    //console.log(this._performer)

    let isPerformer = false
    //////console.log("I am inside findController")
    //this._controller.find(obj => obj === aController)
    //////console.log(aController)
    isPerformer = this._performer.some(obj => obj._name === aPerformer._name && obj._type === aPerformer._type)
    ////console.log(isPerformer); // true
    //this._performer.forEach(obj => {if(obj === aPerformer){
      //////console.log("I am inside if in findController")
      //isPerformer = true;
      return isPerformer
    //}  //////console.log("obj")
     //////console.log(obj)
  //})
    //return  isPerformer  
  }

  getLiable(index) {
    const a = this.liable[index];
    return a;
  }

  getLiableAll() {
    return this.liable;
  }

  numberOfLiable() {
    return this.liable.length;
  }

  hasLiable() {
    return this.liable.length > 0;
  }

  indexOfLiable(aLiable) {
    const index = this.liable.findIndex((o) => o.equals(aLiable));
    return index;
  }

  getRightHolder(index) {
    const a = this.rightHolder[index];
    return a;
  }

  getRightHolderAll() {
    return this.rightHolder;
  }

  numberOfRightHolder() {
    return this.rightHolder.length;
  }

  hasRightHolder() {
    return this.rightHolder.length > 0;
  }

  indexOfRightHolder(arg) {
    const index = this.rightHolder.findIndex((o) => o.equals(arg));
    return index;
  }

  //AC
  //utlity function
  findRightHolder(aRightHolder){
    let isRightHolder = false
    //////console.log("I am inside findController")
    //this._controller.find(obj => obj === aController)
    //////console.log(aController)
    isRightHolder = this._rightHolder.some(obj => obj._name === aRightHolder._name && obj._type === aRightHolder._type)
    ////console.log(isRightHolder); // true
    //this._performer.forEach(obj => {if(obj === aPerformer){
      //////console.log("I am inside if in findController")
      //isPerformer = true;
      return isRightHolder
    //}  //////console.log("obj")
     //////console.log(obj)
  //})
    //return  isPerformer  
  }

  static minimumNumberOfPerformer() {
    return 0;
  }
  
  //AC
  //Modefication - utlity function 
  addPerformer(aPerformer) {
    let wasAdded = false;
    if (!this.findPerformer(aPerformer) && !(typeof aPerformer === 'undefined') 
    && !(aPerformer === null)) {
    this._performer.push(aPerformer);
    wasAdded = true;
    }
    return wasAdded;  
  }

  removePerformer(aPerformer) {
    let wasRemoved = false;
    if (!this.performer.some((o) => o.equals(aPerformer))) {
      return wasRemoved;
    }

    const oldIndex = this.performer.findIndex((o) => o.equals(aPerformer));
    this.performer.splice(oldIndex, 1);
    if (aPerformer.indexOfPerformerOf(this) === -1) {
      wasRemoved = true;
    } else {
      wasRemoved = aPerformer.removePerformerOf(this);
      if (!wasRemoved) {
        this.performer.splice(oldIndex, 0, aPerformer);
      }
    }
    return wasRemoved;
  }

  static minimumNumberOfLiable() {
    return 0;
  }

  //AC
  //Modification
  addLiable(aLiable) {
    let wasAdded = false;
    if (!this.findLiable(aLiable) && !(typeof aLiable === 'undefined') 
    && !(aLiable === null)) {
    this._liable.push(aLiable);
    wasAdded = true;
    }
    return wasAdded;  
  }

  //AC
  //utlity function
  findLiable(aLiable){
    let isLiable = false
    //////console.log("I am inside findController")
    //this._controller.find(obj => obj === aController)
    //////console.log(aController)
    isLiable = this._liable.some(obj => obj._name === aLiable._name && obj._type === aLiable._type)
    ////console.log(isLiable); // true
    //this._performer.forEach(obj => {if(obj === aPerformer){
      //////console.log("I am inside if in findController")
      //isPerformer = true;
      return isLiable
    //}  //////console.log("obj")
     //////console.log(obj)
  //})
    //return  isPerformer  
  }

  removeLiable(aLiable) {
    let wasRemoved = false;
    if (!this.liable.some((o) => o.equals(aLiable))) {
      return wasRemoved;
    }

    const oldIndex = this.liable.findIndex((o) => o.equals(aLiable));
    this.liable.splice(oldIndex, 1);
    if (aLiable.indexOfLiableOf(this) === -1) {
      wasRemoved = true;
    } else {
      wasRemoved = aLiable.removeLiableOf(this);
      if (!wasRemoved) {
        this.liable.splice(oldIndex, 0, aLiable);
      }
    }
    return wasRemoved;
  }

  static minimumNumberOfRightHolder() {
    return 0;
  }

  //AC
  //Modification
  addRightHolder(aRightHolder) {
    let wasAdded = false;
    if (!this.findRightHolder(aRightHolder) && !(typeof aRightHolder === 'undefined') 
    && !(aRightHolder === null)) {
    this._rightHolder.push(aRightHolder);
    wasAdded = true;
    }
    return wasAdded; 
  }

  removeRightHolder(aRightHolder) {
    let wasRemoved = false;
    if (!this.rightHolder.some((o) => o.equals(aRightHolder))) {
      return wasRemoved;
    }

    const oldIndex = this.rightHolder.findIndex(aRightHolder);
    this.rightHolder.splice(oldIndex, 1);
    if (aRightHolder.indexOfRightHolderOf(this) === -1) {
      wasRemoved = true;
    } else {
      wasRemoved = aRightHolder.removeRightHolderOf(this);
      if (!wasRemoved) {
        this.rightHolder.splice(oldIndex, 0, aRightHolder);
      }
    }
    return wasRemoved;
  }

  setContract(aContract) {
    let wasSet = false;
    if (aContract == null) {
      return wasSet;
    }

    if (this.contract != null
      && this.contract.numberOfLegalPositions()
      <= SymboleoContract.minimumNumberOfLegalPositions()) {
      return wasSet;
    }

    const existingContract = this.contract;
    this.contract = aContract;
    if (existingContract != null && !existingContract.equals(aContract)) {
      const didRemove = existingContract.removeLegalPosition(this);
      if (!didRemove) {
        this.contract = existingContract;
        return wasSet;
      }
    }
    this.contract.addLegalPosition(this);
    wasSet = true;
    return wasSet;
  }

  setDebtor(aDebtor) {
    let wasSet = false;
    if (aDebtor == null) {
      return wasSet;
    }

    const existingDebtor = this.debtor;
    this.debtor = aDebtor;
    if (existingDebtor != null && !existingDebtor.equals(aDebtor)) {
      existingDebtor.removeDebt(this);
    }
    this.debtor.addDebt(this);
    wasSet = true;
    return wasSet;
  }

  setCreditor(aCreditor) {
    let wasSet = false;
    if (aCreditor == null) {
      return wasSet;
    }

    const existingCreditor = this.creditor;
    this.creditor = aCreditor;
    if (existingCreditor != null && !existingCreditor.equals(aCreditor)) {
      existingCreditor.removeCredit(this);
    }
    this.creditor.addCredit(this);
    wasSet = true;
    return wasSet;
  }

  setAsset(aAsset) {
    let wasSet = false;
    const existingAsset = this.asset;
    this.asset = aAsset;
    if (existingAsset != null && !existingAsset.equals(aAsset)) {
      existingAsset.removeLegalPosition(this);
    }
    if (aAsset != null) {
      aAsset.addLegalPosition(this);
    }
    wasSet = true;
    return wasSet;
  }

  setAntecedent(aAntecedent) {
    let wasSet = false;
    if (aAntecedent == null) {
      return wasSet;
    }

    const existingAntecedent = this.antecedent;
    this.antecedent = aAntecedent;
    if (existingAntecedent != null && !existingAntecedent.equals(aAntecedent)) {
      existingAntecedent.removeAntecedentOf(this);
    }
    this.antecedent.addAntecedentOf(this);
    wasSet = true;
    return wasSet;
  }

  setConsequent(aConsequent) {
    let wasSet = false;
    if (aConsequent == null) {
      return wasSet;
    }

    const existingConsequent = this.consequent;
    this.consequent = aConsequent;
    if (existingConsequent != null && !existingConsequent.equals(aConsequent)) {
      existingConsequent.removeConsequentOf(this);
    }
    this.consequent.addConsequentOf(this);
    wasSet = true;
    return wasSet;
  }

  setTrigger(aNewTrigger) {
    let wasSet = false;
    this.trigger = aNewTrigger;
    wasSet = true;
    return wasSet;
  }

  delete() {
    for (const aPerformer of this.performer) {
      aPerformer.removePerformerOf(this);
    }
    this.performer = [];
    for (const aLiable of this.liable) {
      aLiable.removeLiableOf(this);
    }
    this.liable = [];
    for (const aRightHolder of this.rightHolder) {
      aRightHolder.removeRightHolderOf(this);
    }
    this.rightHolder = [];

    const placeholderContract = this.contract;
    this.contract = null;
    if (placeholderContract != null) {
      placeholderContract.removeLegalPosition(this);
    }
    const placeholderDebtor = this.debtor;
    this.debtor = null;
    if (placeholderDebtor != null) {
      placeholderDebtor.removeDebt(this);
    }
    const placeholderCreditor = this.creditor;
    this.creditor = null;
    if (placeholderCreditor != null) {
      placeholderCreditor.removeCredit(this);
    }
    if (this.asset != null) {
      const placeholderAsset = this.asset;
      this.asset = null;
      placeholderAsset.removeLegalPosition(this);
    }
  }

  equals(obj) {
    return obj.name != null
      && obj instanceof LegalPosition && obj.name === this.name;
  }
}

module.exports.LegalPosition = LegalPosition;
