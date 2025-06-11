function getSheet(name) {
  const SPREADSHEET_ID = '1yzJR1-XH4WHML0cVOk-E8w7GR-TDvWsJzcpeHGdaJAc'
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(name);

  if (!sheet) {
    throw new Error('シートが見つかりません');
  }

  return sheet;
}

function getLastData(name) {
  return getSheet(name).getDataRange().getValues().length;
}