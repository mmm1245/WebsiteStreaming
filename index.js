const fs = require("fs");
//const puppeteer = require("puppeteer");
const puppeteer = require('puppeteer-extra')

const { DEFAULT_INTERCEPT_RESOLUTION_PRIORITY } = require('puppeteer')
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(
  AdblockerPlugin({
    // Optionally enable Cooperative Mode for several request interceptors
    interceptResolutionPriority: DEFAULT_INTERCEPT_RESOLUTION_PRIORITY
  })
)

const url = "https://www.coolmathgames.com/sites/default/files/public_games/40034/?gd_sdk_referrer_url=https%3A%2F%2Fwww.coolmathgames.com%2F0-fireboy-and-water-girl-in-the-forest-temple";

const express = require('express');
const app = express();
const PORT = 8080;


const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static('.'));

var page;

io.on('connection', (socket) => {
	console.log('a user connected');
	socket.on('click', (msg) => {
		console.log('click: ' + msg.x + ":" + msg.y);
		page.mouse.click(msg.x, msg.y);
	  });
	  socket.on('keyup', (msg) => {
		console.log('up: ' + msg);
		page.keyboard.up(msg);
	  });
	  socket.on('keydown', (msg) => {
		console.log('down: ' + msg);
		page.keyboard.down(msg);
	  });
  });

  server.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));


async function run () {
    const browser = await puppeteer.launch({
		width: 640,
		height: 480,
		headless: true,
	});
    page = await browser.newPage();
	await page.setViewport({
		width: 1080,
		height: 720,
		deviceScaleFactor: 0.5,
	  });
    await page.goto(url);
	

	setInterval(async () => {
		const contents = await page.screenshot({
			type: "jpeg",
			encoding: "base64",
			quality: 20
		});
		io.emit("image", contents);
	}, 100);
}
run();

