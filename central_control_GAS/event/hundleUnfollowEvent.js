function handleUnfollowEvent(event) {
    const userId = event.source.userId;

    // ユーザー情報を削除
    deleteRow(userId);
}