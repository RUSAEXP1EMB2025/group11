function getNatureRemoData(endpoint) {
  const REMO_ACCESS_TOKEN = 'ory_at_xfqW-wOCDHNr7RJ-4vY7KwFB8K-XenFFRqaMyB_pmQc.X5rmnTpCXOJyFhpZNdY4CPv_QAkmOYbNYjyUs-YZyn4';


  const url = "https://api.nature.global/1/" + endpoint;
  const options = {
    method: "get",
    headers: {
      "Authorization": "Bearer " + REMO_ACCESS_TOKEN,
      "Content-Type": "application/json"
    },
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  const code = response.getResponseCode();

  Logger.log(`Remo API ${endpoint} 呼び出し結果: ${code}`);

  if (code !== 200) {
    Logger.log("レスポンス内容: " + response.getContentText());
    throw new Error(`Nature Remo API error: ${code}`);
  }

  return JSON.parse(response.getContentText());
}


function sendSignalToRemo(signalId) {
const REMO_ACCESS_TOKEN = 'ory_at_xfqW-wOCDHNr7RJ-4vY7KwFB8K-XenFFRqaMyB_pmQc.X5rmnTpCXOJyFhpZNdY4CPv_QAkmOYbNYjyUs-YZyn4';


  const url = `https://api.nature.global/1/signals/${signalId}/send`;
  const options = {
    method: "post",
    headers: {
      "Authorization": "Bearer " + REMO_ACCESS_TOKEN
    },
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  Logger.log("信号送信結果: " + response.getContentText());
}

