require('dotenv').config()
const Discord = require('discord.js');
const stringSimilarity = require("string-similarity");

const DepressoBot = new Discord.Client();

const keywords = ['depressed','suicide','kill myself','killmyself','suicidal','suicidal thoughts','depression','depress'];
const sentence_delimiters = / +/;

/**
 * I am ready message
 */
DepressoBot.once('ready', () => {
    console.log('I am ready!');
});
  
/**
 * Compare 2 strings using dice algorithm
 * If score is above 71%, it return true. Otherwise, false.
 */
function compare_two_strings(string_a, string_b, min_score=0.71) {
    const score = stringSimilarity.compareTwoStrings(string_a, string_b);
    console.log(`compare ${string_a} with keyword ${string_b}: ${score} -> ${true ? score >= min_score : false}`); 
    return (true ? score >= min_score : false);
}

// Event listener for messages
DepressoBot.on('message', message => {
    if (message.author.bot) {console.log('bot cannot send msg to himself.'); return;};

    let split_msg = message.content
        .toLowerCase() // convert string to lowercase for case insensitivity
        .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '') // remove sepcial chars
        .split(sentence_delimiters); // split sentence into words that have whitespace between them
    split_msg = [...new Set(split_msg)]; // remove duplicates
    
    console.log(`split message: ${split_msg}`);
    
    for (const msg of split_msg) {
        for (const kw of keywords) {
            // If the message contains suicidal keywords
            if (compare_two_strings(msg, kw)) {
                const replay_msg = 
                'If you have suicidal thoughts, PLEASE seek help as soon as you can. \
                PLEASE call the suicidal prevention lifelines in your region/country:'; 

                // Send suicidal prevention message
                message.reply(replay_msg);
                return;
            }
        }
    }

});

// this should be last line of the file
DepressoBot.login(process.env.DEPRESSOBOT_TOKEN);