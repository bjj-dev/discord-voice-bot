const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("Bot is alive!"));
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

const TOKEN = process.env.BOT_TOKEN;
const TEXT_CHANNEL_ID = "1313443293153067018";

// 1. 특정 친구 전용 멘트
const customMentions = {
    "349680428723994624": "주인님 어서오세요! 오늘 컨디션 어떠신가요? 🫡",
    "친구_ID_입력": "오... 전설의 고수 등장! 오늘 버스 태워주나요? 🚌"
};

// 2. 일반 랜덤 멘트 (입장 정보 뒤에 붙을 문구들)
const randomMessages = [
    "오늘따라 못생겨 보이네요! ✨",
    "와! 드디어 오셨군요. 기다리다 지칠 뻔했습니다. 😌",
    "오늘 게임 승률 10.0% 예상해 봅니다! 🎮",
    "입장하자마자 광채가... 머리 빠지시나요? 😎",
    "누구보다 빠르게 남들과는 다르게 입장! 🏃‍♂️💨",
    "오늘의 주인공은 바로 당신! 🎊",
    "치킨 먹기 딱 좋은 날씨에 오셨네요! 🍗",
    "오늘 피지컬 장난 아닐 것 같은 느낌적인 느낌? 🔥",
    "와... 이 형 또 왔네. 오늘 점수 기부하러 오셨나요? 📉",
    "방금 입에서 구린내 났는데, 마이크 끄고 말하세요. 😷",
    "이분 오니까 갑자기 채널 평균 티어가 확 떨어지네... 📉",
    "오늘도 버스 탈 생각에 싱글벙글하면서 들어오셨죠? 🚌",
    "아, 이 형 오면 게임 지는데... 다들 도망쳐! 🏃‍♂️💨",
    "님 오기 전까지 분위기 좋았는데 왜 오심? 넝담~ 😉",
    "오늘도 그 화려한 '똥싸개' 컨트롤 보여주시는 건가요? 💩",
    "님 목소리 들으니까 갑자기 피곤해지네요. 🥱",
    "실력은 없지만 열정만 가득한 그분, 입장하셨습니다! 👏",
    "오늘도 팀원들 멘탈 가루로 만들 준비 되셨나요? 🌪️"
];

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once("ready", () => {
    console.log(`✅ 접속 완료: ${client.user.tag}`);
});

client.on("voiceStateUpdate", async (oldState, newState) => {
    if (!oldState.channelId && newState.channelId) {
        const userId = newState.member.id;
        const userDisplayName = newState.member.displayName;
        const channelName = newState.channel.name;

        let extraMessage = "";

        // 멘트 선정 (지정 멘트 우선, 없으면 랜덤)
        if (customMentions[userId]) {
            extraMessage = customMentions[userId];
        } else {
            const randomIndex = Math.floor(Math.random() * randomMessages.length);
            extraMessage = randomMessages[randomIndex];
        }

        // 최종 메시지 형식: "누구님이 어디에 입장했습니다! (멘트)"
        const finalMessage = `📢 **${userDisplayName}**님이 [${channelName}] 채널에 입장했습니다! \n> ${extraMessage}`;

        try {
            const channel = await client.channels.fetch(TEXT_CHANNEL_ID);
            if (channel) {
                await channel.send(finalMessage);
            }
        } catch (err) {
            console.error("❌ 전송 실패:", err);
        }
    }
});

client.login(TOKEN);
