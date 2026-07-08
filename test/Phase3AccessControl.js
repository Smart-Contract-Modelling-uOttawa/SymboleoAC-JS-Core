/* eslint-disable max-len, no-unused-expressions */
// Phase-3 access-control semantics (SymboleoAC-Incoterms iteration plan,
// item O4b "downward": give the ontology's full AC vocabulary runtime
// semantics). Covered here:
// - spec-level rules routed to the constraints tier (grantor is a policy
//   controller) count as GRANTS at request time, not only as validity
//   constraints on later rule additions;
// - a 'grant all' implies read, write, and transfer (a request for 'all'
//   still requires an 'all' rule);
// - 'revoke' is deny-overrides: it defeats explicit grants and the
//   structural pre-authorizations (owner, controller, ...) alike, and a
//   revocation is never rejected as "already permitted";
// - transferResource executes the transfer action: a permission-checked
//   ownership reassignment -- the negotiable bill of lading's endorsement.
const { expect } = require('chai');
const { ACPolicy } = require('../ontology/core/ACPolicy.js');
const { Asset } = require('../ontology/core/Asset.js');
const { Role } = require('../ontology/core/Role.js');
const { SymboleoContract } = require('../ontology/core/SymboleoContract.js');

function fixture() {
  const contract = new SymboleoContract('c1');
  // The AC layer matches roles/resources by _name and _type, which the
  // GENERATED domain subclasses set; the base Role class sets only _id, so
  // hand-built roles must set them too (else every comparison degenerates
  // to undefined === undefined).
  const mkRole = (n) => { const r = new Role(n, contract); r._name = n; r._type = 'Role'; return r; };
  const seller = mkRole('seller');
  const buyer = mkRole('buyer');
  const carrier = mkRole('carrier');
  const subBuyer = mkRole('subBuyer');
  const policy = new ACPolicy(seller); // seller is the policy controller
  // Constructed the way the generated Asset subclasses do it: owner only
  // (passing a contract hits a pre-existing dead-path defect upstream).
  const bl = new Asset('billOfLading', seller);
  bl._name = 'billOfLading';
  bl.owner = seller; // as the generated Asset subclasses set it
  return { contract, seller, buyer, carrier, subBuyer, policy, bl };
}

describe('constraint-tier rules are grants at request time (O4b)', () => {
  it('a spec rule granted BY the policy controller authorizes the grantee', () => {
    const { policy, bl, buyer, seller } = fixture();
    // seller is the policy controller, so addRulee routes this into the
    // constraints tier -- previously invisible to hasPermesstion.
    policy.addRulee('grant', 'transfer', bl, buyer, seller);
    expect(policy.hasPermesstion('grant', 'transfer', bl, buyer, seller)).to.be.true;
  });

  it('an ungranted role stays unauthorized', () => {
    const { policy, bl, carrier, seller } = fixture();
    expect(policy.hasPermesstion('grant', 'transfer', bl, carrier, seller)).to.be.false;
  });
});

describe("'all' implication (O4b)", () => {
  it("grant all implies read, write, and transfer", () => {
    const { policy, bl, buyer, seller } = fixture();
    policy.addRulee('grant', 'all', bl, buyer, seller);
    for (const action of ['read', 'write', 'transfer']) {
      expect(policy.hasPermesstion('grant', action, bl, buyer, seller),
        `all should imply ${action}`).to.be.true;
    }
  });

  it("a request for 'all' requires an 'all' rule", () => {
    const { policy, bl, buyer, seller } = fixture();
    policy.addRulee('grant', 'read', bl, buyer, seller);
    expect(policy.hasPermesstion('grant', 'all', bl, buyer, seller)).to.be.false;
  });
});

describe('revoke is deny-overrides (O4b)', () => {
  it('revoke defeats an explicit grant', () => {
    const { policy, bl, buyer, seller } = fixture();
    policy.addRulee('grant', 'read', bl, buyer, seller);
    policy.addRulee('revoke', 'read', bl, buyer, seller);
    expect(policy.hasPermesstion('grant', 'read', bl, buyer, seller)).to.be.false;
  });

  it("revoke of 'all' defeats every action", () => {
    const { policy, bl, buyer, seller } = fixture();
    policy.addRulee('grant', 'transfer', bl, buyer, seller);
    policy.addRulee('revoke', 'all', bl, buyer, seller);
    for (const action of ['read', 'write', 'transfer']) {
      expect(policy.hasPermesstion('grant', action, bl, buyer, seller),
        `revoke all should defeat ${action}`).to.be.false;
    }
  });

  it('revoke defeats the structural owner pre-authorization', () => {
    const { policy, bl, seller } = fixture();
    // seller owns the bill of lading, so it is structurally pre-authorized...
    expect(policy.hasPermesstion('grant', 'read', bl, seller, seller)).to.be.true;
    // ...until an explicit revocation lands (e.g. after termination).
    policy.addRulee('revoke', 'read', bl, seller, seller);
    expect(policy.hasPermesstion('grant', 'read', bl, seller, seller)).to.be.false;
  });
});

describe('transferResource: the endorsement device (O4b)', () => {
  it('an explicit grantee can take the document over', () => {
    const { policy, bl, buyer, seller } = fixture();
    policy.addRulee('grant', 'transfer', bl, buyer, seller);
    expect(policy.transferResource(bl, buyer, buyer)).to.be.true;
    expect(bl.owner).to.equal(buyer);
    expect(bl.findController(buyer)).to.be.true;
  });

  it('the owner may endorse without any explicit grant, and the endorsement chains', () => {
    const { policy, bl, buyer, subBuyer, seller } = fixture();
    // The shipper (owner) endorses to the buyer...
    expect(policy.transferResource(bl, seller, buyer)).to.be.true;
    expect(bl.owner).to.equal(buyer);
    // ...and the buyer, now owner/holder, endorses onward (sale in transit)
    // with no further grant needed.
    expect(policy.transferResource(bl, buyer, subBuyer)).to.be.true;
    expect(bl.owner).to.equal(subBuyer);
  });

  it('an unauthorized role cannot transfer', () => {
    const { policy, bl, carrier, buyer } = fixture();
    expect(policy.transferResource(bl, carrier, buyer)).to.be.false;
    expect(bl.owner._name).to.equal('seller');
  });

  it('a revoked transfer right cannot be exercised', () => {
    const { policy, bl, buyer, seller } = fixture();
    policy.addRulee('grant', 'transfer', bl, buyer, seller);
    policy.addRulee('revoke', 'transfer', bl, buyer, seller);
    expect(policy.transferResource(bl, buyer, buyer)).to.be.false;
  });
});
