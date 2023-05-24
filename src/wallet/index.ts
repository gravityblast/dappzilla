import Chain from "../chain/index.js";
import { RPCRProvideRequestArguments } from "./types.js";

export default class Wallet {
  public chain: Chain;

  constructor(chain: Chain) {
    this.chain = chain;
  }

  async request(args: RPCRProvideRequestArguments) {
    console.log("ethRequest called", args.method, args);
    switch (args.method) {
      case "eth_requestAccounts": {
        console.log("call:", args.method);
        const res = await this.chain.provider.request({
          method: "eth_accounts",
          params: [],
        });
        console.log("returning", res);
        return res;
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
}
