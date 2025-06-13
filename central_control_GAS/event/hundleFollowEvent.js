function handleFollowEvent(event){
    const replyToken = event.replyToken;
    const userId = event.source.userId;
    
    // ユーザーID
    initialize(userId);

    // 返信メッセージ
    const text = '友達追加ありがとうございます！\n\n' +
                 'このボットは、あなたの生活をより良くするための情報を提供します。\n' +
                 '何か質問があれば、気軽に聞いてください！';
    replyText(replyToken, text);
}
