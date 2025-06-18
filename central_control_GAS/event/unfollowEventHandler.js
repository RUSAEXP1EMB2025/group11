function handleUnfollowEvent(event) {
    const userId = event.source.userId;

    writeLog('handleUnfollowEvent: ' + userId);
    
    // ユーザー情報を削除
    deleteRow(userId);
}