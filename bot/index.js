require("dotenv").config();

const twit = require("./twit");

const fs = require("fs");
const path = require("path");
const paramsPath = path.join(__dirname, 'params.json');

function writeParams(data) {
    // Write the params file and then return it into JSON format.
    console.log("We are writing the params file...", data);
    return fs.writeFileSync(paramsPath, JSON.stringify(data));
};
function readParams() {
    // Reads the params file and then return it into JSON format.
    console.log("We are reading the parmas file...");
    const data = fs.readFileSync(paramsPath);
    return JSON.parse(data.toString());
};

function getTweets(since_id) {
    //  This function will get the top 10 Tweets with the HASTAG #YouShouldKnow
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
    // This function take the Tweet ID as the Url Parameter and will Retweet the Tweet with
    // coressponding Tweet ID.
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

function postLike(id) {
    // This function take the Tweet ID as the Parameter and will Like the Tweet with
    // coressponding Tweet ID.
    return new Promise((resolve, reject) => {

        let params = {
            id,
        };
        twit.post('favorites/create', params, (err, data) => {
            if (err) {
                return reject(err);
            }
            return resolve(data);
        })
    })
}

function createFrienship(user_id) {
    // This function take the Tweet User's ID as the Parameter and will Follow the User.
    return new Promise((resolve, reject) => {

        let params = {
            user_id,
        };
        twit.post('friendships/create', params, (err, data) => {
            if (err) {
                return reject(err);
            }
            return resolve(data);
        })
    })
}

async function main() {
    try {
        const params = readParams(); // Read the last params since_id
        const data = await getTweets(params.since_id); // Gets the Tweets, passes last tweetID
        const tweets = data.statuses; // Store the data of the tweets in a variable.

        console.log("We got the Tweets", tweets.length);
        for await (let tweet of tweets) {
            try {
                console.log(tweet.user['id_str']);
                createFrienship(tweet.user['id_str']);
            } catch (e) {
                console.log("Unsuccessful Friendship");
                console.error(e);
            }

            try {
                await postReTweet(tweet.id_str);
                console.log("Successful retweet");
            } catch (e) {
                console.log("Unsuccessful retweet");
                console.error(e);
            };

            try {
                await postLike(tweet.id_str);
                console.log("Successful Like");
            } catch (e) {
                console.log("Unsuccessful Like");
                console.error(e);
            };

            params.since_id = tweet.id_str;
        }
        writeParams(params);
    } catch (e) {
        console.error(e);
    }
}

console.log("Starting the bot..");

setInterval(main, 20 * 1000); // Will Run the code in every 20s.