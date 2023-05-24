import Chain from "../chain/index.js";
import Browser from "../browser/index.js";

export type StoryOptions = {
  defaultWalletChainId: number;
};

export class RunnerError extends Error {
  constructor(...args: any[]) {
    super(...args);
  }
}

export default class Runner {
  public chains: { [chainId: number]: Chain };
  public browserWalletChainId: number;

  constructor(options: StoryOptions) {
    this.chains = {};
    this.browserWalletChainId = options.defaultWalletChainId;
    this.addChain(options.defaultWalletChainId);
  }

  browserWalletChain() {
    return this.chains[this.browserWalletChainId];
  }

  addChain(chainId: number) {
    if (this.chains[chainId] !== undefined) {
      throw new RunnerError(`chainId ${chainId} already added`);
    }

    const chain = new Chain({ chainId });
    this.chains[chainId] = chain;
    return chain;
  }

  async start(cb: any) {
    for (const chainId in this.chains) {
      const chain = this.chains[chainId];
      chain.start();
    }

    const br = new Browser(this.chains[this.browserWalletChainId]);
    await br.start();
    const page = await br.newPage();

    cb(page);
  }
}
