import Chain from "../chain/index.js";
import { RPCRProvideRequestArguments } from "./types.js";

class WalletError extends Error {
  public code: number;

  constructor(message: string, code: number) {
    super(message);
    this.code = code;
  }

  asObject() {
    return {
      code: this.code,
      message: this.message,
    };
  }
}

class UserRejectedRequestError extends WalletError {
  constructor() {
    super("User rejected the request.", 4001);
  }
}

export default class Wallet {
  public chain: Chain;
  public accountsPermissionGranted: boolean;

  constructor(chain: Chain) {
    this.chain = chain;
    this.accountsPermissionGranted = false;
  }

  grantAccountsPermission() {
    this.accountsPermissionGranted = true;
  }

  async request(args: RPCRProvideRequestArguments) {
    console.log("ethRequest called", args.method, args);
    switch (args.method) {
      case "eth_accounts": {
        if (!this.accountsPermissionGranted) {
          return this.requestAccounts();
        }

        return this.chain.provider.request(args);
      }

      case "eth_requestAccounts": {
        return this.requestAccounts();
      }

      default:
        console.log("called", args);
        let res: any;
        try {
          res = await this.chain.provider.request(args);
        } catch (e) {
          console.log("--- err", e);
        }
        console.log("returning", res);
        return res;
    }
  }

  async requestAccounts() {
    if (!this.accountsPermissionGranted) {
      const error = new UserRejectedRequestError();
      throw error.asObject();
    }

    return await this.chain.provider.request({
      method: "eth_accounts",
      params: [],
    });
  }
}
