import ganache, { Server } from "ganache";

export default class Chain {
  public server: Server;
  public provider: any;

  constructor() {
    this.server = ganache.server();
    this.provider = this.server.provider;
    console.log("provider", this.provider);
  }

  start() {
    const options = {};
    const server = ganache.server(options);
    const PORT = 8545;
    console.log("starting");
    server
      .listen(PORT)
      .then(() => {
        console.log(`ganache listening on port ${PORT}...`);
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
