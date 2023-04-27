import Chain from "./chain.js";
import Browser from "./browser.js";

export default class Story {
  public chains: { [chainId: number]: Chain };
  public chainIds: number[];
  public browserWalletChainId: number;

  constructor(browserWalletChainId: number) {
    this.chainIds = [];
    this.chains = {};
    this.chainIds.push(browserWalletChainId);
    this.browserWalletChainId = browserWalletChainId;
  }

  addChain(chainId: number) {
    this.chainIds.push(chainId);
  }

  async start(cb: any) {
    for (let i = 0; i < this.chainIds.length; i++) {
      const chainId = this.chainIds[i];
      const chain = new Chain(chainId);
      this.chains[chainId] = chain;
      chain.start();
    }

    const br = new Browser(this.chains[this.browserWalletChainId]);
    await br.start();
    const page = await br.newPage();

    cb(page);
  }
}
