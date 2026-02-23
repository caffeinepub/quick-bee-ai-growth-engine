import Map "mo:core/Map";
import Text "mo:core/Text";

module {
  type OldLead = {
    id : Text;
    agency : Text;
    name : Text;
    contact : Text;
    city : Text;
    niche : Text;
    status : Text;
    revenuePotential : Nat;
    createdAt : Int;
    owner : Text;
  };

  type OldActor = {
    leads : Map.Map<Text, OldLead>;
  };

  type NewLead = {
    id : Text;
    agency : Text;
    name : Text;
    contact : Text;
    city : Text;
    niche : Text;
    status : Text;
    revenuePotential : Nat;
    createdAt : Int;
    owner : Text;
    paymentStatus : ?{ #pending; #paid; #failed; #cancelled };
    notes : ?Text;
  };

  type NewActor = {
    leads : Map.Map<Text, NewLead>;
  };

  public func run(old : OldActor) : NewActor {
    let newLeads = old.leads.map<Text, OldLead, NewLead>(
      func(_id, oldLead) {
        { oldLead with paymentStatus = null; notes = null };
      }
    );
    { leads = newLeads };
  };
};
