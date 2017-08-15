'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const LineBot = require('./linebot');
const LineBotConfig = require('./linebotconfig');

const REST_PORT = (process.env.PORT || 5000);
const DEV_CONFIG = process.env.DEVELOPMENT_CONFIG == 'true';

const APIAI_ACCESS_TOKEN = process.env.APIAI_ACCESS_TOKEN;
const APIAI_LANG = process.env.APIAI_LANG;

const LINE_CHANNEL_ID = '1520056458';
const LINE_CHANNEL_SECRET = '047a51ae1557c6a602e7a417d2e68182';
const LINE_CHANNEL_ACCESS_TOKEN = 'aAMls5K18jevEiIZZlJ1zyu5u8gLxv7FGOYcaHak5tt2Zni2NfzWs5nfapzErLNnBsK8TlaCnHJvxBg1md67eMxWaFPl9GE/sCKzFpC0mM1ai70aKau/lF+0svFNjCWq8Zv1+RMvO4eRAVeYfoEybwdB04t89/1O/w1cDnyilFU=';

// console timestamps
require('console-stamp')(console, 'yyyy.mm.dd HH:MM:ss.l');

const botConfig = new LineBotConfig(APIAI_ACCESS_TOKEN, APIAI_LANG,
    LINE_CHANNEL_ID,
    LINE_CHANNEL_SECRET,
    LINE_CHANNEL_ACCESS_TOKEN);

const bot = new LineBot(botConfig);

const app = express();

app.use(bodyParser.json({
  verify: function (req, res, buf, encoding) {
    // raw body for signature check
    req.rawBody = buf.toString();
  }
}));

app.post('/webhook', (req, res) => {

  console.log('POST received');
  console.log(JSON.stringify(req.body));

  let signature = req.get('X-LINE-Signature');
  let rawBody = req.rawBody;
  let hash = crypto.createHmac('sha256', LINE_CHANNEL_SECRET).update(
      rawBody).digest('base64');

  if (hash !== signature) {
    this.log("Unauthorized request");
    return res.status(401).send('Wrong request signature');
  }

  res.status(200).send("OK");

  try {

    req.body.events.forEach((item) => {
      if (item.type === "message") {
        if (item.replyToken !== "00000000000000000000000000000000"
            && item.replyToken !== "ffffffffffffffffffffffffffffffff") {

          bot.processMessage(item, res)
              .catch(err => console.error(err));
        }
      } else if (item.type === "postback") {
        const postbackData = item.postback ? item.postback.data : '';
        console.log("postbackData", postbackData);
      }
    });

  } catch (err) {
    console.error('Error while message processing', err);
  }
});

app.listen(REST_PORT, function () {
  console.log(`Service is ready on port ${REST_PORT}`);
});