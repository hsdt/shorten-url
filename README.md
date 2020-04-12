# shorten-url

HSDT Shorten URL

# Service Dependencies

* Firebase Functions
* Firebase Hosting
* [Firebase Dynamic Links](https://firebase.google.com/docs/dynamic-links)

# Development Guide

```bash
# install dependencies
cd functions
npm install
npm run serve

# or
firebase serve --only hosting,functions

# deploy
firebase deploy --only hosting,functions
```
