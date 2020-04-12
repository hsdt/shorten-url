# shorten-url

HSDT Shorten URL

# Service Dependencies

* Firebase Functions
* Firebase Hosting
* [Firebase Dynamic Links](https://firebase.google.com/docs/dynamic-links)

# Development Guide

1. Set up Node.js and the Firebase CLI

```bash
npm install -g firebase-tools
```

2. Initialize Firebase SDK for Cloud Functions

```bash
# config firebase functions
firebase functions:config:set config.api_key=YOUR_WEB_API_KEY
firebase functions:config:set config.domain_uri_prefix=YOUR_DOMAIN_URI_PREFIX

# cd functions
firebase functions:config:get > .runtimeconfig.json
```

3. Start local development

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

# Contributing

Pull requests and stars are highly welcome.

For bugs and feature requests, please [create an issue](https://github.com/hsdt/shorten-url/issues/new).

# LICENSE

The project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details

