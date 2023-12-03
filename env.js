/* eslint-disable @typescript-eslint/no-var-requires */
const env = require('dotenv').config({ path: '.env' }).parsed;
const envLocal = require('dotenv').config({ path: '.env.local' }).parsed;
const envProd = require('dotenv').config({ path: '.env.prod' }).parsed;

function loadDev() {
  return {
    ...env,
    ...envLocal,
  };
}

function loadProd() {
  return {
    ...env,
    ...envProd,
  };
}

module.exports = ctx => (ctx.dev ? loadDev() : loadProd());
