
// change only what you are ask to change else bit won't work thanks for your understanding 
const fs = require('fs'), 
      dotenv = fs.existsSync('config.env') ? require('dotenv').config({ path: '/.env' }) : undefined,
      convertToBool = (text, fault = 'true') => text === fault;

//add your session id

global.session = "https://khanxmd-pair.onrender.com"; 
 
 
module.exports = {
SESSION_ID: process.env.SESSION_ID || "IK~H4sIAAAAAAAAA5VVS6/bVBD+K+hsEzV+xHEc6VY4vje5dt7vB3RxbB8/Er/uOcd2nCoSQlAQAhSoRIVEVMQOtgiJDatu2z/BL8hPQM7NbbuA9mLJ8vF4NPPNN/ONH4MgdAlqoQzUHoMIuwmkKD/SLEKgBuqxZSEMisCEFIIaMNTIQo3GVBQT1oq0xJ90t5q+MqXEXU6vLTkO2/JlMx2QSfkC7IoginXPNd4RsB+2eqqzKvA9WVJYzlxPK9jpIc5FUSkkDdiaOKHZq/sFrnoBdnlE6GI3sK8iB/kIQ6+Fsj508f3gh62lpm9gVnAkshHaLPVaxjD0KpfbWDRXE2MTlM0lW3HsKXM/+HplNnCVITvdCFVzRUkaZ9365VAUt8K2ww3UvriclKwK1bMzfOLaATJVEwXUpdm9eZ91+Z5V8JqzAhkGmpD006ogTLKmU5mM+Jlh07okzbNEHTHy/YCn1c5ozQh2ZYAnPWWxDAKiMJdZYdTYRDdr2FO2kphN+6rmqW8D7+O7WVn/H96RipawLE0pI1qLReJqjqg169P5ss2xQxjDOcHDzg0cX16l94Nf9zYzt9Fvj4e4PavYus9O24PqVUdUUq1XmGKmK9qexaV4ZbyBD2mM34VykVhRQ1srus2neiexXG20XsvdhelvB0o7jXsq2pbb5mrptls3YVkX2MFCbQuFhQN7o3H3xoABLGhdzr5iSlY6xx43DRz74lTRGmWqCWrsrggwsl1CMaRuGJxs5UoRQDMZIQMjeqIXGFKBh5llrBKLg1pfCDOxva0vDB/1ltLUN4frjdGcdr1L/+oCFEGEQwMRgsxrl9AQZx1ECLQRAbWPHhVBgDb0tnF5Op4tAsvFhE6COPJCaN519e4jNIwwDugoCwwlPyAMaswbM6LUDWyS8xgHEBuOmyDFgZSAmgU9gl5XiDAyQY3iGL1WrRKaOfHimB/JktQCReCfGuKaoAYkjmeZcrXKSRxb46ofkgdpHhZG0YMAUVAEAcy9wfHpk1//fv7Hy79e/vzqlw+Oh/3nx8P+6fGwf3I87L/ODV8dD/svj4f9N7nx4fHpk9/+/vPHj4MXz1799OJZ/nzffev3/kRfHA/7T46H/afnpN/nxm+Ph/0P5+yfHQ/77x4eD89/P6MAReCdqi1XOIkVJYERWY6t5PXm9t1rnnNaTESh6xFQA0pHXDHyYECqlWQzWCzkkSy3ZDnv/V1f7gb8doAwU1/o1Vm9XvJKgTUi2vDazgLToZf2jY/tqMSSQE9boj42/i0IqIGV2EyqVqFtTGcNVWxXCev6VzZZbyaqKaYjAW3KnXqInXUraqhX6nq+bK/4EjSs0PeavXkcdodLW5xHlrEM0WZs8P5QU3I1FIGJEtdAbydrSikZbK25M1ny2VYbJvF2sN5UK54ua3O7ozZ7TFe5iVrCetNWnG3Y5JPxWE71QlqKtqXrZZgiUTQ31xKvLeXAVDBNh458K72T9L3zynVPosgnLn+1XHTaYOfJeu8E3gLPhcLsim/FOO/E/1pWUJJnzVLDHliCJfAMVibDcifiF/qg3Ipuyi1L0jWuqsQcw4Pd7lERRB6kVoh9UAPE1yEoAhzGuezUwArfkUmRJ6p83jgeJFR+I+Wx6yNCoR+BGisKFUaq8Cxz69XHYXQNiZP/jmdroZ7LMpOjaEQhvVsMQD5dfgHs/gEkP//jNAgAAA==", // Add sess Id here espwcially when deploying on panels else use app.json and .env file...
SUDO_NUMBERS: process.env.SUDO_NUMBERS || "", //Add multiple Numbers with Country Codes without (+) Separated by Comma...
ANTI_DELETE: process.env.ANTI_DELETE || "true", // can be set to inboxonly/allchats/true/false
AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "true",
AUTO_LIKE_STATUS: process.env.AUTO_LIKE_STATUS || "true",
AUTO_LIKE_EMOJIS: process.env.AUTO_LIKE_EMOJIS || "💛,❤️,💜,🤍,💙", //Input Yours Custom...Can be one Emoji or Multiple Emojis Separated by Commas
AUTO_REPLY_STATUS: process.env.AUTO_REPLY_STATUS || "false",
STATUS_REPLY_MSG: process.env.STATUS_REPLY_MSG || "✅️ Status Viewed By JAWAD MD", // // Input Yours custom...
MODE: process.env.MODE || "public", // Put private or public or inbox or groups
OWNER_NUMBER: process.env.OWNER_NUMBER || "923427582273", // Only 1 owner Number Here, others Add to sudo numbers...
OWNER_NAME: process.env.OWNER_NAME || "JawadTech", // Input Yours custom...(Maintain font for Flow)
PACK_AUTHOR: process.env.PACK_AUTHOR || "🩵", // Added // Input Yours custom...
PACK_NAME: process.env.PACK_NAME || "💙", // Added // Input Yours custom...
PREFIX: process.env.PREFIX || ".",
VERSION: process.env.VERSION || "3.0.0",
ANTILINK: process.env.ANTILINK || "true", //  Enter true to kick automatically or delete to delete without kicking or warn to warn before kicking
ANTICALL: process.env.ANTICALL || "false",
ANTIBAD: process.env.ANTIBAD || "false",
BAD_WORDS: process.env.BAD_WORDS || "null, pm, dm, idiot", // Add Yours Separated by Comma(will be deleted if ANTIBAD is set to true)
ANTICALL_MSG: process.env.ANTICALL_MSG || "*_📞 Auto Call Reject Mode Active. 📵 No Calls Allowed!_*",
AUTO_REACT: process.env.AUTO_REACT || "false",
BOT_NAME: process.env.BOT_NAME || "JAWAD-MD", //  don't change 
BOT_PIC: process.env.BOT_PIC || "https://files.catbox.moe/pf270b.jpg", //  don't change 
AUTO_AUDIO: process.env.AUTO_AUDIO || "false",
AUTO_BIO: process.env.AUTO_BIO || "false",
AUTO_BIO_QUOTE: process.env.AUTO_BIO_QUOTE || "i am jawad md",
CHAT_BOT: process.env.CHAT_BOT || "false", // Put value to true to enablle for all chats only or inbox to ebanle in pm chats only or groups to enable in groups only else false
WELCOME: process.env.WELCOME || "false",
//not working for the moment do don't on it
GOODBYE: process.env.GOODBYE || "false", //not working for the moment do don't on it
AUTO_READ_MESSAGES: process.env.AUTO_READ_MESSAGES || "false", // Enter value to true for blueticking all messages, or commands for blueticking only commands else false
AUTO_BLOCK: process.env.AUTO_BLOCK || "333,799", // Add Multiple Country Codes Separated by Comma...
PRESENCE: process.env.PRESENCE || "online", // Choose one: typing, recording, online, null
TIME_ZONE: process.env.TIME_ZONE || "Asia/Karachi", // Enter yours else leave blank if not sure
};

let file = require.resolve(__filename); 
fs.watchFile(file, () => { fs.unwatchFile(file); console.log(`Update '${__filename}'`); delete require.cache[file]; require(file); });
//KHAN MD; 🔥💸💀
