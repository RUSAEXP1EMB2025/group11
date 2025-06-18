function initialize(lineId){
  const SHEET_ID = "InitSheetId";
  const WAKE_UP_TIME = "7:00:00";
  const BEDTIME = "21:00:00";

  const now = new Date();
  const timeStr = Utilities.formatDate(now, "Asia/Tokyo", "HH:mm:ss");

  if (changeIdToRow(lineId) !== 0) {
      writeLog(`initialize: ${lineId}はすでに登録されています`);
      throw new Error('このLINEIDは登録済みです');
    }
  
  writeToSingleCell(lineId, lineId, "LINEID");
  writeToSingleCell(SHEET_ID, lineId, "SHEETID");
  writeToSingleCell(timeStr, lineId, "UPDATETIME");
  writeToSingleCell(WAKE_UP_TIME, lineId, "WAKEUPTIME");
  writeToSingleCell(BEDTIME, lineId, "BEDTIME");
}

function writeToSingleCell(data, lineId, dataType) {
  const sheet = getSheet("database");

  if(dataType === "LINEID") {
    if (changeIdToRow(lineId) !== 0) {
      writeLog(`writeToSingleCell: ${lineId}はすでに登録されています`);
      throw new Error('この関数は初期化以外では使用できません');
    }
    sheet.getRange(sheet.getLastRow() + 1, changeDataTypeToColumn(dataType)).setValue(data);
  } else {
    sheet.getRange(changeIdToRow(lineId), changeDataTypeToColumn(dataType)).setValue(data);
  }
}

function writeLog(text){
  const sheet = getSheet("log");
  const now = new Date();

  const yyyy = now.getFullYear();
  const mm   = String(now.getMonth() + 1).padStart(2, '0');
  const dd   = String(now.getDate()).padStart(2, '0');
  const hh   = String(now.getHours()).padStart(2, '0');
  const mi   = String(now.getMinutes()).padStart(2, '0');
  const ss   = String(now.getSeconds()).padStart(2, '0');
  const ms   = String(now.getMilliseconds()).padStart(3, '0');
  const time = `${yyyy}/${mm}/${dd} ${hh}:${mi}:${ss}.${ms}`;

  sheet.insertRowBefore(1); // 一番上に新しい行を挿入
  sheet.getRange(1, 1).setValue(time);
  sheet.getRange(1, 2).setValue(text);
}

function deleteRow(lineId) {
  const sheet = getSheet("database");
  const row = changeIdToRow(lineId);
  
  if (row === 0) {
    writeLog(`${functionname}: ${lineId}は登録されていません`);
    throw new Error('このLINEIDは登録されていません');
  }
  
  sheet.deleteRow(row);
}
