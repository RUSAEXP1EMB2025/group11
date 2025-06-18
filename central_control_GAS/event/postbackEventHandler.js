function handlePostbackEvent(event) {
    const replyToken = event.replyToken;
    const userId = event.source.userId;
    const data = event.postback.data;
    const pssp = PropertiesService.getScriptProperties();

    writeLog('handlePostbackEvent: userId:' +  userId  + "postback.data: "+ data);

    switch (data) {
        case 'setSheetID':
            writeLog('case: setDheetID' + data);
            pssp.setProperty(userId, 'isWaitingSheetId');
            break;
        default:
            writeLog('未定義のpostbackデータ: ' + data);
            break;
    }
}