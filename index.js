'use strict';

const line = require('@line/bot-sdk');
const middleware = require('@line/bot-sdk').middleware;
const express = require('express');
const request = require('request');
const bp = require('body-parser');

// create LINE SDK config from env variables
const config = {
    channelAccessToken: 'aAMls5K18jevEiIZZlJ1zyu5u8gLxv7FGOYcaHak5tt2Zni2NfzWs5nfapzErLNnBsK8TlaCnHJvxBg1md67eMxWaFPl9GE/sCKzFpC0mM1ai70aKau/lF+0svFNjCWq8Zv1+RMvO4eRAVeYfoEybwdB04t89/1O/w1cDnyilFU=',
    channelSecret: '047a51ae1557c6a602e7a417d2e68182',
};


// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();
app.use(middleware(config))
app.use(bp.json())

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/webhook', (req, res) => {
    //console.log(req);
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result))
        .catch((err) => { console.log(err) })
});

var messageReturn = 'ว่าไงนะ อีกทีสิ ';
var messageRand = ['ง่วงจัง', 'กี่โมงแล้ว ?', 'ขอบคุณค่ะ', 'คิดถึงนะ', 'ไสว่าซิบ่ถิ่มกัน', 'beta test เอ๋อๆหน่อย', 'หิวข้าวอะ', 'ดริ้งกันไหม', 'อย่าว่ากันดิ'];
var messageHa = ['lol', 'ขำหรอ ?', '666666', '5555555', 'ตลกจัง', 'อารมณ์ดีเพราะมีความสุข', 'ขำหาพร่อง', 'อิอิ', 'ตลกละดิ'];
var messagePicH = ['ว่าไง', 'เอ้อ ว่ามา', '....', 'เรียบกุอยู่นั้น', 'มีไรน้อง', 'มีอะไรให้ช่วยไหม', 'ใครรวย', 'อิอิ', 'ไง'];
var messageHungry = ['หิวหรอ', 'กินไรดีอะ', 'หิวก้อไปหาไรแดกซะ', 'อิอิ', 'อยากกินอะไรค่ะ เด๋วพาไป', 'มีอะไรให้ช่วยไหม', 'ปะ กินข้าวกัน', 'กินขี้', 'หิวเหมือนกัน'];
var messageFood = ['มาม่าต้ม', 'ข้าวมันไก่', 'ขี้', 'ลูกชิ้นปลาระเบิด', 'บุฟเฟ่ปะ', 'MK', 'Shabu shi', 'Shabu shit', 'ราเมง'];
// event handler
function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        // ignore non-text-message event
        return Promise.resolve(null);
    }

    if (event.message.text.indexOf("สวัสดี' ") + 1) {
        messageReturn = 'สวัสดีเหมือนกันจ้า';
    }
    else if ((event.message.text.indexOf("ควย") + 1) || (event.message.text.indexOf("สัส") + 1) || (event.message.text.indexOf("เหี้ย") + 1 || event.message.text.indexOf("กวย") + 1)) {
        messageReturn = 'ไม่พูดหยาบคายนะค่ะสัส ';
    }
    else if (event.message.text.indexOf("ทำ") + 1) {
        messageReturn = 'ไม่บอกหรอก ความลับ';
    }
    else if (event.message.text.indexOf(".") + 1) {
        var item = messageRand[Math.floor(Math.random() * messageRand.length)];
        messageReturn = item;
    }
    else if (event.message.text.indexOf("55") + 1) {
        var item = messageHa[Math.floor(Math.random() * messageHa.length)];
        messageReturn = item;
    }
    else if ((event.message.text.indexOf("กี่โมง") + 1) || (event.message.text.indexOf("เวลา") + 1)) {
        var newDate = new Date().getTimezoneOffset();

        messageReturn = "ขณะนี้เวลา " + (newDate / -420);
    }
    else if (event.message.text.indexOf("ร้องเพลง") + 1) {

        messageReturn = 'ให้มัน หะ หะ หะ หะ หะ หายยยยย';
    }
    else if (event.message.text.indexOf("ขำ") + 1) {
        var item = messageHa[Math.floor(Math.random() * messageHa.length)];
        messageReturn = item;
    }
    else if (event.message.text.indexOf("น่ารัก") + 1) {
        messageReturn = 'ใครๆก็ว่าแบบนั้นนะ';
    }
    else if (event.message.text.indexOf("อิอิ") + 1) {
        var item = messageRand[Math.floor(Math.random() * messageRand.length)];
        messageReturn = item;
    }
    else if (event.message.text.indexOf("พิช") + 1) {
        var item = messagePicH[Math.floor(Math.random() * messagePicH.length)];
        messageReturn = item;
    }
    else if (event.message.text.indexOf("หิว") + 1) {
        var item = messageHungry[Math.floor(Math.random() * messageHungry.length)];
        messageReturn = item;
    }
    else if ((event.message.text.indexOf("อาหาร") + 1) || (event.message.text.indexOf("กินอะ") + 1) || (event.message.text.indexOf("กินไร") + 1) || (event.message.text.indexOf("ไปกิน") + 1)) {
        var item = messageFood[Math.floor(Math.random() * messageFood.length)];
        messageReturn = item;
    }
    else if (event.message.text.indexOf("BTC") + 1) {
        var a = open("https://www.google.com/finance/converter?a=1&from=BTC&to=THB");
        var b = document.documentElement.innerHTML;
        messageReturn = b;
    }
    else if (event.message.text.indexOf("ทดสอบ") + 1) {
        event.source.profile().then(function (profile) {
            var aaa = 'Hello ' + profile.displayName;
            messageReturn = aaa.toString();
        }).catch(function (error) {
            messageReturn = "Error";
        });
        
    }
    else {
        messageReturn = '';
    }
    const echo = { type: 'text', text: messageReturn };

    return client.replyMessage(event.replyToken, echo);
}



// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});

