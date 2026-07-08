/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.37.0.8639.dcaf9c798 modeling language!*/



/**
 * Phase 3 (O4c): Operation.preCondition/postCondition were typed as
 * Condition, but no Condition class existed. Declare it explicitly, with
 * the left-side/operator/right-side shape the runtime uses in
 * LegalSituation metadata.
 */
// line 238 "model.ump"
// line 369 "model.ump"
public class Condition
{

  //------------------------
  // MEMBER VARIABLES
  //------------------------

  //Condition Attributes
  private String leftSide;
  private String op;
  private String rightSide;

  //------------------------
  // CONSTRUCTOR
  //------------------------

  public Condition(String aLeftSide, String aOp, String aRightSide)
  {
    leftSide = aLeftSide;
    op = aOp;
    rightSide = aRightSide;
  }

  //------------------------
  // INTERFACE
  //------------------------

  public boolean setLeftSide(String aLeftSide)
  {
    boolean wasSet = false;
    leftSide = aLeftSide;
    wasSet = true;
    return wasSet;
  }

  public boolean setOp(String aOp)
  {
    boolean wasSet = false;
    op = aOp;
    wasSet = true;
    return wasSet;
  }

  public boolean setRightSide(String aRightSide)
  {
    boolean wasSet = false;
    rightSide = aRightSide;
    wasSet = true;
    return wasSet;
  }

  public String getLeftSide()
  {
    return leftSide;
  }

  public String getOp()
  {
    return op;
  }

  public String getRightSide()
  {
    return rightSide;
  }

  public void delete()
  {}


  public String toString()
  {
    return super.toString() + "["+
            "leftSide" + ":" + getLeftSide()+ "," +
            "op" + ":" + getOp()+ "," +
            "rightSide" + ":" + getRightSide()+ "]";
  }
}