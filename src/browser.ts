import puppeteer from "puppeteer";
import Chain from "./chain.js";
import Wallet from "./wallet.js";
import { RPCRProvideRequestArguments } from "./types.js";

export default class Browser {
  public browser: any;
  public chain: Chain;
  public wallet: Wallet;

  constructor(chain: Chain) {
    this.chain = chain;
    this.wallet = new Wallet(chain);
  }

  async start() {
    this.browser = await puppeteer.launch({
      headless: false,
    });

    this.setupWallet();
  }

  setupWallet() {
    this.browser.on("targetchanged", async (target: any) => {
      const targetPage = await target.page();
      const client = await targetPage.target().createCDPSession();
      await client.send("Runtime.evaluate", {
        expression: `
          window.ethereum = {
            isMetaMask: true,

            isConnected: function() {
              return true;
            },

            request: function(args) {
              return ethRequest(args)
            },

            on: function() {
              console.log("------- provider.on", arguments);
            }
          }
        `,
      });
    });
  }

  async newPage() {
    const page = await this.browser.newPage();

    page.on("request", (request: any) => {
      console.log(
        "request",
        request.url(),
        request.method(),
        request.postData()
      );
    });

    await this.exposeEthRequest(page);

    return page;
  }

  async exposeEthRequest(page: any) {
    await page.exposeFunction(
      "ethRequest",
      this.wallet.request.bind(this.wallet)
    );
  }
}
