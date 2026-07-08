/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.37.0.8639.dcaf9c798 modeling language!*/



// line 92 "model.ump"
// line 304 "model.ump"
public class TimeInterval
{

  //------------------------
  // MEMBER VARIABLES
  //------------------------

  //TimeInterval Associations
  private TimePoint start;
  private TimePoint end;

  //------------------------
  // CONSTRUCTOR
  //------------------------

  public TimeInterval(TimePoint aStart, TimePoint aEnd)
  {
    if (!setStart(aStart))
    {
      throw new RuntimeException("Unable to create TimeInterval due to aStart. See https://manual.umple.org?RE002ViolationofAssociationMultiplicity.html");
    }
    if (!setEnd(aEnd))
    {
      throw new RuntimeException("Unable to create TimeInterval due to aEnd. See https://manual.umple.org?RE002ViolationofAssociationMultiplicity.html");
    }
  }

  //------------------------
  // INTERFACE
  //------------------------
  /* Code from template association_GetOne */
  public TimePoint getStart()
  {
    return start;
  }
  /* Code from template association_GetOne */
  public TimePoint getEnd()
  {
    return end;
  }
  /* Code from template association_SetUnidirectionalOne */
  public boolean setStart(TimePoint aNewStart)
  {
    boolean wasSet = false;
    if (aNewStart != null)
    {
      start = aNewStart;
      wasSet = true;
    }
    return wasSet;
  }
  /* Code from template association_SetUnidirectionalOne */
  public boolean setEnd(TimePoint aNewEnd)
  {
    boolean wasSet = false;
    if (aNewEnd != null)
    {
      end = aNewEnd;
      wasSet = true;
    }
    return wasSet;
  }

  public void delete()
  {
    start = null;
    end = null;
  }

}