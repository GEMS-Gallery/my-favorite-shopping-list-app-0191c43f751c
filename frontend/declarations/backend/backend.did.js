export const idlFactory = ({ IDL }) => {
  const Time = IDL.Int;
  const Result_1 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const ShoppingItem = IDL.Record({
    'id' : IDL.Nat,
    'createdAt' : Time,
    'text' : IDL.Text,
    'completed' : IDL.Bool,
    'dueDate' : IDL.Opt(Time),
    'description' : IDL.Text,
  });
  return IDL.Service({
    'addItem' : IDL.Func([IDL.Text, IDL.Text, IDL.Opt(Time)], [Result_1], []),
    'deleteItem' : IDL.Func([IDL.Nat], [Result], []),
    'editItem' : IDL.Func(
        [IDL.Nat, IDL.Text, IDL.Text, IDL.Opt(Time)],
        [Result],
        [],
      ),
    'getItems' : IDL.Func([], [IDL.Vec(ShoppingItem)], ['query']),
    'markItemCompleted' : IDL.Func([IDL.Nat], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
