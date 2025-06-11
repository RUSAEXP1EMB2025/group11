//ユーザのLINEIDが登録済みならば，その行番号を，そうでなければ0を返す．
function changeIdToRow(lineID) {
  const sheet = getSheet("database");
  const lastRow = sheet.getLastRow(); // データのある最終行を取得

  //データなしなら
  if (lastRow === 1) {
    return 0;
  }

  // A列の2行目からデータのある行までを取得
  const range = sheet.getRange(2, 1, lastRow - 1);
  const lineIDs = range.getValues(); // 二次元配列で返る

  for (let i = 2; i <= lastRow; i++) {
    if (lineIDs[i-2][0] === lineID) {
      return i;
    }
  }

  return 0; // 一致するものがなかった場合
}

function changeDataTypeToColumn(dataType) {
  const sheet = getSheet("database");
  const lastColunm = sheet.getLastColumn();
  const range = sheet.getRange(1, 1, 1, lastColunm);
  const dataTypes = range.getValues(); // 二次元配列で返る

  for (let i = 1; i <= lastColunm; i++) {
    if (dataTypes[0][i-1] === dataType) {
      return i;
    }
  }

  throw new Error('dataTypeが見つかりません');
}

function getSheet(name) {
  const SPREADSHEET_ID = '1D-aC84CBSO740E0gr3FpYpLeztuO0G57-GUdajP3wi4'
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(name);

  if (!sheet) {
    throw new Error('シートが見つかりません');
  }

  return sheet;
}