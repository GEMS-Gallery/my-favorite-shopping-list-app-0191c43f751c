import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Result = { 'ok' : null } |
  { 'err' : string };
export interface ShoppingItem {
  'id' : bigint,
  'createdAt' : Time,
  'text' : string,
  'completed' : boolean,
  'description' : string,
}
export type Time = bigint;
export interface _SERVICE {
  'addItem' : ActorMethod<[string, string], bigint>,
  'deleteItem' : ActorMethod<[bigint], Result>,
  'editItem' : ActorMethod<[bigint, string, string], Result>,
  'getItems' : ActorMethod<[], Array<ShoppingItem>>,
  'markItemCompleted' : ActorMethod<[bigint], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
