function initialize(lineID){
  const SHEET_ID = "InitSheetId";
  const WAKE_UP_TIME = "7:00:00";
  const BEDTIME = "21:00:00";

  const now = new Date();
  const timeStr = Utilities.formatDate(now, "Asia/Tokyo", "HH:mm:ss");

  if (changeIdToRow(lineID) !== 0) {
      throw new Error('このLINEIDは登録済みです');
    }
  
  writeToSingleCell(lineID, lineID, "LINEID");
  writeToSingleCell(SHEET_ID, lineID, "SHEETID");
  writeToSingleCell(timeStr, lineID, "UPDATETIME");
  writeToSingleCell(WAKE_UP_TIME, lineID, "WAKEUPTIME");
  writeToSingleCell(BEDTIME, lineID, "BEDTIME");
}

function writeToSingleCell(data, lineID, dataType) {
  const sheet = getSheet("database");

  if(dataType === "LINEID") {
    if (changeIdToRow(lineID) !== 0) {
      throw new Error('この関数は初期化以外では使用できません');
    }
    sheet.getRange(sheet.getLastRow() + 1, changeDataTypeToColumn(dataType)).setValue(data);
  } else {
    sheet.getRange(changeIdToRow(lineID), changeDataTypeToColumn(dataType)).setValue(data);
  }
}

function writeLog(text){
  const sheet = getSheet("log");
  const time = new Date().getTime(); // 現在時刻（ミリ秒単位）
  
  sheet.insertRowBefore(1); // 一番上に新しい行を挿入
  sheet.getRange(1, 1).setValue(time);
  sheet.getRange(1, 2).setValue(text);
}

function deleteRow(lineID) {
  const sheet = getSheet("database");
  const row = changeIdToRow(lineID);
  
  if (row === 0) {
    throw new Error('このLINEIDは登録されていません');
  }
  
  sheet.deleteRow(row);
}
