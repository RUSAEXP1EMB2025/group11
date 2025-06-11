function getWeatherTemp() {
  const latitude = 34.816;   // 茨木市の緯度
  const longitude = 135.568; // 茨木市の経度

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`;

  try {
    const response = UrlFetchApp.fetch(url);
    const json = JSON.parse(response.getContentText());

    return json.current.temperature_2m; // 現在の気温（摂氏）
  } catch (e) {
    Logger.log("Open-Meteo APIの取得エラー: " + e);
    return null;
  }
}
