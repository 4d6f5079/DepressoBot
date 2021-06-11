require('dotenv').config()
const Discord = require('discord.js');
const stringSimilarity = require("string-similarity");

const DepressoBot = new Discord.Client();

const keywords = [
    'depressed',
    'depression',
    'suicide',
    'kill myself',
    'killmyself',
    'kilmyself',
    'kil myself',
    'hate myself',
    'hatemyself',
    'hat myself',
    'suicidal',
    'suici',
    'suic',
    'suicidal thoughts',
    'depression',
    'depress',
    'depres',
    'commit suicide',
    'commitsuicide',
    'comitsuicide',
    'commit suic',
];
const sentence_delimiters = / +/;

// TODO: send the phone numbers 
const replay_msg = 
            '\n If you have suicidal thoughts, PLEASE seek help as soon as you can. \
            PLEASE call the suicidal prevention lifelines in your region/country:';

/**
 * I am ready message
 */
DepressoBot.once('ready', () => {
    console.log('DepressoBot is ready!');
});

function compare_keyword_to_multiple_strings(keyword_string, strings_arr, min_score=0.61) {
    const score_object = stringSimilarity.findBestMatch(keyword_string, strings_arr);
    //console.log(`compare keyword ${keyword_string} with strings ${strings_arr}: ${score_object.bestMatch.rating} -> ${true ? (score_object.bestMatch.rating >= min_score) : false}`); 
    return (true ? (score_object.bestMatch.rating >= min_score) : false);
}

// Event listener for messages
DepressoBot.on('message', message => {

    if (message.author.bot) return;

    // preprocessing the message sent by a person
    let split_msg = message.content
        .toLowerCase() // convert string to lowercase for case insensitivity
        .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '') // remove sepcial chars
        .split(sentence_delimiters); // split sentence into words that have whitespace between them
    split_msg = [...new Set(split_msg)]; // remove duplicates
    
    //console.log(`split message: ${split_msg}`);
    
    for (const kw of keywords) {
        // If the words in the message contain suicidal keywords 
        if (compare_keyword_to_multiple_strings(kw, split_msg)) {
            // Send suicidal prevention message and return to prevent unnecessary checking of other keywords
            message.reply(replay_msg);
            return;
        }
    }

});

// this should be last line of the file
DepressoBot.login(process.env.DEPRESSOBOT_TOKEN);