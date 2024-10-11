module.exports = {
  config: {
    name: "antiout",
    version: "1.0",
    author: "Xemon—",
    countDown: 5,
    role: 0,
    shortDescription: "Enable or disable antiout",
    longDescription: "",
    category: "boxchat",
    guide: "{pn} {{[on | off]}}",
    envConfig: {
      deltaNext: 5
    }
  },
  onStart: async function({ message, event, threadsData, args }) {
    let antiout = await threadsData.get(event.threadID, "settings.antiout");
    if (antiout === undefined) {
      await threadsData.set(event.threadID, true, "settings.antiout");
      antiout = true;
    }
    if (!["on", "off"].includes(args[0])) {
      return message.reply("Please use 'on' or 'off' as an argument");
    }
    await threadsData.set(event.threadID, args[0] === "on", "settings.antiout");
    return message.reply(`💬𝗮𝗻𝘁𝗶𝗼𝘂𝘁  ${args[0] === "on" ? " 𝒂𝒄𝒕𝒊𝒗𝒊𝒕𝒆́ 𝒑𝒆𝒓𝒔𝒐𝒏𝒏𝒆𝒔 𝒏𝒆 𝒔'𝒆́𝒄𝒉𝒂𝒑𝒑𝒆 𝒅𝒆 𝒎𝒂 𝒅𝒆𝒎𝒆𝒖𝒓𝒆...🏌️🥀" : "𝒅𝒆́𝒔𝒂𝒄𝒕𝒊𝒗𝒆𝒓 𝒗𝒐𝒖𝒔 𝒂𝒗𝒆𝒛 𝒆𝒖𝒕 𝒅𝒆 𝒍𝒂 𝒄𝒉𝒂𝒏𝒄𝒆 𝒂𝒍𝒍𝒆𝒛-𝒚 𝒔𝒐𝒓𝒕𝒆́...🌬️🥀"}.`);
  },
  onEvent: async function({ api, event, threadsData }) {
    const antiout = await threadsData.get(event.threadID, "settings.antiout");
    if (antiout && event.logMessageData && event.logMessageData.leftParticipantFbId) {
      // A user has left the chat, get their user ID
      const userId = event.logMessageData.leftParticipantFbId;

      // Check if the user is still in the chat
      const threadInfo = await api.getThreadInfo(event.threadID);
      const userIndex = threadInfo.participantIDs.indexOf(userId);
      if (userIndex === -1) {
        // The user is not in the chat, add them back
        const addUser = await api.addUserToGroup(userId, event.threadID);
        if (addUser) {
          console.log(`User ${userId} was added back to the chat.`);
        } else {
          console.log(`Failed to add user ${userId} back to the chat.`);
        }
      }
    }
  }
};
