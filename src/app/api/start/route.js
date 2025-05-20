import axios from "axios";

const users = {
  1: {
    name: "こーしん",
    zoomUrl:
      "https://us04web.zoom.us/j/7804620619?pwd=52OZdijaJbqa4SVg9Ebu3IoaaKbAk1.1",
  },
  2: {
    name: "えいちゃん",
    zoomUrl:
      "https://us05web.zoom.us/j/6604570017?pwd=Dfh0a2HUCzCdMKEkXQqio9BYbauRGi.1",
  },
  3: {
    name: "こーせい",
    zoomUrl: "https://zoom.us/j/ZOOM_ID_C",
  },
};

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const user = searchParams.get("user");
  if (!user || !users[user]) {
    return new Response("ユーザー未指定または無効です", { status: 400 });
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
            text: `【${users[user].name}】がZoomを立ち上げました！`,
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
    // エラーは黙って通す（通知だけ失敗でもZoomには飛ぶ）
  }

  // Zoomリダイレクト
  return Response.redirect(users[user].zoomUrl, 302);
}
