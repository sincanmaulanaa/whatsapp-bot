const fs = require("fs");

const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");

const whatsapp = new Client({
  authStrategy: new LocalAuth(),
});

const express = require("express");
const app = express();
const port = 3000;

whatsapp.on("qr", (qr) => {
  qrcode.generate(qr, {
    small: true,
  });
});

whatsapp.on("ready", () => {
  console.log("Client is ready!");
});

whatsapp.on("message", async (message) => {
  if (message.body === "ping") {
    message.reply("pong");
    console.log(message.from);
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/send-whatsapp-notification", (req, res) => {
  let parents = fs.readFileSync("parents.json");
  parents = JSON.parse(parents);

  for (let i = 0; i < parents.length; i++) {
    let numbers = parents[i].number + "@ac.us";
    let text =
      "Dear Mr/Mrs " +
      parents[i].number +
      " we inform you that " +
      parents[i].student +
      " is nakal, \nThank you";
    console.log(numbers);

    whatsapp.sendMessage(numbers, text);
  }

  res.send(parents);
});

whatsapp.initialize();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
