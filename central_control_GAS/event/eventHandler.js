function doPost(e) {
  const contents = JSON.parse(e.postData.contents);
  writeLog('contents' + contents);

  if(contents.source == 'shortcut'){
    writeLog('hundleShortcutEvnt');
    hundleShortcutEvent(contents);
  }else{
    writeLog('hundleLIneEvent');
    hundleLineEvent(contents);
  }
}

function hundleShortcutEvent(contents){
  const sheetId = contents.sheetid;
  const isAtHome = contents.isathome;
  const sheet = getSheet('sensor', sheetId);

  if (!sheet) {
    writeLog(`hundleShortcutEvent: シートが存在しません`);
    //LINEに通知したいかも
  }

  writeLog('hundleMessageEvent: ' + sheetId + ', ' + isAtHome);
  if(isAtHome){
      sheet.getRange(8, 8).setValue('TRUE');
  }else{
      sheet.getRange(8, 8).setValue('FALSE');
  }
  return;
}

function hundleLineEvent(contents){
  const events = contents.events;

  events.forEach(event => {
    const eventType = event.type;
    writeLog('line' + eventType);

    switch (eventType) {
      case 'message':
        handleMessageEvent(event);
        break;
      case 'follow':
        handleFollowEvent(event);
        break;
      case 'unfollow':
        handleUnfollowEvent(event);
        break;
      case 'join':
        //handleJoinEvent(event);
        break;
      case 'leave':
        //handleLeaveEvent(event);
        break;
      case 'postback':
        handlePostbackEvent(event);
        break;
      case 'beacon':
        //handleBeaconEvent(event);
        break;
      default:
        logEvent('未定義のイベント', event);
    }
  });

  return;
}
