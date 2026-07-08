/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.37.0.8639.dcaf9c798 modeling language!*/


import java.util.*;

/**
 * Phase 3 (O4a): a Role plays a role IN a contract; a Credential is what
 * LETS a caller play that role at runtime. The generated authenticate()
 * binds a caller's X.509 attributes (name, org, dept) to a Role instance;
 * making the binding first-class in the ontology stops the "dept
 * requirement" being folklore -- it becomes the Credential's declared
 * attributes. A Role may be playable via zero or more credentials (paper
 * contracts, off-chain identity), and a credential is issued by an
 * Authority (typically the deploying organization's CA).
 */
// line 252 "model.ump"
// line 374 "model.ump"
public class Credential
{

  //------------------------
  // MEMBER VARIABLES
  //------------------------

  //Credential Attributes
  private String subjectName;
  private String subjectOrg;
  private String subjectDept;

  //Credential Associations
  private Role role;
  private List<Authority> issuer;

  //------------------------
  // CONSTRUCTOR
  //------------------------

  public Credential(String aSubjectName, String aSubjectOrg, String aSubjectDept, Role aRole)
  {
    subjectName = aSubjectName;
    subjectOrg = aSubjectOrg;
    subjectDept = aSubjectDept;
    if (aRole == null || aRole.getCredentialFor() != null)
    {
      throw new RuntimeException("Unable to create Credential due to aRole. See https://manual.umple.org?RE002ViolationofAssociationMultiplicity.html");
    }
    role = aRole;
    issuer = new ArrayList<Authority>();
  }

  public Credential(String aSubjectName, String aSubjectOrg, String aSubjectDept, Contract aContractForRole, Role... allControllersForRole)
  {
    subjectName = aSubjectName;
    subjectOrg = aSubjectOrg;
    subjectDept = aSubjectDept;
    role = new Role(aContractForRole, this, allControllersForRole);
    issuer = new ArrayList<Authority>();
  }

  //------------------------
  // INTERFACE
  //------------------------

  public boolean setSubjectName(String aSubjectName)
  {
    boolean wasSet = false;
    subjectName = aSubjectName;
    wasSet = true;
    return wasSet;
  }

  public boolean setSubjectOrg(String aSubjectOrg)
  {
    boolean wasSet = false;
    subjectOrg = aSubjectOrg;
    wasSet = true;
    return wasSet;
  }

  public boolean setSubjectDept(String aSubjectDept)
  {
    boolean wasSet = false;
    subjectDept = aSubjectDept;
    wasSet = true;
    return wasSet;
  }

  public String getSubjectName()
  {
    return subjectName;
  }

  public String getSubjectOrg()
  {
    return subjectOrg;
  }

  public String getSubjectDept()
  {
    return subjectDept;
  }
  /* Code from template association_GetOne */
  public Role getRole()
  {
    return role;
  }
  /* Code from template association_GetMany */
  public Authority getIssuer(int index)
  {
    Authority aIssuer = issuer.get(index);
    return aIssuer;
  }

  public List<Authority> getIssuer()
  {
    List<Authority> newIssuer = Collections.unmodifiableList(issuer);
    return newIssuer;
  }

  public int numberOfIssuer()
  {
    int number = issuer.size();
    return number;
  }

  public boolean hasIssuer()
  {
    boolean has = issuer.size() > 0;
    return has;
  }

  public int indexOfIssuer(Authority aIssuer)
  {
    int index = issuer.indexOf(aIssuer);
    return index;
  }
  /* Code from template association_MinimumNumberOfMethod */
  public static int minimumNumberOfIssuer()
  {
    return 0;
  }
  /* Code from template association_AddManyToOptionalOne */
  public boolean addIssuer(Authority aIssuer)
  {
    boolean wasAdded = false;
    if (issuer.contains(aIssuer)) { return false; }
    Credential existingIssuedBy = aIssuer.getIssuedBy();
    if (existingIssuedBy == null)
    {
      aIssuer.setIssuedBy(this);
    }
    else if (!this.equals(existingIssuedBy))
    {
      existingIssuedBy.removeIssuer(aIssuer);
      addIssuer(aIssuer);
    }
    else
    {
      issuer.add(aIssuer);
    }
    wasAdded = true;
    return wasAdded;
  }

  public boolean removeIssuer(Authority aIssuer)
  {
    boolean wasRemoved = false;
    if (issuer.contains(aIssuer))
    {
      issuer.remove(aIssuer);
      aIssuer.setIssuedBy(null);
      wasRemoved = true;
    }
    return wasRemoved;
  }
  /* Code from template association_AddIndexControlFunctions */
  public boolean addIssuerAt(Authority aIssuer, int index)
  {  
    boolean wasAdded = false;
    if(addIssuer(aIssuer))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfIssuer()) { index = numberOfIssuer() - 1; }
      issuer.remove(aIssuer);
      issuer.add(index, aIssuer);
      wasAdded = true;
    }
    return wasAdded;
  }

  public boolean addOrMoveIssuerAt(Authority aIssuer, int index)
  {
    boolean wasAdded = false;
    if(issuer.contains(aIssuer))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfIssuer()) { index = numberOfIssuer() - 1; }
      issuer.remove(aIssuer);
      issuer.add(index, aIssuer);
      wasAdded = true;
    } 
    else 
    {
      wasAdded = addIssuerAt(aIssuer, index);
    }
    return wasAdded;
  }

  public void delete()
  {
    Role existingRole = role;
    role = null;
    if (existingRole != null)
    {
      existingRole.delete();
    }
    while( !issuer.isEmpty() )
    {
      issuer.get(0).setIssuedBy(null);
    }
  }


  public String toString()
  {
    return super.toString() + "["+
            "subjectName" + ":" + getSubjectName()+ "," +
            "subjectOrg" + ":" + getSubjectOrg()+ "," +
            "subjectDept" + ":" + getSubjectDept()+ "]" + System.getProperties().getProperty("line.separator") +
            "  " + "role = "+(getRole()!=null?Integer.toHexString(System.identityHashCode(getRole())):"null");
  }
}