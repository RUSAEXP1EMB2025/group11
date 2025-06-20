function testGetSaikoroSheet(){
  const sheetId = getSaikoroSheetId();

  //const match = text.match(/ID:\s*(\w+)/); // 正規表現で取り出す
  //const sheetId = match[1];

  try {
      spreadsheet = SpreadsheetApp.openById(sheetId);
  } catch (e) {
      throw new Error("スプレッドシートの取得に失敗しました:");
  }

  sheet = spreadsheet.getSheetByName('sensor');

  if (!sheet) {
      throw new Error("シートsensorのの取得に失敗しました。");
  }


}

function testPutId(){
  const text = "ID: 12345abcde";
  const sheetId = text.match(/ID:\s*(\w+)/); // 正規表現で取り出す
  console.log(sheetId); // "12345abcde"
}

function testDoPostFollowEvent() {
  const fakeEvent = {
    postData: {
      contents: JSON.stringify({
        destination: "Uxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        events: [
          {
            type: "follow",
            replyToken: "dummyReplyToken1234567890",
            source: {
              userId: "U1234567890abcdef1234567890abcdef",
              type: "user"
            },
            timestamp: Date.now(),
            mode: "active"
          }
        ]
      })
    }
  };

  // 実行
  doPost(fakeEvent);
}



function testDoPost() {
  const fakeEvent = {
    "events": [
      {
        "type": "follow",
        "source": {
          "userId": "U1234567890abcdef"
        },
        "timestamp": Date.now(),
        "replyToken": "testToken"
      }
    ]
  };

  const fakePostData = {
    contents: JSON.stringify(fakeEvent)
  };

  const fakeEventObject = {
    postData: fakePostData
  };

  doPost(fakeEventObject);
}
