import ganache, { Server } from "ganache";

let nextChainPort = 8545;

export type ChainOptions = {
  chainId: number;
};

export default class Chain {
  public server: Server;
  public provider: any;
  public chainId: number;
  public port: number;

  constructor(options: ChainOptions) {
    this.chainId = options.chainId;
    // FIXME: check that next port has not been used with a custom chain
    this.port = nextChainPort++;

    const serverOptions = {
      chainId: this.chainId,
    };

    this.server = ganache.server(serverOptions);
    this.provider = this.server.provider;
    console.log("provider", this.provider);
  }

  start() {
    console.log("starting");
    this.server
      .listen(this.port)
      .then(() => {
        console.log(`chain ${this.chainId} on port ${this.port}...`);
        console.log("provider", this.provider);

        this.provider
          .request({
            method: "eth_accounts",
            params: [],
          })
          .then((accounts: Array<string>) => {
            console.log(accounts);
          });
      })
      .catch((err) => {
        console.error(err);
      });
    console.log("started");
  }
}
