import ganache, { Server } from "ganache";

let nextChainPort = 8545;

export default class Chain {
  public server: Server;
  public provider: any;
  public chainId: number;
  public port: number;

  constructor(chainId: number) {
    this.chainId = chainId;
    this.port = nextChainPort++;

    const options = {
      chainId: this.chainId,
    };

    this.server = ganache.server(options);
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
