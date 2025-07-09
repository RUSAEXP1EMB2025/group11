function recordSensorData() {
  const deviceData = getNatureRemoData("devices");　　　　//data取得

  var arg = {
    te:deviceData[0].newest_events.te.val,　　//温度
    hu:deviceData[0].newest_events.hu.val,　　//湿度
  }

  setSensorData(arg, 2);
}

function setSensorData(data, row) {
  getSheet('sensor').getRange(row, 1, 1, 3).setValues([[new Date(), data.te, data.hu]])
}
