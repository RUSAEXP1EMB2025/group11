//インスタンス化時に，menuDefinition,imageFileIDを設定すること.
class RichMenu {
 constructor() {
    this.channelToken = getChannelAccessToken();

    // リッチメニュー定義
    this.menuDefinition;

    //リッチメニューを作成
    this.createResponse = UrlFetchApp.fetch("https://api.line.me/v2/bot/richmenu", {
      method: "post",
      contentType: "application/json",
      headers: { Authorization: "Bearer " + channelToken },
      payload: JSON.stringify(menuDefinition)
      });

    this.richMenuId = JSON.parse(createResponse.getContentText()).richMenuId;

    //リッチメニュー画像
    this.imageFileID; // Driveにアップ済みの画像ファイルID

    this.uproaded = false; // 画像アップロード済みかどうか      
  }

  //リッチメニュー画像をアップロード
  uproadRichMenuImage() {
    imageBlob = DriveApp.getFileById(imageFileID).getBlob();
  
    UrlFetchApp.fetch(`https://api.line.me/v2/bot/richmenu/${richMenuId}/content`, {
      method: "post",
      contentType: "image/jpeg",
      headers: { Authorization: "Bearer " + channelToken },
      payload: imageBlob.getBytes()
      });
  }

  
  //ユーザーにリッチメニューをリンク
  linkRichMenuToUser(userId) {
    if (!this.uproaded) {
      this.uproadRichMenuImage();
      this.uproaded = true;
    }
    UrlFetchApp.fetch(`https://api.line.me/v2/bot/user/${userId}/richmenu/${richMenuId}`, {
    method: "post",
    headers: { Authorization: "Bearer " + channelToken }
    });

    writeLog(`ユーザー ${userId}${changeIdToRow(userId)} にリッチメニュー ${this.menuDefinition.name} を設定しました`);
  }
}
