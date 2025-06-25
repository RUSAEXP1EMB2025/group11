function getLastData(name) {
  return getSheet(name).getDataRange().getValues().length;
}

function recordSensorData() {
  const deviceData = getNatureRemoData("devices"); // APIからセンサーデータ取得
  const lastSensorData = getLastData("sensor");     // 最終行取得

  const arg = {
    te: deviceData[0].newest_events.te.val,  // 温度
    hu: deviceData[0].newest_events.hu.val,  // 湿度
    il: deviceData[0].newest_events.il.val   // 照度
  };

  setSensorData(arg, lastSensorData + 1);
}

function setSensorData(data, row) {
  getSheet('sensor').getRange(row, 1, 1, 4).setValues([[new Date(), data.te, data.hu, data.il]]);
}
