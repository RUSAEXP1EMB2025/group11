// Nature Remo の API トークンと操作対象のデバイス名
const REMO_API_TOKEN = getRemo3AccessToken();
const TARGET_DEVICE_NAME = 'aircon';
const TARGET_DEVICE_TEMPERATURE_UP = 'airup';
const TARGET_DEVICE_TEMPERATURE_DOWN = 'airdown';

// OpenWeatherMapのAPIキーと対象地点の緯度経度
const OPENWEATHER_API_KEY = 'f53d83555ed6cc90fee6552b803492d5';
const LAT = 34.8525; // 大阪府茨木市の緯度経度例
const LON = 135.5681;

// --- ここから追加・変更 ---
// 状態管理用スプレッドシートの設定
const SPREADSHEET_ID = getSpreadSheetId(); // ← ここにあなたのスプレッドシートIDを入力
const SHEET_NAME = 'sensor'; // スプレッドシートのシート名（タブ名）
const MODE_CELL = 'H9'; // 操作モードを記録するセル番地
// --- ここまで追加・変更 ---

/**
 * スプレッドシートに現在の操作モードを書き込む
 * @param {string} mode - 'AUTO' または 'MANUAL'
 */

function setOperationMode(mode) {
  if (mode !== 'AUTO' && mode !== 'MANUAL') {
    Logger.log(`不正なモード指定です: ${mode}`);
    return;
  }
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    sheet.getRange(MODE_CELL).setValue(mode);
    Logger.log(`操作モードを「${mode}」に設定しました。`);
  } catch (e) {
    Logger.log(`スプレッドシートへの書き込みに失敗しました: ${e.message}`);
    throw e;
  }
}


/**
 * スプレッドシートから現在の操作モードを読み込む
 * @returns {string} - 'AUTO' または 'MANUAL'
 */
function getOperationMode() {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    const mode = sheet.getRange(MODE_CELL).getValue();
    // セルが空の場合や不正な値の場合は、安全のため 'AUTO' をデフォルトとする
    if (mode !== 'AUTO' && mode !== 'MANUAL') {
      Logger.log('モードが未設定のため、デフォルトの「AUTO」を返します。');
      return 'AUTO';
    }
    Logger.log(`スプレッドシートから操作モード「${mode}」を正常に読み込みました。`);
    return mode;
  } catch (e) {
    Logger.log(`スプレッドシートの読み込みに失敗しました: ${e.message}`);
    // 失敗した場合も安全のため手動モードとして扱う
    return 'MANUAL'; 
  }
}

/**
 * メインの自動制御ロジック（定期実行用）
 */
function executeAutoControl() {
  // --- ここから変更 ---
  // ★最初に、操作モードを確認する
  const currentMode = getOperationMode();
  if (currentMode !== 'AUTO') {
    Logger.log(`現在の操作モードは「${currentMode}」です。自動制御をスキップします。`);
    return; // モードが'AUTO'でなければ、処理を中断
  }
  // --- ここまで変更 ---

  Logger.log('操作モード「AUTO」のため、自動制御を実行します。');
  try {
    const gps = "home"; // 本来はGPS情報などを取得
    // Nature Remoから現在の温湿度を取得するなどの処理をここに実装するのが望ましい
    const tem = "30.0", hum = "60"; 
    const discom = calcDiscomfort(parseFloat(tem), parseFloat(hum));
    Logger.log(`現在の不快指数: ${discom.toFixed(1)}`);

    if (gps === "home") {
      if (isDiscomfort(discom)) {
        let tempSetting = discom > 75 ? "23" : discom > 70 ? "24" : "25";
        Logger.log("不快指数が高いため、エアコンを起動します。");

        if (predictDiscomfortIndex()) {
          Logger.log("予測で悪化しそうなので1度下げます。");
          controlAirconTempDown();
        }
        controlAircon(true, tempSetting);
      } else {
        // 在宅時、快適な場合はOFFにする（天気予報も考慮するロジックはここに集約）
        const forecastWorsens = predictDiscomfortIndex();
        const appliance = getAirconDevice();
        const isAirconOn = appliance && appliance.settings.button !== 'power-off';

        if (isAirconOn && !forecastWorsens) {
            Logger.log("快適かつ、天気予報の悪化もないためエアコンをOFFにします。");
            controlAircon(false);
        } else {
            Logger.log("快適なため、エアコンは現状維持またはOFFのままです。");
        }
      }
    } else {
      Logger.log("外出中のため、エアコンをOFFにします。");
      controlAircon(false);
    }
    Logger.log("自動制御のメインロジックが正常に完了しました。");
  } catch (e) {
    Logger.log("自動制御中にエラーが発生しました: " + e.message);
    throw e;
  }
}

/**
 * エアコンの電源をON/OFFする
 * @param {boolean} powerOn - trueならON, falseならOFF
 * @param {string} temperature - 設定温度
 */
function controlAircon(powerOn, temperature = '24') {
  const appliance = getAirconDevice();
  if (!appliance) {
    Logger.log('指定したエアコンが見つかりません');
    return;
  }
  Logger.log('エアコンデバイスが見つかりました。操作リクエストを送信します。');
  const url = `https://api.nature.global/1/appliances/${appliance.id}/aircon_settings`;
  
  // --- `tem` ではなく引数 `temperature` を使うように修正 ---
  const payload = powerOn
    ? {
        operation_mode: 'cool',
        temperature: temperature,
        air_volume: 'auto',
      }
    : {
        button: 'power-off',
      };

  const options = {
    method: 'post', // POSTが推奨されている
    headers: {
      'Authorization': `Bearer ${REMO_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };

  const response = UrlFetchApp.fetch(url, options);
  Logger.log(`Nature Remo APIへのリクエストが完了しました。ステータスコード: ${response.getResponseCode()}`);
  Logger.log(`Aircon ${powerOn ? 'ON' : 'OFF'} (Temp: ${temperature}) Response: ${response.getContentText()}`);
}

// Nature Remoからすべてのデバイスを取得し、対象のエアコンを探す
function getAirconDevice() {
  const url = 'https://api.nature.global/1/appliances';
  const headers = { Authorization: `Bearer ${REMO_API_TOKEN}` };
  const response = UrlFetchApp.fetch(url, { headers: headers });
  Logger.log("Nature Remo APIからデバイスリストの取得に成功しました。");
  const appliances = JSON.parse(response.getContentText());
  return appliances.find(a => a.nickname === TARGET_DEVICE_NAME && a.type === 'IR');
}

// 天気予報から不快指数を予測する
function predictDiscomfortIndex() {
  const forecasts = fetchForecast();
  if (forecasts) {
    Logger.log("天気予報データに基づき、不快指数の予測を開始します。");
  }
  for (const f of forecasts) {
    const temp = f.temp;
    const hum = f.hum;
    const idx = 0.81 * temp + 0.01 * hum * ((0.99 * temp) - 14.3) + 46.3;
    Logger.log(`${f.dt} の予測不快指数: ${idx.toFixed(1)}`);
    if (idx > 60) return true;
  }
  return false;
}

// 天気予報データを取得する
function fetchForecast() {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&units=metric&cnt=3&appid=${OPENWEATHER_API_KEY}`;
  const resp = UrlFetchApp.fetch(url);
  Logger.log("OpenWeatherMap APIから天気予報データの取得に成功しました。");
  const data = JSON.parse(resp.getContentText());
  return data.list.map(item => ({
    temp: item.main.temp,
    hum: item.main.humidity,
    dt: item.dt_txt
  }));
}

// 不快指数を計算する
function calcDiscomfort(temp, hum) {
    return 0.81 * temp + 0.01 * hum * (0.99 * temp - 14.3) + 46.3;
}

// 不快かどうかを判定する
function isDiscomfort(discom, threshold = 60) {
  Logger.log(`不快指数: ${discom.toFixed(1)}`);

  return discom > threshold;
}

// --- ここから追加したコード ---

/**
 * 指定されたニックネームのデバイス（アプライアンス）を探し、その信号を送信する
 * @param {string} deviceName - 操作対象のデバイスのニックネーム
 */
function sendSignalByDeviceName(deviceName) {
  try {
    const url = 'https://api.nature.global/1/appliances';
    const headers = { 'Authorization': `Bearer ${REMO_API_TOKEN}` };
    const response = UrlFetchApp.fetch(url, { headers: headers });
    const appliances = JSON.parse(response.getContentText());

    // 指定されたニックネームを持つデバイスを検索
    const targetDevice = appliances.find(a => a.nickname === deviceName);

    if (!targetDevice) {
      Logger.log(`デバイス「${deviceName}」が見つかりません。Nature Remoアプリで設定した名前と一致しているか確認してください。`);
      return;
    }

    // デバイスに登録されている信号（ボタン）が存在するか確認
    if (!targetDevice.signals || targetDevice.signals.length === 0) {
      Logger.log(`デバイス「${deviceName}」に送信可能な信号が登録されていません。`);
      return;
    }

    // デバイスに登録されている最初の信号IDを取得して送信
    const signalId = targetDevice.signals[0].id;
    const sendUrl = `https://api.nature.global/1/signals/${signalId}/send`;

    const options = {
      'method': 'post',
      'headers': {
        'Authorization': `Bearer ${REMO_API_TOKEN}`,
      },
      'muteHttpExceptions': true,
    };

    const sendResponse = UrlFetchApp.fetch(sendUrl, options);
    Logger.log(`デバイス「${deviceName}」の信号送信リクエストが完了しました。ステータスコード: ${sendResponse.getResponseCode()}`);
    if (sendResponse.getResponseCode() !== 200) {
      Logger.log(`エラーレスポンス: ${sendResponse.getContentText()}`);
    }
    
  } catch (e) {
    Logger.log(`信号の送信中にエラーが発生しました: ${e.message}`);
    throw e;
  }
}

/**
 * エアコンの温度を1度上げる
 */
function controlAirconTempUp() {
  Logger.log('エアコンの温度を1度上げる操作を開始します。');
  sendSignalByDeviceName(TARGET_DEVICE_TEMPERATURE_UP);
}

/**
 * エアコンの温度を1度下げる
 */
function controlAirconTempDown() {
  Logger.log('エアコンの温度を1度下げる操作を開始します。');
  sendSignalByDeviceName(TARGET_DEVICE_TEMPERATURE_DOWN);
}

// /**
//  * 【テスト用】エアコンの温度を1度上げる関数をテストします。
//  */
// function testControlAirconTempUp() {
//   Logger.log('--- 温度を1度上げるテストを開始します ---');
//   controlAirconTempUp();
//   Logger.log('--- 温度を1度上げるテストを終了します ---');
  
//   // 手動で温度操作を行ったため、自動制御モードを'MANUAL'に設定
//   setOperationMode('MANUAL');
//   Logger.log('温度を上げたため、操作モードを「MANUAL」に切り替えました。');
// }

// /**
//  * 【テスト用】エアコンの温度を1度下げる関数をテストします。
//  */
// function testControlAirconTempDown() {
//   Logger.log('--- 温度を1度下げるテストを開始します ---');
//   controlAirconTempDown();
//   Logger.log('--- 温度を1度下げるテストを終了します ---');
  
//   // 手動で温度操作を行ったため、自動制御モードを'MANUAL'に設定
//   setOperationMode('MANUAL');
//   Logger.log('温度を下げたため、操作モードを「MANUAL」に切り替えました。');
// }

// /* ===============================================================
//   LINE Webhook処理のサンプル（この関数をWebアプリとして公開する）
//  =============================================================== */
// function doPost(e) {
//   const event = JSON.parse(e.postData.contents).events[0];
//   const messageText = event.message.text;
//   const replyToken = event.replyToken;

//   let replyMessage = '';

//   switch (messageText) {
//     case 'エアコン消して':
//       controlAircon(false);
//       setOperationMode('MANUAL'); // ★モードを手動に切り替え
//       replyMessage = 'エアコンをOFFにし、手動操作モードに切り替えました。自動制御を再開するには「オートにして」と入力してください。';
//       Logger.log('LINEコマンド「エアコン消して」の処理が完了しました。');
//       break;

//     case 'エアコンつけて':
//       controlAircon(true, '25'); // とりあえず25度でON
//       setOperationMode('MANUAL'); // ★モードを手動に切り替え
//       replyMessage = 'エアコンをONにし、手動操作モードに切り替えました。自動制御を再開するには「オートにして」と入力してください。';
//       Logger.log('LINEコマンド「エアコンつけて」の処理が完了しました。');
//       break;

//     case 'オートにして':
//       setOperationMode('AUTO'); // ★モードを自動に切り替え
//       replyMessage = '自動制御モードに切り替えました。現在の状況に応じてエアコンを操作します。';
//       // モード切替後、すぐに自動制御を実行する
//       executeAutoControl();
//       Logger.log('LINEコマンド「オートにして」の処理が完了しました。');
//       break;
//       
//     default:
//       Logger.log(`未定義のメッセージ「${messageText}」を受信したため、処理をスキップします。`);
//       // その他のメッセージには応答しない
//       return;
//   }

//   // LINEに返信する
//   const url = 'https://api.line.me/v2/bot/message/reply';
//   const lineAccessToken = 'YOUR_LINE_CHANNEL_ACCESS_TOKEN'; // 自身のLINE Channel Access Token

//   UrlFetchApp.fetch(url, {
//     'headers': {
//       'Content-Type': 'application/json; charset=UTF-8',
//       'Authorization': 'Bearer ' + lineAccessToken,
//     },
//     'method': 'post',
//     'payload': JSON.stringify({
//       'replyToken': replyToken,
//       'messages': [{'type': 'text', 'text': replyMessage}],
//     }),
//   });
//   Logger.log('LINEへの返信リクエストが完了しました。');
// }