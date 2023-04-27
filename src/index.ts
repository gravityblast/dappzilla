import Story from "./story.js";

const s = new Story();
s.startChain();
s.start(async (page: any) => {
  await page.goto("http://localhost:8000");
  await page.click("#connect");
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
