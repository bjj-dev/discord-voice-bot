const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("Bot is alive!"));
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

const TOKEN = process.env.BOT_TOKEN;
const TEXT_CHANNEL_ID = "1313443293153067018";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});
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
// 1. 디바운싱(중복 방지)을 위한 팁: 봇이 재시작될 때 로그가 중복되는지 확인용
client.once("ready", () => {
    console.log("------------------------------------------");
    console.log(`🚀 디스코드 봇 로그인이 완료되었습니다!`);
    console.log(`🤖 봇 태그: ${client.user.tag}`);
    console.log(`📡 현재 연결 상태: ${client.ws.status === 0 ? "정상(READY)" : client.ws.status}`);
    console.log("------------------------------------------");
});

// 2. 디스코드와 연결이 끊겼을 때의 로그
client.on("shardDisconnect", (event) => {
    console.warn("⚠️ 디스코드 연결이 끊겼습니다:", event);
});

// 3. 에러 발생 시 로그 (토큰 문제 등)
client.on("error", (error) => {
    console.error("❌ 클라이언트 에러 발생:", error);
});


client.on("voiceStateUpdate", async (oldState, newState) => {
    console.log(`[이벤트] ${newState.member.displayName}: ${oldState.channelId || '없음'} -> ${newState.channelId || '없음'}`);
    if (!oldState.channelId && newState.channelId) {
        console.log(`➡️ 입장 감지됨: ${newState.member.displayName}`);
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
                console.log("✅ 메시지 전송 완료");
            }
        } catch (err) {
            console.error("❌ 전송 실패:", err);
        }
    }
});
console.log("⏳ 디스코드 로그인 시도 중...");
client.login(TOKEN).catch(err => {
    console.error("❌ 로그인 실패! 토큰이 잘못되었거나 인텐트 설정 문제입니다.");
    console.error(err);
});
