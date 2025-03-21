//const { SymboleoContract } = require('./SymboleoContract.js');
//const { Role } = require('./Role.js');

    /*
 for (let i = 0; i < allController.length; i++) {
      ////////console.log('<-- Submit Result**********: ' + allController[i]);	
    }
    allController.forEach(function(obj) {
      ////////console.log("To print controller inside class resource********", obj);
    });*/

class Resource{
  constructor(allController) {
    //this.authentication = aAuthentication;
    this._type = 'Resource'
    this._controller = [];
    
    ////////console.log("allController in resource for obligation--------------------------");
    ////////console.log(allController);
    // to check if controller is null or not
    //if(typeof allController === 'object') 
    //if(typeof allController === 'undefined' || allController === null || allController.length <= 0){  
      //|| allController === null || allController.length <= 0){ //typeof allController === 'object' || //|| allController === null || allController.length <= 0
    
      // first if check if the controller is single object{}
    if(typeof allController === 'object' && !Array.isArray(allController)){
      if(allController === null)
      return
      if(typeof allController === 'undefined')
      return
      let didAddController = this.addController(allController)
    }else{//this if check if the controller is a list of objects 
      if (typeof allController === 'undefined' || allController === null || allController.length <= 0 || typeof allController[0] === 'undefined') { //|| !Array.isArray(allController)
        ////////console.log("return without adding in resource-------------------------------------");
        return;
      }
      let didAddController = this.setController(allController);
    }//else

   
    
    //////////console.log("To print controller inside class resource" + allController);
    //if (!didAddController) {
        //throw new Error("Unable to create Resource, must have at least 1 Controller.");
    //}
}

// INTERFACE

setAuthentication(aAuthentication) {
  let wasSet = false;
  this.authentication = aAuthentication;
  wasSet = true;
  return wasSet;
}

getAuthentication() {
  return this.authentication;
}

// Code from template association_GetMany

getController(index) {
  let aController = this._controller[index];
  return aController;
}

getController() {
  let newController = Object.freeze(this._controller);
  return newController;
}

//AC
//Utlity function 
findController(aController){
  let isController = false
  ////////console.log("I am inside findController")
  //this._controller.find(obj => obj === aController)
  //////console.log("I am in findController")
  //////console.log(aController)
  if(typeof aController !== 'undefined'){
    isController = this._controller.some(obj => obj._name === aController._name && obj._type === aController._type)

  }
  //this._controller.forEach(obj => {if(obj === aController){
    ////////console.log("I am inside if in findController")
    //isController = true;
    //return isController
  //}  ////////console.log("obj")
   ////////console.log(obj)
//})
  return  isController  
}

numberOfController() {
  let number = this._controller.length;
  return number;
}

hasController() {
  let has = this._controller.length > 0;
  return has;
}

indexOfController(aController) {
  let index = this._controller.indexOf(aController);
  return index;
}

/* Code from template association_MinimumNumberOfMethod */
// deleted static from here
minimumNumberOfController() {
  return 1;
}

//AC
/* Code from template association_AddUnidirectionalMStar */
addController(aController) {
  let wasAdded = false;
  if (!this.findController(aController) && !(typeof aController === 'undefined') 
  && !(aController === null)) {
  this._controller.push(aController);
  wasAdded = true;
  }
  return wasAdded; 
}


//AC
//Utlity
removeController(aController) {
  let wasRemoved = false;
  if (!this.findController(aController)) { return wasRemoved; }
  if (this.numberOfController() <= this.minimumNumberOfController()) { return wasRemoved; }
  let index = this._controller.indexOf(aController);
  this._controller.splice(index, 1);
  wasRemoved = true;
  return wasRemoved;
}

/* Code from template association_SetUnidirectionalMStar */
// setController method
setController(newController) {
  ////////console.log('inside the function in setContoller');
  let wasSet = false;
  //let verifiedController = [];
  /*
  for (let aController of newController) {
    ////////console.log('inside for');
      if (verifiedController.includes(aController)) {
          continue;
      }
      verifiedController.push(aController);
  }*/
  for (let aController of newController) {
    if (!this.findController(aController) && !(typeof aController === 'undefined') && !(aController === null)) {
      this._controller.push(aController);
      //this.Controller = [verifiedController];
      wasSet = true;
      }
  }
      

  //if (this.Controller.length < this.minimumNumberOfController()) {
      //return wasSet;
 // }

  //this.Controller = [verifiedController];
  //wasSet = true;
  return wasSet;
}

/* Code from template association_AddIndexControlFunctions */
// addControllerAt method
addControllerAt(aController, index) {
  let wasAdded = false;
  if (this.addController(aController)) {
      if (index < 0) { index = 0; }
      if (index > this.numberOfController()) { index = this.numberOfController(); }
      this._controller.splice(index, 0, aController);
      wasAdded = true;
  }
  return wasAdded;
}

// addOrMoveControllerAt method
addOrMoveControllerAt(aController, index) {
  let wasAdded = false;
  if (this.findController(aController)) {
      if (index < 0) { index = 0; }
      if (index > this.numberOfController()) { index = this.numberOfController(); }
      this._controller.splice(this._controller.indexOf(aController), 1);
      this._controller.splice(index, 0, aController);
      wasAdded = true;
  } else {
      wasAdded = this.addControllerAt(aController, index);
  }
  return wasAdded;
}

// delete method
delete() {
  this._controller = [];
}

// toString method
toString() {
  return super.toString() + "[" +
      "authentication" + ":" + this.getAuthentication() + "]";
}


  /*
  //here I added name for method equls to work, maybe I need to chnage it to id
    constructor(name, aController){
      ////////console.log("I am inside  resources-------------- controller"+aController);
      ////////console.log("I am inside  resources-------------- name"+name);
      this.name = name
      this.controller = [];
      //this.controller.push(aController); // --> //this is making error TypeError: Cannot read property 'equals' of undefined
      //this._rule = null;
    }

   getController(index) {
      return this.controller[index];
   }

   getController() {
    return this.controller;
  }

  numberOfController() {
    return this.controller.length;
  }

  hasController() {
    return this.controller.length > 0;
  }

  indexOfController(aController) {
    const index = this.controller.findIndex((o) => o.equals(aController));
    return index;
  }

  isNumberOfControllerValid() {
    const isValid = numberOfController() >= minimumNumberOfController();
    return isValid;
  }

  minimumNumberOfController() {
    return 1;
  }

  addController(aController) {
    ////////console.log("I am inside addController in Resource classssssssssssssssssssssssssssss")
    let wasAdded = false;
    if (this.controller.some((o) => o.equals(aController))) {
      return false;
    }
    this.controller.push(aController);
    if (aController.indexOfResource(this) !== -1) {
      wasAdded = true;
    } else {
      wasAdded = aController.addResource(this);
      if (!wasAdded) {
       const index = this.controller.findIndex((o) => o.equals(aController));
       this.controller.splice(index, 1);
      }
    }
    return wasAdded;
}

removeController(aController) {
  let wasRemoved = false;

  if (!this.controller.some((o) => o.equals(aController))) {
    return wasRemoved;
  }

  const oldIndex = this.controller.findIndex((o) => o.equals(aController));
  this.controller.splice(oldIndex, 1);
  if (aController.indexOfResource(this) === -1) {
    wasRemoved = true;
  } else {
    wasRemoved = aController.removeResource(this);
    if (!wasRemoved) {
      this.controller.splice(oldIndex, 0, aController);
    }
  }

  return wasRemoved;
}

  equals(obj) {
    return obj.name != null
      && obj instanceof LegalPosition && obj.name === this.name;
  }
    */
    
}

module.exports.Resource = Resource;
