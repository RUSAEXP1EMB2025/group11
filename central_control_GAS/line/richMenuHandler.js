// インスタンス化時に richMenuId を設定すること
class richMenu {
  constructor() {
    this.channelAccessToken = getChannelAccessToken();
    this.richMenuId = null;
  }

  linkRichMenuToUser(userId) {
    const url = `https://api.line.me/v2/bot/user/${userId}/richmenu/${this.richMenuId}`;

    const options = {
      method: 'post',
      headers: {
        'Authorization': 'Bearer ' + this.channelAccessToken
      },
    };

    //muteHttpExceptions: true

    const response = UrlFetchApp.fetch(url, options);
    writeLog('linkRichMenu:' + response.getContentText()); // 応答をログに出力
  }
}