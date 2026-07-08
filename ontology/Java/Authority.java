/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.37.0.8639.dcaf9c798 modeling language!*/



/**
 * The party (e.g. a certificate authority) that vouches for credentials.
 */
// line 261 "model.ump"
// line 379 "model.ump"
public class Authority
{

  //------------------------
  // MEMBER VARIABLES
  //------------------------

  //Authority Attributes
  private String name;

  //Authority Associations
  private Credential issuedBy;

  //------------------------
  // CONSTRUCTOR
  //------------------------

  public Authority(String aName)
  {
    name = aName;
  }

  //------------------------
  // INTERFACE
  //------------------------

  public boolean setName(String aName)
  {
    boolean wasSet = false;
    name = aName;
    wasSet = true;
    return wasSet;
  }

  public String getName()
  {
    return name;
  }
  /* Code from template association_GetOne */
  public Credential getIssuedBy()
  {
    return issuedBy;
  }

  public boolean hasIssuedBy()
  {
    boolean has = issuedBy != null;
    return has;
  }
  /* Code from template association_SetOptionalOneToMany */
  public boolean setIssuedBy(Credential aIssuedBy)
  {
    boolean wasSet = false;
    Credential existingIssuedBy = issuedBy;
    issuedBy = aIssuedBy;
    if (existingIssuedBy != null && !existingIssuedBy.equals(aIssuedBy))
    {
      existingIssuedBy.removeIssuer(this);
    }
    if (aIssuedBy != null)
    {
      aIssuedBy.addIssuer(this);
    }
    wasSet = true;
    return wasSet;
  }

  public void delete()
  {
    if (issuedBy != null)
    {
      Credential placeholderIssuedBy = issuedBy;
      this.issuedBy = null;
      placeholderIssuedBy.removeIssuer(this);
    }
  }


  public String toString()
  {
    return super.toString() + "["+
            "name" + ":" + getName()+ "]" + System.getProperties().getProperty("line.separator") +
            "  " + "issuedBy = "+(getIssuedBy()!=null?Integer.toHexString(System.identityHashCode(getIssuedBy())):"null");
  }
}