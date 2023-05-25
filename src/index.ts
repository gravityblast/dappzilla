import Runner from "./runner/index.js";

const runner = new Runner({ defaultWalletChainId: 1 });
const chain1 = runner.addChain(1001);
const chain2 = runner.addChain(1002);
const wallet = runner.browser.wallet;

runner.run(async (page: any) => {
  // await page.goto("http://localhost:8000");
  // await page.click("#btnConnect");
  // await page.click("#btnSendEth");

  await page.goto("https://builder.gitcoin.co");
  const connectButton = await page.waitForSelector("header button");
  await connectButton.click();

  wallet.grantAccountsPermission();

  const mmButton = await page.waitForSelector(
    "//div[contains(text(), 'MetaMask')]"
  );
  await mmButton.click();
});

// (async () => {

//   // navigateTo("http://localhost:8000");

//   const browser = await puppeteer.launch({
//     headless: false
//   });

//   const page = await browser.newPage();

//   // await page.goto("http://localhost:3000");
//   await page.goto("http://localhost:8000");
//   // await page.goto("https://grantshub.gitcoin.co");

// })();
// });
