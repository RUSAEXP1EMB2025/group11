function getGeocode(prefecture, city) {
  const address = encodeURIComponent(`${prefecture} ${city}`);
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${address}`;

  const options = {
    method: "get",
    headers: {
      "User-Agent": "GoogleAppsScript" // NominatimではUser-Agentが必須
    }
  };

  const response = UrlFetchApp.fetch(url, options);
  const data = JSON.parse(response.getContentText());

  if (data.length > 0) {
    const lat = data[0].lat;
    const lon = data[0].lon;
    Logger.log(`緯度: ${lat}, 経度: ${lon}`);
    const location = [parseFloat(lat), parseFloat(lon)];
    return location;
  } else {
    Logger.log("住所が見つかりませんでした。");
    return null;
  }
}
