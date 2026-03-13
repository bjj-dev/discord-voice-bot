const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// Render 유지용 웹 서버
app.get("/", (req, res) => res.send("Bot is alive!"));
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

// 1. 설정 정보 (반드시 본인의 ID 숫자로 바꾸세요)
const TOKEN = process.env.BOT_TOKEN;
const TEXT_CHANNEL_ID = "1313443293153067018"; // 여기에 복사한 채널 ID를 꼭 넣어주세요.

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent // 인텐트 설정 확인 필수
    ]
});

client.once("ready", () => {
    console.log(`✅ 접속 완료: ${client.user.tag}`);
});

client.on("voiceStateUpdate", async (oldState, newState) => {
    // 사용자가 음성 채널에 입장했을 때만 (이전 채널 없음 -> 현재 채널 있음)
    if (!oldState.channelId && newState.channelId) {
        const user = newState.member.displayName;
        const channelName = newState.channel.name;

        const message = `📢 **${user}**님이 [${channelName}] 음성 채널에 입장했습니다!`;

        try {
            const channel = await client.channels.fetch(TEXT_CHANNEL_ID);
            if (channel) {
                await channel.send(message);
                console.log(`[알림 전송성공] ${message}`);
            }
        } catch (err) {
            console.error("❌ 메시지 전송 실패:", err);
        }
    }
});

client.login(TOKEN);
