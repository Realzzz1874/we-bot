import { Contact, log, Message, ScanStatus, WechatyBuilder } from "wechaty";
const path = require("path");
import { config } from "./config";


const onLogin = async (user: Contact) => {
  log.info("Bot", `${user} login`);
};

const onLogout = async (user: Contact) => {
  log.info("Bot", `${user} logout`);
};

const onMessage = async (message: Message) => {
  console.log(message);
};

const onError = async (error) => {
  log.error("Bot", "on error: ", error);
};

const onScan = async (qrcode: string, status: ScanStatus) => {
  if (status === ScanStatus.Waiting && qrcode) {
    const qrcodeImageUrl = [
      "https://wechaty.js.org/qrcode/",
      encodeURIComponent(qrcode),
    ].join("");

    log.info(
      "Bot",
      `onScan: ${ScanStatus[status]}(${status}) - ${qrcodeImageUrl}`
    );
    // show qrcode on console
    require("qrcode-terminal").generate(qrcode, { small: true });
  } else {
    log.info("Bot", `onScan: ${ScanStatus[status]}(${status})`);
  }
};

const bot = WechatyBuilder.build({
  name: "Bot",
  puppet: "wechaty-puppet-service",
  puppetOptions: {
    tls: {
      disable: true,
    },
    token: config.puppet_paimon_token
  },
})
  .on("scan", async (qrcode: string, status: ScanStatus) => {
    await onScan(qrcode, status);
  })
  .on("login", async (user: Contact) => {
    await onLogin(user);
  })
  .on("logout", async (user: Contact) => {
    await onLogout(user);
  })
  .on("message", async (message: Message) => {
    await onMessage(message);
  })
  .on("error", async (error) => {
    await onError(error);
  });

bot.start().then(() => {
  log.info("Bot started.");
  return null;
})
.catch((error) => {
  log.error("Bot", "start error: ", error.stack);
});

// ts-node-transpile-only main.ts
