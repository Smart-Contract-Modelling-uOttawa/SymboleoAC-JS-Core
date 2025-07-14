const { AbstractEvent } = require('./AbstractEvent.js');

//special case for Data that performer is not the controller
class Data extends AbstractEvent {
  constructor(allController) {//add perfomer later as API performer
    super(allController);
    this._triggered = false;
    this._timestamp = null;
  }


  //Sofana-AC
  // INTERFACE

// association_GetMany
// getPerformer method
getPerformer(index) {
  let aPerformer = this._performer[index];
  return aPerformer;
}

// getPerformer method
getPerformer() {
  let newPerformer = Object.freeze(this._performer);
  return newPerformer;
}

// numberOfPerformer method
numberOfPerformer() {
  let number = this._performer.length;
  return number;
}

// hasPerformer method
hasPerformer() {
  let has = this._performer.length > 0;
  return has;
}

// indexOfPerformer method
indexOfPerformer(aPerformer) {
  let index = this._performer.indexOf(aPerformer);
  return index;
}

// association_MinimumNumberOfMethod
static minimumNumberOfPerformer() {
  return 0;
}

// association_AddUnidirectionalMany
// addPerformer method
addPerformer(aPerformer) {
  let wasAdded = false;
  if (!this._performer.includes(aPerformer) && aPerformer !== null) {
    console.log("aPerformer-------------------------")
     console.log(aPerformer)
      this._performer.push(aPerformer);
      wasAdded = true;
  }
  return wasAdded;
}

// removePerformer method
removePerformer(aPerformer) {
  let wasRemoved = false;
  if (this._performer.includes(aPerformer)) {
      let index = this._performer.indexOf(aPerformer);
      this._performer.splice(index, 1);
      wasRemoved = true;
  }
  return wasRemoved;
}

// association_AddIndexControlFunctions
// addPerformerAt method
addPerformerAt(aPerformer, index) {
  let wasAdded = false;
  if (this.addPerformer(aPerformer)) {
      if (index < 0) { index = 0; }
      if (index > this.numberOfPerformer()) { index = this.numberOfPerformer(); }
      this._performer.splice(index, 0, aPerformer);
      wasAdded = true;
  }
  return wasAdded;
}

// addOrMovePerformerAt method
addOrMovePerformerAt(aPerformer, index) {
  let wasAdded = false;
  if (this._performer.includes(aPerformer)) {
      if (index < 0) { index = 0; }
      if (index > this.numberOfPerformer()) { index = this.numberOfPerformer(); }
      let currentIndex = this._performer.indexOf(aPerformer);
      this._performer.splice(currentIndex, 1);
      this._performer.splice(index, 0, aPerformer);
      wasAdded = true;
  } else {
      wasAdded = this.addPerformerAt(aPerformer, index);
  }
  return wasAdded;
}

// delete method
delete() {
  this._performer = [];
  super.delete();
}
//Sofana-AC

  happen(event) {
    this._triggered = true;
    const d = new Date();
    d.setSeconds(0);
    d.setMilliseconds(0);
    this._timestamp = d.toISOString();
    if (event != null) {
      for (const key of Object.keys(event)) {
        this[key] = event[key];
      }
    }
  }

  hasHappened() {
    return this._triggered;
  }
}

module.exports.Data = Data;
