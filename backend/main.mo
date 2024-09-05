import Bool "mo:base/Bool";
import Nat "mo:base/Nat";

import Array "mo:base/Array";
import List "mo:base/List";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Result "mo:base/Result";

actor {
  type ShoppingItem = {
    id: Nat;
    text: Text;
    description: Text;
    completed: Bool;
    createdAt: Time.Time;
  };

  stable var items : [ShoppingItem] = [];
  stable var nextId : Nat = 0;

  public func addItem(text: Text, description: Text) : async Nat {
    let id = nextId;
    let item : ShoppingItem = {
      id = id;
      text = text;
      description = description;
      completed = false;
      createdAt = Time.now();
    };
    items := Array.append(items, [item]);
    nextId += 1;
    id
  };

  public query func getItems() : async [ShoppingItem] {
    items
  };

  public func markItemCompleted(id: Nat) : async Result.Result<(), Text> {
    let index = Array.indexOf<ShoppingItem>(
      { id = id; text = ""; description = ""; completed = false; createdAt = 0 },
      items,
      func(a, b) { a.id == b.id }
    );
    switch (index) {
      case null { #err("Item not found") };
      case (?i) {
        let updatedItem = {
          id = items[i].id;
          text = items[i].text;
          description = items[i].description;
          completed = true;
          createdAt = items[i].createdAt;
        };
        items := Array.tabulate<ShoppingItem>(items.size(), func (j) {
          if (j == i) { updatedItem } else { items[j] }
        });
        #ok()
      };
    }
  };

  public func deleteItem(id: Nat) : async Result.Result<(), Text> {
    let newItems = Array.filter<ShoppingItem>(items, func(item) { item.id != id });
    if (newItems.size() == items.size()) {
      #err("Item not found")
    } else {
      items := newItems;
      #ok()
    }
  };

  public func editItem(id: Nat, newText: Text, newDescription: Text) : async Result.Result<(), Text> {
    let index = Array.indexOf<ShoppingItem>(
      { id = id; text = ""; description = ""; completed = false; createdAt = 0 },
      items,
      func(a, b) { a.id == b.id }
    );
    switch (index) {
      case null { #err("Item not found") };
      case (?i) {
        let updatedItem = {
          id = items[i].id;
          text = newText;
          description = newDescription;
          completed = items[i].completed;
          createdAt = items[i].createdAt;
        };
        items := Array.tabulate<ShoppingItem>(items.size(), func (j) {
          if (j == i) { updatedItem } else { items[j] }
        });
        #ok()
      };
    }
  };
}
