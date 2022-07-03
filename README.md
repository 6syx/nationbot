# nationbot

A (much simpler) bot to suit your ro-nation's needs. Takes little time to set up.

**THIS DOES REQUIRE NODE.JS IF YOU ARE RUNNING IT ON YOUR MAIN COMPUTER! https://nodejs.org/en/**

The main file that will be used in this guide will be the `config.json`. I am not responsible for any ratelimiting issues within this bot, and these may be fixed by changing the delay field in the immigration settings.

The `.env` file will contain your secrets, such as your Discord token and your Roblox cookie.

If you need any further assistance, contact [leo.#9999](https://discord.com/users/309803507249315852) ([309803507249315852](https://discord.com/users/309803507249315852)) on discord or open an issue.

(im terrible at doc writing ok please help)

## Setup

Most of the setup options are spoken about in the config itself, but the rest are self-explanatory.

## Accounts

DO NOT USE YOUR MAIN ROBLOX ACCOUNT FOR SUCH A MATTER. Others who use the bot will action through your account. Instead, make an alt and rank it in your group.

Open this account in a new Google Chrome profile. Logging out invalidates the COOKIE. To get the cookie, you need to inspect your Roblox page and head to the Application tab. You will find a .ROBLOSECURITY. Copy the whole thing.

![ctrl+shift+i menu](https://i.imgur.com/wtawQ5N.png)

To obtain a discord bot token, head to the [Discord Developer Portal](https://discord.dev) and create a new application. Under the bot tab, you will be able to create a bot application. Client ID should be there and you can regenerate the token. Enable the Server Member intent too please 😁

## Getting roleset IDs

Install the extension [BTRoblox](https://chrome.google.com/webstore/detail/btroblox-making-roblox-be/hbkpclpemjeibhioopcebchdmohaieln). If you right-click a rank, you will be able to copy its ID, as show below.
![Get roleset ID](https://camo.githubusercontent.com/9406894fac1841d79f2e7a3ab797595cf7f3e1f154f2dc4d2fe7b017039b2f5c/68747470733a2f2f692e696d6775722e636f6d2f5a6e486e4b79442e706e67)

## Hosting

You are able to host this bot on your own computer, however it is not recommended as you would have to leave your computer open all the time. I suggest a form of cloud hosting, and a free and easy way is none other than repl.it.

[![Run on Replit](https://raw.githubusercontent.com/BinBashBanana/deploy-buttons/master/buttons/remade/replit.svg)](https://replit.com/github/paraanoia/nationbot)

If you click this button, it will create a version of nation bot in repl.
Configure the config as you'd like and then run it. It will open a link in the top right.
In repl, the .env file will be hidden on the left bar as its own tab. You will have to input the COOKIE and TOKEN keys again.

repl wont let you run this because they're too downgraded, workaround soon

![repl .env](https://cdn.upload.systems/uploads/WPbmUgy2.png)

Head to [UptimeRobot](https://uptimerobot.com) and make an account if you don't have one. Put your bot in as an HTTP monitor set to check every 5 minutes.

![thing](https://cdn.upload.systems/uploads/F15LgBz3.png)
