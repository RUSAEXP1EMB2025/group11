function replyText(replyToken, text) {
  const url = 'https://api.line.me/v2/bot/message/reply';
  const channelToken = getChannelAccessToken();

  const payload = {
    replyToken: replyToken,
    messages: [{
      type: 'text',
      text: text
    }]
  };

  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + channelToken
    },
    payload: JSON.stringify(payload)
  };

  //UrlFetchApp.fetch(url, options);

  writeLog('返信メッセージ(非送信モード): ' + text);
}
