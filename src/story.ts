import Chain from "./chain.js";
import Browser from "./browser.js";

export default class Story {
  public chain: Chain;

  constructor() {
    this.chain = new Chain();
  }

  startChain() {
    this.chain.start();
  }

  async start(cb: any) {
    const br = new Browser(this.chain);
    await br.start();
    const page = await br.newPage();

    cb(page);
  }
}
