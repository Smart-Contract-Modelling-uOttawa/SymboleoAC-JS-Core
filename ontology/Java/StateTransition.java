/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.37.0.8639.dcaf9c798 modeling language!*/


import java.util.*;

/**
 * For Access Control
 */
// line 224 "model.ump"
// line 359 "model.ump"
public class StateTransition extends Resource
{

  //------------------------
  // MEMBER VARIABLES
  //------------------------

  //StateTransition Associations
  private LegalPosition legalpositionST;

  //------------------------
  // CONSTRUCTOR
  //------------------------

  public StateTransition(LegalPosition aLegalpositionST, Role... allControllers)
  {
    super(allControllers);
    if (aLegalpositionST == null || aLegalpositionST.getStateTransition() != null)
    {
      throw new RuntimeException("Unable to create StateTransition due to aLegalpositionST. See https://manual.umple.org?RE002ViolationofAssociationMultiplicity.html");
    }
    legalpositionST = aLegalpositionST;
  }

  public StateTransition(LegalSituation aAntecedentForLegalpositionST, LegalSituation aConsequentForLegalpositionST, Contract aContractForLegalpositionST, Role aDebtorForLegalpositionST, Role aCreditorForLegalpositionST, Role... allControllersForLegalpositionST, Role... allControllers)
  {
    super(allControllers);
    legalpositionST = new LegalPosition(aAntecedentForLegalpositionST, aConsequentForLegalpositionST, this, aContractForLegalpositionST, aDebtorForLegalpositionST, aCreditorForLegalpositionST, allControllersForLegalpositionST);
  }

  //------------------------
  // INTERFACE
  //------------------------
  /* Code from template association_GetOne */
  public LegalPosition getLegalpositionST()
  {
    return legalpositionST;
  }

  public void delete()
  {
    LegalPosition existingLegalpositionST = legalpositionST;
    legalpositionST = null;
    if (existingLegalpositionST != null)
    {
      existingLegalpositionST.delete();
    }
    super.delete();
  }

}