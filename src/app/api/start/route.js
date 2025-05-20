import axios from "axios";

// ユーザーごとにトークンを設定
const users = {
  1: {
    name: "こーしん",
    zoomUrl:
      "https://us04web.zoom.us/j/7804620619?pwd=52OZdijaJbqa4SVg9Ebu3IoaaKbAk1.1",
    token: "tok_koushin_123", // ★好きなランダム英数字でOK
  },
  2: {
    name: "えいちゃん",
    zoomUrl:
      "https://us05web.zoom.us/j/6604570017?pwd=Dfh0a2HUCzCdMKEkXQqio9BYbauRGi.1",
    token: "tok_eichan_456",
  },
  3: {
    name: "こーせい",
    zoomUrl: "https://zoom.us/j/ZOOM_ID_C",
    token: "tok_kousei_789",
  },
};

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const user = searchParams.get("user");
  const token = searchParams.get("token");

  // トークン認証チェック
  if (!user || !token || !users[user] || users[user].token !== token) {
    return new Response("このページにはアクセスできません。", { status: 403 });
  }

  // LINE通知
  try {
    await axios.post(
      "https://api.line.me/v2/bot/message/push",
      {
        to: process.env.LINE_GROUP_ID,
        messages: [
          {
            type: "text",
            text: `【${users[user].name}】がZoomを立ち上げました！\n${users[user].zoomUrl}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.LINE_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (e) {
    // 通知だけ失敗でもZoomには飛ばす
  }

  // Zoomリダイレクト
  return Response.redirect(users[user].zoomUrl, 302);
}
