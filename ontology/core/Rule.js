const { ACPolicy } = require('./ACPolicy.js');

// ENUMERATIONS
const permission = {
    read: 'read',
    write: 'write',
    all: 'all',
    transfer: 'transfer'
};

const decision = {
    grant: 'grant',
    revoke: 'revoke'
};

//add antoher cnonsturter for Rule that includes attribute  
//add another cnonsturter for rule that includes operation 

class Rule{
    // CONSTRUCTOR
    constructor(aDecision, aPermission, aAccessedResource, aAccessedRole, aByRole, aACPolicy) {
        //this.ruleId = aRuleId;
        this.permission = aPermission
        this.decision = aDecision
        this._type = "Rule"
        if (!this.setAccessedResource(aAccessedResource)) {
            throw new Error("Unable to create Rule due to aAccessedResource.");
        }
        if (!this.setAccessedRole(aAccessedRole)) {
            throw new Error("Unable to create Rule due to aAccessedRole.");
        }
        if (!this.setByRole(aByRole)) {
            throw new Error("Unable to create Rule due to aByRole.");
        }
        //console.log("--------------------")
        //console.log(aACPolicy)
        //const didAddACPolicy = this.setACPolicy(aACPolicy);

        //return true


        //if (!didAddACPolicy) {
           // throw new Error("Unable to create Rule due to aACPolicy.");
       // }
    }

    // Constructor for adding permesstion on attribute of specifc resource
    static withAttribute(aPermission, attribute, aAccessedRole, aACPolicy) {
        return new Rule(aPermission, attribute, aAccessedRole, aACPolicy);
    }

    // Constructor for adding permesstion on operation for specifc resource
    static withOperation(aPermission, operation, aAccessedRole, aACPolicy) {
        return new Rule(aPermission, operation, aAccessedRole, aACPolicy);
    }


// INTERFACE
/* not by the generator
setRuleId(aRuleId) {
    let wasSet = false;
    this.ruleId = aRuleId;
    wasSet = true;
    return wasSet;
}*/

setPermission(aPermission) {
    let wasSet = false;
    this.permission = aPermission;
    wasSet = true;
    return wasSet;
}
/*not by the generator
getRuleId() {
    return this.ruleId;
}*/

getPermission() {
    return this.permission;
}

setDecision(aDecision) {
    let wasSet = false;
    this.decision = aDecision;
    wasSet = true;
    return wasSet;
}

getDecision(){
    return this.decision;
}

// Code from template association_GetOne
// getAccessedResource method
getAccessedResource() {
    return this.accessedResource;
}

// Code from template association_GetOne
// getAccessedRole method
getAccessedRole() {
    return this.accessedRole;
}

getByRole() {
    return this.byRole;
}

// Code from template association_GetOne
// getACPolicy method
getACPolicy() {
    return this.aCPolicy;
}

// Code from template association_SetUnidirectionalOne
// setAccessedResource method
setAccessedResource(aNewAccessedResource) {
    let wasSet = false;
    if (aNewAccessedResource !== null) {
        this.accessedResource = aNewAccessedResource;
        wasSet = true;
    }
    return wasSet;
}

// Code from template association_SetUnidirectionalOne
// setAccessedRole method
setAccessedRole(aNewAccessedRole) {
    let wasSet = false;
    if (aNewAccessedRole !== null) {
        this.accessedRole = aNewAccessedRole;
        wasSet = true;
    }
    return wasSet;
}

setByRole(aNewByRole) {
    let wasSet = false;
    if (aNewByRole !== null) {
        this.byRole = aNewByRole;
        wasSet = true;
    }
    return wasSet;
}

// Code from template association_SetOneToMany
// setACPolicy method
setACPolicy(aACPolicy) {
    let wasSet = false;
    if (aACPolicy !== null && !(typeof aACPolicy === 'undefined')) {
        aACPolicy.addRule(this);
        wasSet = true;
        //let existingACPolicy = this.aCPolicy;
        //this.aCPolicy = aACPolicy;
        ////console.log("existingACPolicy")
        ////console.log(existingACPolicy)
        //if (existingACPolicy !== null && !(typeof existingACPolicy === 'undefined'))
          //  if(!(existingACPolicy === aACPolicy)) {//!existingACPolicy.equals(aACPolicy)
           // existingACPolicy.removeRule(this);
        //
    }else{
        aACPolicy.removeRule(this);
    }
       // aACPolicy.addRule(this);  
    return wasSet;
}

// delete method
delete() {
    this.accessedResource = null;
    this.accessedRole = null;
    let placeholderACPolicy = this.aCPolicy;
    this.aCPolicy = null;
    if (placeholderACPolicy !== null) {
        placeholderACPolicy.removeRule(this);
    }
}

// toString method
toString() {
    return (
        super.toString() + "[" + "]" + System.getProperties().getProperty("line.separator") +
        "  " + "permission" + "=" + (this.getPermission() !== null ? !this.getPermission().equals(this) ? this.getPermission().toString().replaceAll("  ", "    ") : "this" : "null") + System.getProperties().getProperty("line.separator") +
        "  " + "decision" + "=" + (this.getDecision() !== null ? !this.getDecision().equals(this) ? this.getDecision().toString().replaceAll("  ", "    ") : "this" : "null") + System.getProperties().getProperty("line.separator") +
        "  " + "accessedResource = " + (this.getAccessedResource() !== null ? Integer.toHexString(System.identityHashCode(this.getAccessedResource())) : "null") + System.getProperties().getProperty("line.separator") +
        "  " + "accessedRole = " + (this.getAccessedRole() !== null ? Integer.toHexString(System.identityHashCode(this.getAccessedRole())) : "null") + System.getProperties().getProperty("line.separator") +
        "  " + "aCPolicy = " + (this.getACPolicy() !== null ? Integer.toHexString(System.identityHashCode(this.getACPolicy())) : "null")
    ); //"  " + "ruleId" + "=" + (this.getRuleId() !== null ? !this.getRuleId().equals(this) ? this.getRuleId().toString().replaceAll("  ", "    ") : "this" : "null") + System.getProperties().getProperty("line.separator") +
}

}//end of class 

module.exports.Rule = Rule;
module.exports.Permission
module.exports.Decision






    





