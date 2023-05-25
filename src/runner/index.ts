import Chain from "../chain/index.js";
import Browser from "../browser/index.js";
import { Page } from "playwright";

export type StoryOptions = {
  defaultWalletChainId: number;
};

export class RunnerError extends Error {
  constructor(...args: any[]) {
    super(...args);
  }
}

type RunCallback = (page: Page) => void;

export default class Runner {
  public chains: { [chainId: number]: Chain };
  public browserWalletChainId: number;
  public browser: Browser;

  constructor(options: StoryOptions) {
    this.chains = {};
    this.browserWalletChainId = options.defaultWalletChainId;
    this.addChain(options.defaultWalletChainId);
    this.browser = new Browser(this.chains[this.browserWalletChainId]);
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

  async run(callback: RunCallback) {
    for (const chainId in this.chains) {
      const chain = this.chains[chainId];
      chain.start();
    }

    await this.browser.start();
    const page = await this.browser.newPage();

    callback(page);
  }
}
