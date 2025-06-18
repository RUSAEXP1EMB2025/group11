function handleFollowEvent(event){
  const replyToken = event.replyToken;
  const userId = event.source.userId;
  const pssp = PropertiesService.getScriptProperties();

  writeLog('hundleFollowEvent: ' + replyToken + userId);
    
  // ユーザーID
  initialize(userId);

  pssp.setProperty(userId, 'idle');

  // 返信メッセージ
  const text = '友達追加ありがとうございます！\n\n' +
               'このボットは，あなたの照明・冷房制御システムのリモコンです。\n' +
               'まずは、あなたのGoogleスプレッドシートのIDを教えてください。\n' +
               'IDを入力いただけないと、システムをご利用いただけません。'
               //入力は、ID単体で送信してください。「」や’’で囲まないでください。
  replyText(replyToken, text);

  // 初期リッチメニューの設定
  const iniRichMenu = new richMenu;
  iniRichMenu.richMenuId = getIniRichMenuId();

  writeLog('iniRichMenu.richMenuId: ' + iniRichMenu.richMenuId);

  iniRichMenu.linkRichMenuToUser(userId);
}
