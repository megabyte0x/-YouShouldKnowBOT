require("dotenv").config();

const twit = require("./twit");

const fs = require("fs");
const path = require("path");
const paramsPath = path.join(__dirname, 'params.json');

function writeParams(data) {
    console.log("We are writing the params file...", data);
    return fs.writeFileSync(paramsPath, JSON.stringify(data));
};
function readParams() {
    console.log("We are reading the parmas file...");
    const data = fs.readFileSync(paramsPath);
    return JSON.parse(data.toString());
};

function getTweets(since_id) {
    return new Promise
        ((resolve, reject) => {
            let params = {
                q: '#YouShouldKnow',
                result_type: 'recent',
                count: 10,
            };
            if (since_id) {
                params.since_id = since_id;
            }
            console.log("We are getting the Tweets...", params);
            twit.get('search/tweets', params, (err, data) => {
                if (err) {
                    return reject(err);
                }
                return resolve(data);
            })
        });
}

function postReTweet(id) {
    return new Promise((resolve, reject) => {

        let params = {
            id,
        };
        twit.post('statuses/retweet/:id', params, (err, data) => {
            if (err) {
                return reject(err);
            }
            return resolve(data);
        })
    })
}

async function main() {
    try {
        const params = readParams();

        const data = await getTweets(params.since_id);
        const tweets = data.statuses;
        console.log("We got the Tweets", tweets.length);
        for await (let tweet of tweets) {
            try {
                await postReTweet(tweet.id_str);
                console.log("Successful retweet " + tweet.id_str + tweet.user);
            } catch (e) { console.log("unsuccessful retweet" + tweet.id_str + tweet) };

            params.since_id = tweet.id_str;
        }
        writeParams(params);
    } catch (e) {
        console.error(e);
    }
}

console.log("Starting the bot..");

setInterval(main, 20 * 1000);