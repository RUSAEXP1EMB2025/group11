function doPost(e) {
  const contents = e.postData.contents;

  writeLog(contents);
  
  const events = JSON.parse(contents).events;

  writeLog(events + 'イベントの数: ' + events.length);

  events.forEach(event => {
    const eventType = event.type;

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
        //handlePostbackEvent(event);
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
