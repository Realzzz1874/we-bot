import { Contact, log, Message, ScanStatus, WechatyBuilder } from "wechaty";
// import { config } from "./config";

const path = require("path");


const bot = WechatyBuilder.build({
  name: "Bot",
  // puppet: "wechaty-puppet-padlocal",
  // puppetOptions: { token: config.puppet_padlocal_token },
})

  .on("scan", (qrcode: string, status: ScanStatus) => {
    if (status === ScanStatus.Waiting && qrcode) {
      const qrcodeImageUrl = [
        "https://wechaty.js.org/qrcode/",
        encodeURIComponent(qrcode),
      ].join("");

      log.info(
        "Bot",
        `onScan: ${ScanStatus[status]}(${status}) - ${qrcodeImageUrl}`
      );

      require("qrcode-terminal").generate(qrcode, { small: true }); // show qrcode on console
    } else {
      log.info("Bot", `onScan: ${ScanStatus[status]}(${status})`);
    }
  })

  .on("login", (user: Contact) => {
    log.info("Bot", `${user} login`);
  })

  .on("logout", (user: Contact) => {
    log.info("Bot", `${user} logout`);
  })

  .on("message", async (message: Message) => {
    console.log(message);
  })

  .on("error", (error) => {
    log.error("Bot", "on error: ", error.stack);
  });

bot.start().then(() => {
  log.info("Bot started.");
});

// ts-node-transpile-only main.ts
