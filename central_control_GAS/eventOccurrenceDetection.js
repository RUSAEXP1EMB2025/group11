// const CHANNEL_SECRET = '9124f25abd51f5020bdbdf61720604c9'; //LINEチャネルシークレット
// const REPLY_ENDPOINT = 'https://api.line.me/v2/bot/message/reply';
// const CHANNEL_ACCESS_TOKEN = 'zIbA+SpTb8gz87cI9OTd444byrDleHlqy9qHO9jLR0RuA0CNSEndi9Y9nbCcmOfB6YMY9lE7wPPWqdtsj6zOScLsDV149WW70TxenYh1oBukFM3saqPawhRvmfQYpIr/HrdaplnMyov+JR8CfmHXrQdB04t89/1O/w1cDnyilFU='; // LINEアクセストークン

function doPost(e) {
  const sheet = getSheet("log");
  const contents = e.postData ? e.postData.contents : "No postData";

  // 全てのWebhookデータを記録（壊れていても見る）
  sheet.appendRow([new Date(), contents]);
  
  return;
}
