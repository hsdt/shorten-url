const axios = require('axios');

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
const adminApp = admin.initializeApp();

const config = functions.config().config
const apiKey = process.env.API_KEY || config.api_key || adminApp.options_.apiKey
const firebaseDynamicLinkApi = `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${apiKey}`;
const domainUriPrefix = config.domain_uri_prefix || 'https://hsdturl.page.link';

exports.addUrl = functions.https.onRequest(async (req, res) => {
  const link = req.query.url || req.body.url || null;

  try {
    console.log(`Getting shorten URL for: ${link}, api: ${firebaseDynamicLinkApi}`);
    let result = await axios.post(firebaseDynamicLinkApi, {
      dynamicLinkInfo: {
        domainUriPrefix,
        link,
      },
      suffix: {
        option: 'SHORT'
      }
    })

    res.json(result.data)
  } catch (e) {
    console.error(e.message)
    res.status(500).json('error')
  }
});

// Initialize express app
const express = require('express');
const hbs = require('express-handlebars');
const app = express();

app.engine('hbs', hbs({ defaultLayout: 'main', extname: 'hbs' }));
app.set('view engine', 'hbs');

app.get('/:url?', (req, res) => {
  // console.log('Signed-in user:', req.user);
  const url = req.params.url;
  console.log('Request: ' + url);

  return res.render('home', {
    user: req.user,
  });
});

// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
exports.app = functions.https.onRequest(app);
