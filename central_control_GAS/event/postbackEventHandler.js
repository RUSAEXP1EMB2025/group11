function handlePostbackEvent(event) {
    const replyToken = event.replyToken;
    const userId = event.source.userId;
    const data = event.postback.data;
    const pssp = PropertiesService.getScriptProperties();
    let time;

    writeLog('handlePostbackEvent: userId:' +  userId  + "postback.data: "+ data);

    switch (data) {
        case 'setSheetID':
            writeLog('case: setDheetID' + data);
            pssp.setProperty(userId, 'isWaitingSheetId');
            break;
        //照明 
        case 'turnOnLight':
            writeLog('case: turnOnLight' + data);
            break;
        case 'turnOffLight':
            writeLog('case: turnOffLight' + data);
            break;
        case 'turnOnNightLight':
            writeLog('case: turnOnNightLight' + data);
            break;
        case 'turnOffNightLight':
            writeLog('case: turnOffNightLight' + data);
        break;
        case 'setWakeUpTime':
            time = event.postback.params.time;
            writeLog('case: setWakeUpTime' + data + time);
            break;
        case 'setBedTime':
            time = event.postback.params.time;
            writeLog('case: setbedTime' + data);
            break;
        //エアコン
        case 'turnOnAirCon':
            writeLog('case: turnOnAirCon' + data);
            break;
        case 'turnOffAirCon':
            writeLog('case: turnOffAirCon' + data);
            break;
        default:
            writeLog('未定義のpostbackデータ: ' + data);
            break;
    }
}