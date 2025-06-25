function getSheet(name) {
  const SPREADSHEET_ID = '1zM1uZXrjmlbwbEtR7AlL5m_ynY2hPtSk8Fvmgv6ajTk';
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(name);

  if (!sheet) {
    throw new Error('シートが見つかりません');
  }

  return sheet;
}
