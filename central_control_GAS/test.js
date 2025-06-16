function testFollowEvent() {
  
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
