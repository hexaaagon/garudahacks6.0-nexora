// @ts-check
import { Client, RemoteAuth } from "whatsapp-web.js";
import { generate } from "qrcode-terminal";

import { mongoose } from "@nexora/database";
import { MongoStore } from "wwebjs-mongo";

const client = new Client({
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
  authStrategy: new RemoteAuth({
    store: new MongoStore({
      mongoose: mongoose,
    }),
    backupSyncIntervalMs: 300000,
  }),
});

// Setup
client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("qr", (qr) => {
  generate(qr, { small: true });
});

//Bot
client.on("message", async (msg) => {
  console.log(`Received message: ${msg.body}`);
  console.log(`From: ${msg.from}`);
  console.log(`To: ${msg.to}`);
  //send msg.body/from/to  to the database

  if (msg.hasMedia) {
    const media = await msg.downloadMedia();
    console.log(`Media received: ${media.filename}`);
    console.log(`Media type: ${media.mimetype}`);
    console.log(`Media size: ${media.filesize} bytes`);

    // Handle media file
  }
});

client.initialize();
