function getNatureRemoData(endpoint) {
  const REMO_ACCESS_TOKEN = 'ory_at_jDd1RIet-S88mRI5GaMWkQLzLKT4zuVUDBxeSCfHLwo.o_AFcxaWynKU_36ypEp_lspricznY7sSroFpDSyToxA'
  const headers = {
    "Content-Type" : "application/json;",
    'Authorization': 'Bearer ' + REMO_ACCESS_TOKEN,
  };

  const options = {
    "method" : "get",
    "headers" : headers,
  };

  return JSON.parse(UrlFetchApp.fetch("https://api.nature.global/1/" + endpoint, options));
}
