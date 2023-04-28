import Story from "./story.js";

const s = new Story(1000);
s.addChain(1001);
s.addChain(1002);
s.start(async (page: any) => {
  await page.goto("http://localhost:8000");
  await page.click("#btnConnect");
  await page.click("#btnSendEth");
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
