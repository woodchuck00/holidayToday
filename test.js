
const rp = require('request-promise');
const cheerio = require('cheerio');
const options = {
  uri: `https://www.google.com`,
  transform: function (body) {
    return cheerio.load(body);
  }
};

rp(options)
  .then(($) => {
    console.log($);
  })
  .catch((err) => {
    console.log(err);
  });
