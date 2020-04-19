const axios = require('axios');

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
const fApp = admin.initializeApp();
const fStore = admin.firestore();

const config = functions.config().config
const apiKey = process.env.API_KEY || config.api_key || fApp.options_.apiKey
const firebaseDynamicLinkApi = `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${apiKey}`;
const URL_COLLECTION = config.url_collection || 'urls';

exports.addUrl = functions.https.onRequest(async (req, res) => {
  const link = req.query.url || req.body.url || null;
  const prefix = req.query.prefix || req.body.prefix || '0';

  if (!link) {
    return res.status(400).send('URL is not defined!');
  }

  try {
    const doc = await fStore.collection('settings').doc(prefix).get();
    const cfg = doc.data();

    let domainUriPrefix = 'https://hsdturl.page.link';
    if (cfg) {
      domainUriPrefix = cfg.value;
    }

    console.log(`Getting shorten URL for: ${link}, prefix=${domainUriPrefix}, api: ${firebaseDynamicLinkApi}`);
    const result = await axios.post(firebaseDynamicLinkApi, {
      dynamicLinkInfo: {
        domainUriPrefix,
        link,
      },
      suffix: {
        option: 'SHORT'
      }
    })

    try {
      const {shortLink} = result.data;
      const shortenKey = shortLink.split('/').slice(-1).pop();
      const customLink = req.query.custom || req.body.custom || shortenKey;
      const data = Object.assign({
        shortLink,
        customLink,
        shortenKey,
        originalUrl: link,
        // clientInfor: req.headers,
        createdAt: new Date()
      }, result.data)
      // await urlRef.child(customLink).set(data);
      const docRef = await fStore.collection(URL_COLLECTION).doc(customLink).set(data);
      console.log("Document written with ID: ", docRef.id);
      res.json(data);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
    res.json(result.data)
  } catch (err) {
    console.error(err.message)
    res.status(500).json('error: ' + err.message);
  }
});

// Initialize express app
const express = require('express');
const hbs = require('express-handlebars');
const app = express();

app.engine('hbs', hbs({ defaultLayout: 'main', extname: 'hbs' }));
app.set('view engine', 'hbs');

app.get('/:url?', async (req, res) => {
  const url = req.params.url;
  if (!url) {
    return res.render('home', {
      user: req.user,
    });
  } else {
    // get real dynamic link
    // const info = await urlRef.child(url).once('value');
    const doc = await fStore.collection(URL_COLLECTION).doc(url).get();
    const info = doc.data();
    if (!info) {
      return res.status(404).send('Not found: ' + url);
    }
    const { shortLink } = info;
    return res.redirect(shortLink);
  }
});

// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
exports.app = functions.https.onRequest(app);
