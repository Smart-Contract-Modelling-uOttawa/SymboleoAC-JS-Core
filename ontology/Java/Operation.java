/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.37.0.8639.dcaf9c798 modeling language!*/


import java.util.*;

/**
 * For Access Control
 */
// line 203 "model.ump"
// line 344 "model.ump"
public class Operation extends Resource
{

  //------------------------
  // MEMBER VARIABLES
  //------------------------

  //Operation Attributes
  private Condition preCondition;
  private Condition postCondition;

  //Operation Associations
  private List<Role> performer;
  private List<Attribute> inputAttributes;
  private List<Attribute> outputAttributes;

  //------------------------
  // CONSTRUCTOR
  //------------------------

  public Operation(Condition aPreCondition, Condition aPostCondition, Role... allControllers)
  {
    super(allControllers);
    preCondition = aPreCondition;
    postCondition = aPostCondition;
    performer = new ArrayList<Role>();
    inputAttributes = new ArrayList<Attribute>();
    outputAttributes = new ArrayList<Attribute>();
  }

  //------------------------
  // INTERFACE
  //------------------------

  public boolean setPreCondition(Condition aPreCondition)
  {
    boolean wasSet = false;
    preCondition = aPreCondition;
    wasSet = true;
    return wasSet;
  }

  public boolean setPostCondition(Condition aPostCondition)
  {
    boolean wasSet = false;
    postCondition = aPostCondition;
    wasSet = true;
    return wasSet;
  }

  public Condition getPreCondition()
  {
    return preCondition;
  }

  public Condition getPostCondition()
  {
    return postCondition;
  }
  /* Code from template association_GetMany */
  public Role getPerformer(int index)
  {
    Role aPerformer = performer.get(index);
    return aPerformer;
  }

  public List<Role> getPerformer()
  {
    List<Role> newPerformer = Collections.unmodifiableList(performer);
    return newPerformer;
  }

  public int numberOfPerformer()
  {
    int number = performer.size();
    return number;
  }

  public boolean hasPerformer()
  {
    boolean has = performer.size() > 0;
    return has;
  }

  public int indexOfPerformer(Role aPerformer)
  {
    int index = performer.indexOf(aPerformer);
    return index;
  }
  /* Code from template association_GetMany */
  public Attribute getInputAttribute(int index)
  {
    Attribute aInputAttribute = inputAttributes.get(index);
    return aInputAttribute;
  }

  public List<Attribute> getInputAttributes()
  {
    List<Attribute> newInputAttributes = Collections.unmodifiableList(inputAttributes);
    return newInputAttributes;
  }

  public int numberOfInputAttributes()
  {
    int number = inputAttributes.size();
    return number;
  }

  public boolean hasInputAttributes()
  {
    boolean has = inputAttributes.size() > 0;
    return has;
  }

  public int indexOfInputAttribute(Attribute aInputAttribute)
  {
    int index = inputAttributes.indexOf(aInputAttribute);
    return index;
  }
  /* Code from template association_GetMany */
  public Attribute getOutputAttribute(int index)
  {
    Attribute aOutputAttribute = outputAttributes.get(index);
    return aOutputAttribute;
  }

  public List<Attribute> getOutputAttributes()
  {
    List<Attribute> newOutputAttributes = Collections.unmodifiableList(outputAttributes);
    return newOutputAttributes;
  }

  public int numberOfOutputAttributes()
  {
    int number = outputAttributes.size();
    return number;
  }

  public boolean hasOutputAttributes()
  {
    boolean has = outputAttributes.size() > 0;
    return has;
  }

  public int indexOfOutputAttribute(Attribute aOutputAttribute)
  {
    int index = outputAttributes.indexOf(aOutputAttribute);
    return index;
  }
  /* Code from template association_MinimumNumberOfMethod */
  public static int minimumNumberOfPerformer()
  {
    return 0;
  }
  /* Code from template association_AddManyToManyMethod */
  public boolean addPerformer(Role aPerformer)
  {
    boolean wasAdded = false;
    if (performer.contains(aPerformer)) { return false; }
    performer.add(aPerformer);
    if (aPerformer.indexOfPerformedOperation(this) != -1)
    {
      wasAdded = true;
    }
    else
    {
      wasAdded = aPerformer.addPerformedOperation(this);
      if (!wasAdded)
      {
        performer.remove(aPerformer);
      }
    }
    return wasAdded;
  }
  /* Code from template association_RemoveMany */
  public boolean removePerformer(Role aPerformer)
  {
    boolean wasRemoved = false;
    if (!performer.contains(aPerformer))
    {
      return wasRemoved;
    }

    int oldIndex = performer.indexOf(aPerformer);
    performer.remove(oldIndex);
    if (aPerformer.indexOfPerformedOperation(this) == -1)
    {
      wasRemoved = true;
    }
    else
    {
      wasRemoved = aPerformer.removePerformedOperation(this);
      if (!wasRemoved)
      {
        performer.add(oldIndex,aPerformer);
      }
    }
    return wasRemoved;
  }
  /* Code from template association_AddIndexControlFunctions */
  public boolean addPerformerAt(Role aPerformer, int index)
  {  
    boolean wasAdded = false;
    if(addPerformer(aPerformer))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfPerformer()) { index = numberOfPerformer() - 1; }
      performer.remove(aPerformer);
      performer.add(index, aPerformer);
      wasAdded = true;
    }
    return wasAdded;
  }

  public boolean addOrMovePerformerAt(Role aPerformer, int index)
  {
    boolean wasAdded = false;
    if(performer.contains(aPerformer))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfPerformer()) { index = numberOfPerformer() - 1; }
      performer.remove(aPerformer);
      performer.add(index, aPerformer);
      wasAdded = true;
    } 
    else 
    {
      wasAdded = addPerformerAt(aPerformer, index);
    }
    return wasAdded;
  }
  /* Code from template association_IsNumberOfValidMethod */
  public boolean isNumberOfInputAttributesValid()
  {
    boolean isValid = numberOfInputAttributes() >= minimumNumberOfInputAttributes();
    return isValid;
  }
  /* Code from template association_MinimumNumberOfMethod */
  public static int minimumNumberOfInputAttributes()
  {
    return 1;
  }
  /* Code from template association_AddManyToManyMethod */
  public boolean addInputAttribute(Attribute aInputAttribute)
  {
    boolean wasAdded = false;
    if (inputAttributes.contains(aInputAttribute)) { return false; }
    inputAttributes.add(aInputAttribute);
    if (aInputAttribute.indexOfConsumerOperation(this) != -1)
    {
      wasAdded = true;
    }
    else
    {
      wasAdded = aInputAttribute.addConsumerOperation(this);
      if (!wasAdded)
      {
        inputAttributes.remove(aInputAttribute);
      }
    }
    return wasAdded;
  }
  /* Code from template association_AddMStarToMany */
  public boolean removeInputAttribute(Attribute aInputAttribute)
  {
    boolean wasRemoved = false;
    if (!inputAttributes.contains(aInputAttribute))
    {
      return wasRemoved;
    }

    if (numberOfInputAttributes() <= minimumNumberOfInputAttributes())
    {
      return wasRemoved;
    }

    int oldIndex = inputAttributes.indexOf(aInputAttribute);
    inputAttributes.remove(oldIndex);
    if (aInputAttribute.indexOfConsumerOperation(this) == -1)
    {
      wasRemoved = true;
    }
    else
    {
      wasRemoved = aInputAttribute.removeConsumerOperation(this);
      if (!wasRemoved)
      {
        inputAttributes.add(oldIndex,aInputAttribute);
      }
    }
    return wasRemoved;
  }
  /* Code from template association_SetMStarToMany */
  public boolean setInputAttributes(Attribute... newInputAttributes)
  {
    boolean wasSet = false;
    ArrayList<Attribute> verifiedInputAttributes = new ArrayList<Attribute>();
    for (Attribute aInputAttribute : newInputAttributes)
    {
      if (verifiedInputAttributes.contains(aInputAttribute))
      {
        continue;
      }
      verifiedInputAttributes.add(aInputAttribute);
    }

    if (verifiedInputAttributes.size() != newInputAttributes.length || verifiedInputAttributes.size() < minimumNumberOfInputAttributes())
    {
      return wasSet;
    }

    ArrayList<Attribute> oldInputAttributes = new ArrayList<Attribute>(inputAttributes);
    inputAttributes.clear();
    for (Attribute aNewInputAttribute : verifiedInputAttributes)
    {
      inputAttributes.add(aNewInputAttribute);
      if (oldInputAttributes.contains(aNewInputAttribute))
      {
        oldInputAttributes.remove(aNewInputAttribute);
      }
      else
      {
        aNewInputAttribute.addConsumerOperation(this);
      }
    }

    for (Attribute anOldInputAttribute : oldInputAttributes)
    {
      anOldInputAttribute.removeConsumerOperation(this);
    }
    wasSet = true;
    return wasSet;
  }
  /* Code from template association_AddIndexControlFunctions */
  public boolean addInputAttributeAt(Attribute aInputAttribute, int index)
  {  
    boolean wasAdded = false;
    if(addInputAttribute(aInputAttribute))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfInputAttributes()) { index = numberOfInputAttributes() - 1; }
      inputAttributes.remove(aInputAttribute);
      inputAttributes.add(index, aInputAttribute);
      wasAdded = true;
    }
    return wasAdded;
  }

  public boolean addOrMoveInputAttributeAt(Attribute aInputAttribute, int index)
  {
    boolean wasAdded = false;
    if(inputAttributes.contains(aInputAttribute))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfInputAttributes()) { index = numberOfInputAttributes() - 1; }
      inputAttributes.remove(aInputAttribute);
      inputAttributes.add(index, aInputAttribute);
      wasAdded = true;
    } 
    else 
    {
      wasAdded = addInputAttributeAt(aInputAttribute, index);
    }
    return wasAdded;
  }
  /* Code from template association_MinimumNumberOfMethod */
  public static int minimumNumberOfOutputAttributes()
  {
    return 0;
  }
  /* Code from template association_AddManyToOne */
  public Attribute addOutputAttribute(LegalSituation aLegalSituationA, Role... allControllers)
  {
    return new Attribute(this, aLegalSituationA, allControllers);
  }

  public boolean addOutputAttribute(Attribute aOutputAttribute)
  {
    boolean wasAdded = false;
    if (outputAttributes.contains(aOutputAttribute)) { return false; }
    Operation existingProducerOperation = aOutputAttribute.getProducerOperation();
    boolean isNewProducerOperation = existingProducerOperation != null && !this.equals(existingProducerOperation);
    if (isNewProducerOperation)
    {
      aOutputAttribute.setProducerOperation(this);
    }
    else
    {
      outputAttributes.add(aOutputAttribute);
    }
    wasAdded = true;
    return wasAdded;
  }

  public boolean removeOutputAttribute(Attribute aOutputAttribute)
  {
    boolean wasRemoved = false;
    //Unable to remove aOutputAttribute, as it must always have a producerOperation
    if (!this.equals(aOutputAttribute.getProducerOperation()))
    {
      outputAttributes.remove(aOutputAttribute);
      wasRemoved = true;
    }
    return wasRemoved;
  }
  /* Code from template association_AddIndexControlFunctions */
  public boolean addOutputAttributeAt(Attribute aOutputAttribute, int index)
  {  
    boolean wasAdded = false;
    if(addOutputAttribute(aOutputAttribute))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfOutputAttributes()) { index = numberOfOutputAttributes() - 1; }
      outputAttributes.remove(aOutputAttribute);
      outputAttributes.add(index, aOutputAttribute);
      wasAdded = true;
    }
    return wasAdded;
  }

  public boolean addOrMoveOutputAttributeAt(Attribute aOutputAttribute, int index)
  {
    boolean wasAdded = false;
    if(outputAttributes.contains(aOutputAttribute))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfOutputAttributes()) { index = numberOfOutputAttributes() - 1; }
      outputAttributes.remove(aOutputAttribute);
      outputAttributes.add(index, aOutputAttribute);
      wasAdded = true;
    } 
    else 
    {
      wasAdded = addOutputAttributeAt(aOutputAttribute, index);
    }
    return wasAdded;
  }

  public void delete()
  {
    ArrayList<Role> copyOfPerformer = new ArrayList<Role>(performer);
    performer.clear();
    for(Role aPerformer : copyOfPerformer)
    {
      aPerformer.removePerformedOperation(this);
    }
    ArrayList<Attribute> copyOfInputAttributes = new ArrayList<Attribute>(inputAttributes);
    inputAttributes.clear();
    for(Attribute aInputAttribute : copyOfInputAttributes)
    {
      if (aInputAttribute.numberOfConsumerOperations() <= Attribute.minimumNumberOfConsumerOperations())
      {
        aInputAttribute.delete();
      }
      else
      {
        aInputAttribute.removeConsumerOperation(this);
      }
    }
    for(int i=outputAttributes.size(); i > 0; i--)
    {
      Attribute aOutputAttribute = outputAttributes.get(i - 1);
      aOutputAttribute.delete();
    }
    super.delete();
  }


  public String toString()
  {
    return super.toString() + "["+ "]" + System.getProperties().getProperty("line.separator") +
            "  " + "preCondition" + "=" + (getPreCondition() != null ? !getPreCondition().equals(this)  ? getPreCondition().toString().replaceAll("  ","    ") : "this" : "null") + System.getProperties().getProperty("line.separator") +
            "  " + "postCondition" + "=" + (getPostCondition() != null ? !getPostCondition().equals(this)  ? getPostCondition().toString().replaceAll("  ","    ") : "this" : "null");
  }
}