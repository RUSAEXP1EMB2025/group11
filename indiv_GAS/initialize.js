function writeInitialData(){
  const sheet = getSheet('sensor');

  const header = [
    'DATE', 'TMP', 'HUM', '', 'LAT', 'LON'
  ];

  sheet.getRange(1, 1, 1, header.length).setValues([header]);

  const settings = [
    ['TURNONLIGHT', 'FALSE'],
    ['TURNOFFLIGHT', 'FALSE'],
    ['USENIGHTLIGHT', 'FALSE'],
    ['WAKEUPTIME', '6:00'],
    ['BEDTIME', '23:59'],
    ['TURNONAIRCON', 'FALSE'],
    ['TURNOFFAIRCON', 'FALSE'],
    ['ISATHOME', 'TRUE'],
    ['AIRCONMODE', 'AUTO']
  ];

  sheet.getRange(1, 7, settings.length, 2).setValues(settings);

  
  recordSensorData();
  setLocation();
}

function shareSheet() {
  const sheetId = getSpreadSheetId();
  const email = 'nemo3developementexercise@gmail.com';

  // スプレッドシートのファイルを取得
  const file = SpreadsheetApp.openById(sheetId);

  // 編集権限で共有（閲覧のみなら addViewer を使う）
  file.addEditor(email);

  Logger.log('共有しました: ' + email + ' に ' + sheetId);
}

function setGASTriggers() {
  const targetFunctions = ["recordSensorData", "myFunction", "executeAutoControl"];
  const existingTriggers = ScriptApp.getProjectTriggers();

  for (const functionName of targetFunctions) {
    const alreadyExists = existingTriggers.some(
      trigger => trigger.getHandlerFunction() === functionName
    );

    if (!alreadyExists) {
      ScriptApp.newTrigger(functionName)
               .timeBased()
               .everyMinutes(1)
               .create();
      Logger.log(`${functionName} に対するトリガーを作成しました`);
    } else {
      Logger.log(`${functionName} に対するトリガーは既に存在します`);
    }
  }
}

function setLocation(){
  const locStr = getLocation();
  const location = getGeocode(locStr[0], locStr[1]);
  if(location == null){
    console.error('住所間違い');
  } else {
    const sheet = getSheet('sensor');
    sheet.getRange(2, 5, 1, 2).setValues([location]);
  }
}