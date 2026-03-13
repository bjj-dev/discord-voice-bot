const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");

// 1. 설정 정보 (ID만 정확히 넣어주세요)
const TOKEN = process.env.BOT_TOKEN;
const TEXT_CHANNEL_ID = "1313443293153067018"; // 예: 1313443293153067019

const app = express();
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages
    ]
});

// Render 서버 잠자기 방지를 위한 간단한 웹 페이지
app.get("/", (req, res) => res.send("Bot is Running!"));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is on port ${PORT}`));

client.once("ready", () => {
    console.log(`✅ 접속 완료: ${client.user.tag}`);
});

/* ================================
   음성 채널 입장 감지 로직
================================ */
client.on("voiceStateUpdate", async (oldState, newState) => {
    // 사용자가 음성 채널에 '새로 들어온' 경우만 필터링
    if (!oldState.channelId && newState.channelId) {
        const user = newState.member.displayName; // 사용자 닉네임
        const channelName = newState.channel.name; // 채널 이름

        const message = `📢 **${user}**님이 [${channelName}] 음성 채널에 입장했습니다!`;

        try {
            const channel = await client.channels.fetch(TEXT_CHANNEL_ID);
            if (channel) {
                await channel.send(message);
                console.log(`[알림] ${message}`);
            }
        } catch (err) {
            console.error("❌ 전송 에러:", err);
        }
    }
});

client.login(TOKEN);