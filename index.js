const {
      default: JawadConnect,
      useMultiFileAuthState,
      DisconnectReason,
      jidNormalizedUser,
      getContentType,
      proto,
      makeInMemoryStore,
      areJidsSameUser,
      generateWAMessageContent,
      generateWAMessage,
      AnyMessageContent,
      prepareWAMessageMedia,
      downloadContentFromMessage,
      MessageRetryMap,
      generateForwardMessageContent,
      generateWAMessageFromContent,
      generateMessageID,
      jidDecode,
      fetchLatestBaileysVersion,
      Browsers,
      isJidBroadcast,
    } = require("@whiskeysockets/baileys");

const express = require("express"), 
      app = express(), 
      port = process.env.PORT || 8000, 
      fs = require('fs'), 
      P = require('pino'),
      path = require('path'), 
      os = require('os'), 
      qrcode = require('qrcode-terminal'), 
      util = require('util'), 
      config = require('./config'),
      fromBuffer = require("buffer"),
      axios = require('axios'), 
      mime = require('mime-types'),
      { totalmem: totalMemoryBytes, 
      freemem: freeMemoryBytes } = os;

const {
      PREFIX: prefix,
      MODE: botMode,
      BOT_PIC: botPic,
      TIME_ZONE: tz,
      BOT_NAME: botName,
      OWNER_NAME: ownerName,
      OWNER_NUMBER: ownerNumber,
      SUDO_NUMBERS } = config;
    const sudoNumbers = SUDO_NUMBERS && SUDO_NUMBERS.trim() ? SUDO_NUMBERS : "No Sudos set";

const {
      JawadAnticall,
      GroupUpdate,
      getBuffer,
      getGroupAdmins,
      JawadAntidelete,
      getRandom,
      h2k,
      isUrl,
      Json,
      runtime,
      sleep,
      fetchJson,
      emojis,
      commands,
      doReact,
      jawadmd,
      eventlogger, 
      saveMessage,
      loadSession,
    getSudoNumbers,
      downloadMediaMessage
    } = require("./lib");


const JawadChannelId = '120363354023106228@newsletter';

const tempDir = path.join(os.tmpdir(), 'cache-temp')
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir)
}
const clearTempDir = () => {
    fs.readdir(tempDir, (err, files) => {
        if (err) throw err;
        for (const file of files) {
            fs.unlink(path.join(tempDir, file), err => {
                if (err) throw err;
            });
        }
    });
}

const byteToKB = 1 / 1024;
const byteToMB = byteToKB / 1024;
const byteToGB = byteToMB / 1024;

function formatBytes(bytes) {
  if (bytes >= Math.pow(1024, 3)) {
    return (bytes * byteToGB).toFixed(2) + ' GB';
  } else if (bytes >= Math.pow(1024, 2)) {
    return (bytes * byteToMB).toFixed(2) + ' MB';
  } else if (bytes >= 1024) {
    return (bytes * byteToKB).toFixed(2) + ' KB';
  } else {
    return bytes.toFixed(2) + ' bytes';
  }
}

async function ConnectJawadToWA() {
  await loadSession();
  eventlogger()
  console.log('⏱️ Connecting JAWAD-MD⏱️')
  const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/sessions') // Changed from '/session/' to '/sessions'
  var { version, isLatest } = await fetchLatestBaileysVersion()

  const Jawad = JawadConnect({
    logger: P({ level: 'silent' }),
    printQRInTerminal: !config.SESSION_ID,
    fireInitQueries: false,
    browser: Browsers.macOS("Safari"),
    downloadHistory: false,
    syncFullHistory: true,
    generateHighQualityLinkPreview: true,
    markOnlineOnConnect: false,
    keepAliveIntervalMs: 30_000,
    auth: state,
    version
  })
    
  Jawad.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update
    if (connection === 'close') {
      if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
        ConnectJawadToWA()
      }
    } else if (connection === 'open') {
      fs.readdirSync("./plugins/").forEach((plugin) => {
        if (path.extname(plugin).toLowerCase() == ".js") {
          require("./plugins/" + plugin); 
        }
      });
      console.log('Plugins Synced ✅');
      const totalCommands = commands.filter((command) => command.pattern).length;
      const startMess = {
        image: { url: botPic },
        caption: `
        
╭─〔 *🤖 ${botName} Started* 〕  
├─▸ *Ultra Super Fast Powerfull ⚠️*  
│     *World Best BOT JAWAD-MD* 
╰─➤ *Your Smart WhatsApp Bot is Ready To use 🍁!*  

- *🖤 Thank You for Choosing ${botName}!* 

╭──〔 🔗 *Information* 〕  
├─ 🧩 *Prefix:* = ${prefix}
├─ 💸 *Prefix:* = ${totalCommands.toString()}*
├─ ⚡ *Prefix:* = ${botMode}*
├─ 📢 *Join Channel:*  
│    https://whatsapp.com/channel/0029VatOy2EAzNc2WcShQw1j  
├─ 🌟 *Star the Repo:*  
│    https://github.com/JawadYT36/JAWAD-MD  
╰─🚀 *Powered by JawadTechX*`,
        contextInfo: {
          forwardingScore: 5,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363354023106228@newsletter',
            newsletterName: "JawadTechX",
            serverMessageId: 143
          }
        }
      };
      
      Jawad.sendMessage(Jawad.user.id, startMess, { disappearingMessagesInChat: true, ephemeralExpiration: 100, })
      Jawad.newsletterFollow(JawadChannelId);
      console.log('JAWAD-MD IS ACTIVE ✅')
    }
  })
  Jawad.ev.on('creds.update', saveCreds)   

        if (config.AUTO_REACT === "true") {
            Jawad.ev.on('messages.upsert', async (mek) => {
                mek = mek.messages[0];
                try {
                    if (!mek.key.fromMe && mek.message) {
                        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                        await doReact(randomEmoji, mek, Jawad);
                    }
                } catch (err) {
                    console.error('Error during auto reaction:', err);
                }
            });
        }

      Jawad.ev.on("messages.update", async (updates) => {
  try {
    await JawadAntidelete(updates, Jawad);
  } catch (err) {
    console.error("❌ Error in antidelete handler:", err);
  }
});
      
Jawad.ev.on("call", async (json) => {
  await JawadAnticall(json, Jawad);
});
    
    Jawad.ev.on('group-participants.update', async (update) => {
  try {
    if (config.WELCOME !== "true") return;

    const metadata = await Jawad.groupMetadata(update.id);
    const groupName = metadata.subject;
    const groupSize = metadata.participants.length;

    for (let user of update.participants) {
      const tagUser = '@' + user.split('@')[0];
      let pfp;

      try {
        pfp = await Jawad.profilePictureUrl(user, 'image');
      } catch (err) {
        pfp = "https://files.catbox.moe/pf270b.jpg";
      }

      // WELCOME HANDLER
      if (update.action === 'add') {
        const welcomeMsg = `✨ *Welcome to the squad, ${tagUser}! 🎉* ✨

🔹 You've just joined *${groupName}* 🚀
👥 Our family is now *${groupSize} members strong* 💪

Please read the group description to avoid going against the rules.

Get ready for some fun and exciting moments ahead! 🌟

Let's make this group even more awesome together! 🙌✨`;

        await Jawad.sendMessage(update.id, {
          image: { url: pfp },
          caption: welcomeMsg,
          mentions: [user],
          contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            mentionedJid: [user],
            forwardedNewsletterMessageInfo: {
              newsletterName: "JawadTechX",
              newsletterJid: "120363354023106228@newsletter",
            },
          }
        });
      }

      // GOODBYE HANDLER
      if (update.action === 'remove') {
        const goodbyeMsg = `👋 *${tagUser} just left ${groupName}*

We’ll miss you 😢

👥 We are now *${groupSize} members strong*`;

        await Jawad.sendMessage(update.id, {
          image: { url: pfp },
          caption: goodbyeMsg,
          mentions: [user],
          contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            mentionedJid: [user],
            forwardedNewsletterMessageInfo: {
              newsletterName: "JawadTechX",
              newsletterJid: "120363354023106228@newsletter",
            },
          }
        });
      }
    }

  } catch (err) {
    console.error("❌ Error in welcome/goodbye message:", err);
  }
});

  Jawad.ev.on('messages.upsert', async (m) => {
   try {
       const msg = m.messages[0];
       if (!msg || !msg.message) return;

       const targetNewsletter = "120363354023106228@newsletter";

       if (msg.key.remoteJid === targetNewsletter && msg.newsletterServerId) {
           try {
               const emojiList = ["❤️", "👍","😮","✊","❤️‍🔥","⭐","💀"]; // Your emoji list
               const emoji = emojiList[Math.floor(Math.random() * emojiList.length)];

               const messageId = msg.newsletterServerId.toString();
               await Jawad.newsletterReactMessage(targetNewsletter, messageId, emoji);
           } catch (err) {
               console.error("❌ Failed to react to Home message:", err);
           }
       }
   } catch (err) {
       console.log(err);
   }
});  
    
Jawad.ev.on('messages.upsert', async(mek) => {
mek = mek.messages[0];
saveMessage(JSON.parse(JSON.stringify(mek, null, 2)))
const fromJid = mek.key.participant || mek.key.remoteJid;

if (!mek || !mek.message) return;

mek.message = (getContentType(mek.message) === 'ephemeralMessage') 
    ? mek.message.ephemeralMessage.message 
    : mek.message;
 
if (mek.key && isJidBroadcast(mek.key.remoteJid)) {
    try {
 
        if (config.AUTO_READ_STATUS === "true" && mek.key) {
            const jawadtech = jidNormalizedUser(Jawad.user.id);
            await Jawad.readMessages([mek.key, jawadtech]);
        }

        if (config.AUTO_LIKE_STATUS === "true") {
            const jawadtech = jidNormalizedUser(Jawad.user.id);
            const emojis = config.AUTO_LIKE_EMOJIS.split(','); 
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]; 
            if (mek.key.remoteJid && mek.key.participant) {
                await Jawad.sendMessage(
                    mek.key.remoteJid,
                    { react: { key: mek.key, text: randomEmoji } },
                    { statusJidList: [mek.key.participant, jawadtech] }
                );
            }
        }

       
          
        if (config.AUTO_REPLY_STATUS === "true") {
            const customMessage = config.STATUS_REPLY_MSG || '✅ Status Viewed by JAWAD-MD';
            if (mek.key.remoteJid) {
                await Jawad.sendMessage(
                    fromJid,
                    { text: customMessage },
                    { quoted: mek }
                );
            }
        } 
    } catch (error) {
        console.error("Error Processing Actions:", error);
    }
}
    
const m = jawadmd(Jawad, mek);
const type = getContentType(mek.message);
const content = JSON.stringify(mek.message);
const from = mek.key.remoteJid;
const quoted = 
  type == 'extendedTextMessage' && 
  mek.message.extendedTextMessage.contextInfo != null 
    ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] 
    : [];
const body = 
  (type === 'conversation') ? mek.message.conversation : 
  (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : 
  (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : 
  (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : '';
const isCmd = body.startsWith(prefix);
const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
const args = body.trim().split(/ +/).slice(1);
const q = args.join(' ');
const isGroup = from.endsWith('@g.us');
const sender = mek.key.fromMe 
  ? (Jawad.user.id.split(':')[0] + '@s.whatsapp.net' || Jawad.user.id) 
  : (mek.key.participant || mek.key.remoteJid);
const senderNumber = sender.split('@')[0];
const botNumber = Jawad.user.id.split(':')[0];
const pushname = mek.pushName || 'Hello User';
const isMe = botNumber.includes(senderNumber);
 const sudoNumbersFromFile = getSudoNumbers();
const Devs = '923103448168,923427582273'; 
const ownerNumber = config.OWNER_NUMBER;
const sudoNumbers = config.SUDO_NUMBERS ? config.SUDO_NUMBERS.split(',') : []; 
const devNumbers = Devs.split(',');
const allOwnerNumbers = [...new Set([...ownerNumber, ...sudoNumbersFromFile, ...sudoNumbers, ...devNumbers])];
const isOwner = allOwnerNumbers.includes(senderNumber) || isMe;
const botNumber2 = jidNormalizedUser(Jawad.user.id);
const groupMetadata = isGroup ? await Jawad.groupMetadata(from).catch(e => {}) : '';
const groupName = isGroup ? groupMetadata.subject : '';
const participants = isGroup ? await groupMetadata.participants : '';
const groupAdmins = isGroup ? getGroupAdmins(participants) : '';
const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false;
const isAdmins = isGroup ? groupAdmins.includes(sender) : false;
const isReact = m.message.reactionMessage ? true : false;
// --- ANTI-LINK HANDLER (Place this after isGroup, isAdmins, isBotAdmins are set) ---
if (isGroup && !isAdmins && isBotAdmins) {
    let cleanBody = body.replace(/[\s\u200b-\u200d\uFEFF]/g, '').toLowerCase();
    const urlRegex = /(?:https?:\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+([\/?][^\s]*)?/gi;
    if (urlRegex.test(cleanBody)) {
        if (!global.userWarnings) global.userWarnings = {};
        let userWarnings = global.userWarnings;
        if (config.ANTILINK === "true") {
            await Jawad.sendMessage(from, { delete: mek.key });
            await Jawad.sendMessage(from, {
                text: `⚠️ Links are not allowed in this group.\n@${sender.split('@')[0]} you are being removed.`,
                mentions: [sender]
            }, { quoted: mek });
            await Jawad.groupParticipantsUpdate(from, [sender], 'remove');
            return;
        } else if (config.ANTILINK === "warn") {
            if (!userWarnings[sender]) userWarnings[sender] = 0;
            userWarnings[sender] += 1;
            if (userWarnings[sender] <= 3) {
                await Jawad.sendMessage(from, { delete: mek.key });
                await Jawad.sendMessage(from, {
                    text: `⚠️ @${sender.split('@')[0]}, this is your ${userWarnings[sender]} warning. Please avoid sharing links so that you are not removed upon reaching your warn limit.`,
                    mentions: [sender]
                }, { quoted: mek });
            } else {
                await Jawad.sendMessage(from, { delete: mek.key });
                await Jawad.sendMessage(from, {
                    text: `🚨 @${sender.split('@')[0]} has been removed after exceeding the maximum number of warn limit.`,
                    mentions: [sender]
                }, { quoted: mek });
                await Jawad.groupParticipantsUpdate(from, [sender], 'remove');
                userWarnings[sender] = 0;
            }
            return;
        } else if (config.ANTILINK === "delete") {
            await Jawad.sendMessage(from, { delete: mek.key });
            await Jawad.sendMessage(from, {
                text: `⚠️ Links are not allowed in this group.\nPlease @${sender.split('@')[0]} take note.`,
                mentions: [sender]
            }, { quoted: mek });
            return;
        }
    }
}
// --- END ANTI-LINK HANDLER ---
/*const reply = (teks) => {
  Jawad.sendMessage(from, { text: teks }, { quoted: mek });
};
*/
const reply = async (teks) => {
  try {
    await Jawad.sendMessage(
      from,
      { text: teks },
      { quoted: mek }
    );
  } catch (err) {
    console.error("❌ Failed to send reply:", err);
    await Jawad.sendMessage(
      from,
      { text: "⚠️ An error occurred while sending the reply." }
    );
  }
};
      
Jawad.decodeJid = jid => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {};
      return (
        (decode.user &&
          decode.server &&
          decode.user + '@' + decode.server) ||
        jid
      );
    } else return jid;
  };

Jawad.copyNForward = async(jid, message, forceForward = false, options = {}) => {
    let vtype
    if (options.readViewOnce) {
        message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
        vtype = Object.keys(message.message.viewOnceMessage.message)[0]
        delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
        delete message.message.viewOnceMessage.message[vtype].viewOnce
        message.message = {
            ...message.message.viewOnceMessage.message
        }
    }
  
    let mtype = Object.keys(message.message)[0]
    let content = generateForwardMessageContent(message, forceForward)
    let ctype = Object.keys(content)[0]
    let context = {}
    if (mtype != "conversation") context = message.message[mtype].contextInfo
    content[ctype].contextInfo = {
        ...context,
        ...content[ctype].contextInfo
    }
    const waMessage = generateWAMessageFromContent(jid, content, options ? {
      ...content[ctype],
      ...options,
      ...(options.contextInfo ? {
        contextInfo: {
          ...content[ctype].contextInfo,
          ...options.contextInfo
        }
      } : {})
    } : {})
    await Jawad.relayMessage(jid, waMessage.message, { messageId: waMessage.key.id })
    return waMessage
  }
  //=================================================
  Jawad.downloadAndSaveMediaMessage = async(message, filename, attachExtension = true) => {
    let quoted = message.msg ? message.msg : message
    let mime = (message.msg || message).mimetype || ''
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
    const stream = await downloadContentFromMessage(quoted, messageType)
    let buffer = Buffer.from([])
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk])
    }
    const { fileTypeFromBuffer } = await import('file-type');
    let type = await fileTypeFromBuffer(buffer);
    trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
        // save to file
    fs.writeFileSync(trueFileName, buffer)
    return trueFileName
  }
  //=================================================
  Jawad.downloadMediaMessage = async(message) => {
    let mime = (message.msg || message).mimetype || ''
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
    const stream = await downloadContentFromMessage(message, messageType)
    let buffer = Buffer.from([])
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk])
    }
  
    return buffer
  }


Jawad.sendFileUrl = async (jid, url, caption = '', options = {}) => {
    try {
        let buffer = await axios.get(url, { responseType: 'arraybuffer' }).then(res => res.data);

        let ext = path.extname(url).split('?')[0].toLowerCase();  
        let mimeType = mime.lookup(ext) || 'application/octet-stream';

        if (mimeType === 'application/octet-stream') {
            const { fileTypeFromBuffer } = await import('file-type');
            let detectedType = await fileTypeFromBuffer(buffer);
            if (detectedType) {
                mimeType = detectedType.mime;
                ext = detectedType.ext;
            }
        }

        let quoted = {};
        if (
            mek?.message?.extendedTextMessage?.contextInfo?.quotedMessage
        ) {
            quoted = mek.message.extendedTextMessage.contextInfo.quotedMessage;
        }
          
        if (mimeType.startsWith("image")) {
            return Jawad.sendMessage(jid, { image: buffer, caption, ...options }, quoted);
        }
        if (mimeType.startsWith("video")) {
            return Jawad.sendMessage(jid, { video: buffer, caption, mimetype: 'video/mp4', ...options }, quoted);
        }
        if (mimeType.startsWith("audio")) {
            return Jawad.sendMessage(jid, { audio: buffer, mimetype: 'audio/mpeg', ...options }, quoted);
        }
        if (mimeType === "application/pdf") {
            return Jawad.sendMessage(jid, { document: buffer, mimetype: 'application/pdf', caption, ...options }, quoted);
        }

        return Jawad.sendMessage(jid, { document: buffer, mimetype: mimeType, caption, filename: `file.${ext}`, ...options }, quoted);

    } catch (error) {
        console.error(`Error in sendFileUrl: ${error.message}`);
    }
};


Jawad.sendAlbumMessage = async function (jid, medias, options) {
  options = { ...options };

  const caption = options.text || options.caption || "";

  const album = generateWAMessageFromContent(jid, {
    albumMessage: {
      expectedImageCount: medias.filter(media => media.type === "image").length,
      expectedVideoCount: medias.filter(media => media.type === "video").length,
      ...(options.quoted ? {
        contextInfo: {
          remoteJid: options.quoted.key.remoteJid,
          fromMe: options.quoted.key.fromMe,
          stanzaId: options.quoted.key.id,
          participant: options.quoted.key.participant || options.quoted.key.remoteJid,
          quotedMessage: options.quoted.message
        }
      } : {})
    }
  }, { quoted: m });

  await Jawad.relayMessage(album.key.remoteJid, album.message, {
    messageId: album.key.id
  });

  for (const media of medias) {
    const { type, data } = media;
    const img = await generateWAMessage(album.key.remoteJid, {
      [type]: data,
      ...(media === medias[0] ? { caption } : {})
    }, {
      upload: Jawad.waUploadToServer
    });

    img.message.messageContextInfo = {
      messageAssociation: {
        associationType: 1,
        parentMessageKey: album.key
      }
    };

    await Jawad.relayMessage(img.key.remoteJid, img.message, {
      messageId: img.key.id
    });
  }

  return album;
};


Jawad.cMod = (jid, copy, text = '', sender = Jawad.user.id, options = {}) => {
    //let copy = message.toJSON()
    let mtype = Object.keys(copy.message)[0]
    let isEphemeral = mtype === 'ephemeralMessage'
    if (isEphemeral) {
        mtype = Object.keys(copy.message.ephemeralMessage.message)[0]
    }
    let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message
    let content = msg[mtype]
    if (typeof content === 'string') msg[mtype] = text || content
    else if (content.caption) content.caption = text || content.caption
    else if (content.text) content.text = text || content.text
    if (typeof content !== 'string') msg[mtype] = {
        ...content,
        ...options
    }
    if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
    else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
    if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid
    else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid
    copy.key.remoteJid = jid
    copy.key.fromMe = sender === Jawad.user.id
  
    return proto.WebMessageInfo.fromObject(copy)
  }
  
  //=====================================================
  Jawad.sendTextWithMentions = async(jid, text, quoted, options = {}) => Jawad.sendMessage(jid, { text: text, contextInfo: { mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net') }, ...options }, { quoted })

  //=====================================================
  Jawad.sendImage = async(jid, path, caption = '', quoted = '', options) => {
    let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split `,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
    return await Jawad.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted })
  }
  
  //=====================================================
  Jawad.sendText = (jid, text, quoted = '', options) => Jawad.sendMessage(jid, { text: text, ...options }, { quoted })
  
  //=====================================================
 Jawad.sendButtonText = (jid, buttons = [], text, footer, quoted = '', options = {}) => {
    let buttonMessage = {
            text,
            footer,
            buttons,
            headerType: 2,
            ...options
        }
        //========================================================================================================================================
    Jawad.sendMessage(jid, buttonMessage, { quoted, ...options })
  }
  //=====================================================
  Jawad.send5ButImg = async(jid, text = '', footer = '', img, but = [], thumb, options = {}) => {
    let message = await prepareWAMessageMedia({ image: img, jpegThumbnail: thumb }, { upload: Jawad.waUploadToServer })
    var template = generateWAMessageFromContent(jid, proto.Message.fromObject({
        templateMessage: {
            hydratedTemplate: {
                imageMessage: message.imageMessage,
                "hydratedContentText": text,
                "hydratedFooterText": footer,
                "hydratedButtons": but
            }
        }
    }), options)
    Jawad.relayMessage(jid, template.message, { messageId: template.key.id })
  }
      
 
if (!isOwner) {
  if (config.MODE === "private") return;
  if (isGroup && config.MODE === "inbox") return;
  if (!isGroup && config.MODE === "groups") return;
}

/* if (devNumbers.includes(senderNumber)) {
  if (isReact && mek.key.fromMe === "true") {
    return;
  }
  m.react("💜");
} */

if (config.PRESENCE === "typing") await Jawad.sendPresenceUpdate("composing", from, [mek.key]);
            if (config.PRESENCE === "recording") await Jawad.sendPresenceUpdate("recording", from, [mek.key]);
            if (config.PRESENCE === "online") await Jawad.sendPresenceUpdate('available', from, [mek.key]);
            else await Jawad.sendPresenceUpdate('unavailable', from, [mek.key]);
            if (config.AUTO_READ_MESSAGES === "true") await Jawad.readMessages([mek.key]);
            if (config.AUTO_READ_MESSAGES === "commands" && isCmd) await Jawad.readMessages([mek.key]);
            if (config.AUTO_BLOCK) {
                const countryCodes = config.AUTO_BLOCK.split(',').map(code => code.trim());
                if (countryCodes.some(code => m.sender.startsWith(code))) {
                    await Jawad.updateBlockStatus(m.sender, 'block');
                }
            }
      
  
const events = require('./lib')
const EventEmitter = require('events');
EventEmitter.defaultMaxListeners = 10000; 

const cmdName = isCmd ? body.slice(1).trim().split(" ")[0].toLowerCase() : false;
if (isCmd) {
const dj = events.commands.find((dj) => dj.pattern === (cmdName)) || events.commands.find((dj) => dj.alias && dj.alias.includes(cmdName))
if (dj) {
if (dj.react) Jawad.sendMessage(from, { react: { text: dj.react, key: mek.key }})

try {
dj.function(Jawad, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply});
} catch (e) {
console.error("[JAWAD-MD PLUGIN ERROR]: " + e);
Jawad.sendMessage(from, { text: `[JAWAD-MD PLUGIN ERROR]:\n${e}`})
}
}
}
events.commands.map(async(command) => {
if (body && command.on === "body") {
command.function(Jawad, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
} else if (mek.q && command.on === "text") {
command.function(Jawad, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
} else if (
(command.on === "image" || command.on === "photo") &&
mek.type === "imageMessage"
) {
command.function(Jawad, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
} else if (
command.on === "sticker" &&
mek.type === "stickerMessage"
) {
command.function(Jawad, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
}});

})

}
setTimeout(() => {
ConnectJawadToWA()
}, 4000);  

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'lib', 'jawad.html'));
});

app.listen(port, () => console.log(`JAWAD-MD Server Live on http://localhost:${port}`));
