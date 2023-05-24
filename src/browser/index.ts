import { chromium, devices, Browser, BrowserContext } from "playwright";

import Chain from "../chain/index.js";
import Wallet from "../wallet/index.js";
// import { RPCRProvideRequestArguments } from "./types.js";

const __ethRequest = (args: any) => {};

export default class BrowserWrapper {
  public browser: Browser | undefined;
  public context: BrowserContext | undefined;
  public chain: Chain;
  public wallet: Wallet;

  constructor(chain: Chain) {
    this.chain = chain;
    this.wallet = new Wallet(chain);
  }

  async start() {
    this.browser = await chromium.launch({
      headless: false,
    });

    this.context = await this.browser.newContext(devices["Desktop Chrome"]);
    await this.setupWallet();
  }

  async setupWallet() {
    await this.context!.addInitScript(() => {
      (window as any).ethereum = {
        isMetaMask: true,

        isConnected: function () {
          return true;
        },

        request: function (args: any) {
          return __ethRequest(args);
        },

        on: function () {
          console.log("------- provider.on", arguments);
        },
      };
    });
  }

  async newPage() {
    if (this.context === undefined) {
      throw new Error("browser context not initialized");
    }

    const page = await this.context.newPage();

    page.route("**", (route) => {
      const req = route.request();

      if (
        new RegExp("^https://rum.browser-intake-datadoghq.eu").test(
          req.url()
        ) ||
        new RegExp("intercom").test(req.url())
      ) {
        route.abort();
        return;
      }

      if (new RegExp("mainnet").test(req.url())) {
        route.abort();
        return;
      }

      console.log(
        "------------------------------",
        req.url(),
        req.method(),
        req.postData()
      );
      route.continue();
    });

    await page.exposeBinding("__ethRequest", (_binding, args) => {
      return this.wallet.request(args);
    });

    return page;
  }
}
