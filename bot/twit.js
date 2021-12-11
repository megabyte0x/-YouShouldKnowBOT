const twit = require("twit");

const T = new twit({
    // consumer_key: process.env.TWITTER_API_KEY,
    // consumer_secret: process.env.TWITTER_API_SECRET,
    // access_token: process.env.TWITTER_ACCESS_TOKEN,
    // access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    consumer_key:  'XjbqAymwvpqaWxffOWzhLQvTB',
    consumer_secret : 'kTveSIsdh20KYbgEB9s49POFhQvrgJiiylNsr0R9lVY2d8cKn4',
    access_token : '1469298799122075648-VIh4NAINmO4TRThhxMLVBBjHGIQz0i',
    access_token_secret : 'OCWhKeimlCpPcqClFNzl0c49vU4CbMbmbHVQ6BXb8TSDa'

});

module.exports = T;