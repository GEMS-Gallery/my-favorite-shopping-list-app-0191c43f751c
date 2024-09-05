export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const Time = IDL.Int;
  const ShoppingItem = IDL.Record({
    'id' : IDL.Nat,
    'createdAt' : Time,
    'text' : IDL.Text,
    'completed' : IDL.Bool,
    'description' : IDL.Text,
  });
  return IDL.Service({
    'addItem' : IDL.Func([IDL.Text, IDL.Text], [IDL.Nat], []),
    'deleteItem' : IDL.Func([IDL.Nat], [Result], []),
    'editItem' : IDL.Func([IDL.Nat, IDL.Text, IDL.Text], [Result], []),
    'getItems' : IDL.Func([], [IDL.Vec(ShoppingItem)], ['query']),
    'markItemCompleted' : IDL.Func([IDL.Nat], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
