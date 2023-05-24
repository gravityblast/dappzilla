export interface RPCRProvideRequestArguments {
  readonly method: string;
  readonly params?: readonly unknown[] | object;
}
