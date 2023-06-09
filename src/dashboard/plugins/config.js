require("dotenv").config();
const { resolve } = require("path");
const yaml = require('js-yaml');
const fs   = require('fs');

let doc

try {
  const yaml_files = yaml.load(fs.readFileSync('./application.yml', 'utf8'));
  doc = yaml_files
} catch (e) {
  console.log(e);
}


module.exports = {
  PORT: doc.dash.PORT || process.env.PORT,
  TOKEN: doc.bot.TOKEN || process.env.TOKEN,
  REDIRECT: doc.dash.REDIRECT,
  MONGO_URI: doc.bot.MONGO_URI,
  SIGNATURE: doc.dash.SIGNATURE,
  DISCORD_CLIENT_ID: doc.dash.DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET: doc.dash.DISCORD_CLIENT_SECRET || process.env.DISCORD_CLIENT_SECRET,
  DISCORD_REDIRECT_URL: doc.dash.DISCORD_REDIRECT_URL,
  DISCORD_API_URL: doc.dash.DISCORD_API_URL,
}