function handleMessageEvent(event) {
    const replyToken = event.replyToken;
    const userId = event.source.userId;
    const text = event.message.text;
    const pssp = PropertiesService.getScriptProperties();
    const state = pssp.getProperty(userId);
    let sheet;

    switch (state) {
        case 'idle':
            break;
        case 'isWaitingSheetId':
            writeLog('hundleMessageEvent: ' + userId + text);
            const match = text.match(/ID:\s*([^\s]+)/); // 正規表現で取り出す
            const sheetId = match[1];

            try {
                spreadsheet = SpreadsheetApp.openById(sheetId);
            } catch (e) {
                writeLog("スプレッドシートの取得に失敗しました: userId:"+ userId + "sheetId:" + sheetId + "message:" + e.message);
                replyText(replyToken, "スプレッドシートの取得に失敗しました。IDを確認してください。");
                break;
            }

            sheet = spreadsheet.getSheetByName('sensor');
            if (!sheet) {
                writeLog("シートId: " +sheetId + "の" + sheetName  +" の取得に失敗しました。");
                replyText(replyToken, "指定されたシートが見つかりません。シート名を確認してください。");
                break;
            }

            pssp.setProperty(userId, 'idle');
            writeLog('スプレッドシートのIDを取得しました: userId:'+ userId + "sheetId" + sheetId);
            replyText(replyToken, "スプレッドシートのIDを設定しました。");
            writeToSingleCell(sheetId, userId, 'SHEETID');

            //リッチメニューセット
            const lightRichMenu = new richMenu;
            lightRichMenu.richMenuId = getLightRichMenuId();

            writeLog('richMenu.richMenuId: ' + lightRichMenu.richMenuId);

            lightRichMenu.linkRichMenuToUser(userId);
            break;
        default:
            writeLog('未定義の状態: ' + userId + text);
            break;            
    }
}