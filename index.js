const { IncomingWebhook, WebClient } = require('@slack/client');
var config = require('./config.json');

const web = new WebClient(config.slack.token);
const timeNotification = new IncomingWebhook(config.slack.url);
const currentTime = new Date().toTimeString();

const days = []
let text = ''

const cheerio = require('cheerio')
var request = require('request');


request('https://www.checkiday.com/', function (error, response, body) {
  if (error) return console.error(error);

    $ = cheerio.load(body);
    $('div.mdl-card__title > h2 > a').each( (index,value) => {
      let day = $(value).text()
      days.push(day)
    })

    for(i in days) {
      if(days[i] == 'Daily Updates')
        break
      if(days[i] == 'On This Day in History')
        break
      
      text += `Today is ${days[i]} \n`
    }
    timeNotification.send(text, (error, resp) => {
      if (error) {
        return console.error(error);
      }
      console.log('Notification sent');
      console.log('Waiting a few seconds for search indexes to update...');
      setTimeout(() => {
        console.log('Calling search.messages');
        web.search.messages({ query: currentTime })
        .then(resp => {
          if (resp.messages.total > 0) {
            console.log('First match:', resp.messages.matches[0]);
          } else {
            console.log('No matches found');
          }
        })
        .catch(console.error)
      }, 12000);
    })
  })