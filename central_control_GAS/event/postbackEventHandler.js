function handlePostbackEvent(event) {
    const replyToken = event.replyToken;
    const userId = event.source.userId;
    const data = event.postback.data;
    const pssp = PropertiesService.getScriptProperties();
    let time, sheet, text;

    writeLog('handlePostbackEvent: userId:' +  userId  + "postback.data: "+ data);

    switch (data) {
        case 'setSheetID':
            writeLog('case: setDheetID' + data);
            pssp.setProperty(userId, 'isWaitingSheetId');
            break;
        //照明 
        case 'turnOnLight':
            writeLog('case: turnOnLight' + data);
            sheet = getSheet('sensor', getValue(userId, 'SHEETID'));
            sheet.getRange(1, 8).setValue('TRUE');
            replyText(replyToken, '照明をオンにします。');
            break;
        case 'turnOffLight':
            writeLog('case: turnOffLight' + data);
            sheet = getSheet('sensor', getValue(userId, 'SHEETID'));
            sheet.getRange(2, 8).setValue('TRUE');
            replyText(replyToken, '照明をオフにします。');
            break;
        case 'turnOnNightLight':
            writeLog('case: turnOnNightLight' + data);
            sheet = getSheet('sensor', getValue(userId, 'SHEETID'));
            sheet.getRange(3, 8).setValue('TRUE');
            replyText(replyToken, '常夜灯を使用します。');
            break;
        case 'turnOffNightLight':
            writeLog('case: turnOffNightLight' + data);
            sheet = getSheet('sensor', getValue(userId, 'SHEETID'));
            sheet.getRange(3, 8).setValue('FALSE');
            replyText(replyToken, '常夜灯を使用しません。');
        break;
        case 'setWakeUpTime':
            time = event.postback.params.time;
            writeLog('case: setWakeUpTime' + data + time);
            sheet = getSheet('sensor', getValue(userId, 'SHEETID'));
            sheet.getRange(4, 8).setValue(time);
            text = '起床時刻を' + String(time) + 'に設定します。';
            replyText(replyToken, text);
            break;
        case 'setBedTime':
            time = event.postback.params.time;
            writeLog('case: setbedTime' + data);
            sheet = getSheet('sensor', getValue(userId, 'SHEETID'));
            sheet.getRange(5, 8).setValue(time);
            text = '起床時刻を' + String(time) + 'に設定します。';
            replyText(replyToken, text);
            break;
        //エアコン
        case 'turnOnAirCon':
            writeLog('case: turnOnAirCon' + data);
            sheet = getSheet('sensor', getValue(userId, 'SHEETID'));
            sheet.getRange(6, 8).setValue('TRUE');
            break;
        case 'turnOffAirCon':
            writeLog('case: turnOffAirCon' + data);
            sheet = getSheet('sensor', getValue(userId, 'SHEETID'));
            sheet.getRange(7, 8).setValue('TRUE');
            break;
        default:
            writeLog('未定義のpostbackデータ: ' + data);
            break;
    }
}