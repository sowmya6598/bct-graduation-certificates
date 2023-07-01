const { twitterClient } = require("./twitterClient.js");

const fs = require('fs');
const path = require('path');

const folderPath = './certifications';

const tweet = () => {

    fs.readdir(folderPath, async (err, files) => {
        if (err) {
          console.error('Unable to read folder:', err);
          return;
        }
      
        let currentSet = [];
        let usernames = [];

        const tweet = await twitterClient.v2.tweet("Text Here");
        let replyToTweetId = tweet.data.id;
      
        for (const file of files) {
          const filePath = path.join(folderPath, file);
      
          usernames.push(file);
          currentSet.push(filePath);
            
          if (currentSet.length === 4) {
            let mediaIds = [];
      
            for (const currentSetFile of currentSet) {
              const id = await twitterClient.v1.uploadMedia(currentSetFile);
              mediaIds.push(id);
            }
            
            const tweet = await twitterClient.v2.tweet({ 
                text: usernames.join('\n'), 
                reply: {
                    in_reply_to_tweet_id: replyToTweetId
                },
                media: {
                    media_ids: mediaIds
                }
            });

            replyToTweetId = tweet.data.id;
      
            mediaIds = [];
            currentSet = [];
            usernames = [];
          }
        }
    });
}

module.exports = tweet;