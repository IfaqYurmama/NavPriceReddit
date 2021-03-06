const CoinMarketCap         = require('coinmarketcap-api'),
      client                = new CoinMarketCap(),
      snoowrap              = require('snoowrap');
const https = require('https');
require('dotenv').config();
const r = new Snoowrap({
	userAgent: 'navpricereddit',
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
	username: process.env.REDDIT_USER,
	password: process.env.REDDIT_PASS
});

/* global variables */
let subreddit = 'navcoin';
let btc;
let usd;

function getDescription() {
  if (!usd || !btc) {
    return;
  }

  r.getSubreddit(subreddit).getSettings().description.then((description) => {
    description = description.replace(/(USD: \$)(.*)/, "$1" + usd + "](#usd)");
    description = description.replace(/(BTC: )(.*)/, "$1" + btc + "](#btc)");

    postDescription(description);
  }).catch(console.error);
}

function postDescription(description) {
    var currentDate = new Date();
    try{
      r.getSubreddit(subreddit).editSettings({description}).then(console.log("Nav subreddit description updated at " + currentDate));
    }
    catch(err){console.error;}
}

/* fetch Nav Coin BTC and USD values */
function getNav() {
  return client.getTicker({limit: 1, currency: 'nav-coin'}).then((res) => {
    btc = res[0].price_btc;
    usd = res[0].price_usd;
    usd = usd.substr(0,5);
  }).catch(console.error);
}

//getNav().then(getDescription);

/* Get softfork progress */
function getFork() {

}

getFork();

/* update prices every 10 minutes */
setInterval(() => { getNav().then(getDescription); }, 1000 * 60 * 15);
