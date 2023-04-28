const prettyNumber = (n) =>
  n
    .toString()
    .split("")
    .reverse()
    .join("")
    .split(/(.{3})/)
    .filter((s) => s.length > 0)
    .join("_")
    .split("")
    .reverse()
    .join("");

let logEl;

const log = (s) => {
  const curr = logEl.innerText;
  logEl.innerText = curr + "\n" + s;
};

window.addEventListener("load", async () => {
  logEl = document.getElementById("log");

  const btnConnect = document.getElementById("btnConnect");
  btnConnect.addEventListener("click", async (e) => {
    e.preventDefault();
    if (typeof window.ethereum !== "undefined") {
      log("MetaMask is installed!");
    } else {
      log("MetaMask is not installed!");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    log(signer.address);

    const { chainId } = await provider.getNetwork();
    log(`chainId: ${chainId}`);

    const balance = await provider.getBalance(signer.address);
    log(`balance: ${prettyNumber(balance)}`);

    const btnSendEth = document.getElementById("btnSendEth");
    btnSendEth.addEventListener("click", async (e) => {
      e.preventDefault();

      const tx = {
        to: "0x0000000000000000000000000000000000000000",
        value: ethers.parseEther("2", "ether"),
      };
      const transaction = await signer.sendTransaction(tx);
      log(`sent tx: ${transaction.hash}`);
      log("waiting for confirmations...");
      await transaction.wait();

      const balance = await provider.getBalance(signer.address);
      log(`new balance: ${prettyNumber(balance)}`);
    });

    // const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    // const account = accounts[0];
    // log(account);

    // const chainId = await ethereum.request({ method: "eth_chainId" });
    // log(parseInt(chainId));
  });
});
