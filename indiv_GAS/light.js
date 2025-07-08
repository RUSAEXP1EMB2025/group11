function myFunction() {
  try {
    const time = getCurrentTime();
    const { sleep, morning } = getTimesFromLINE();
    const sheet = getSheet("sensor"); // スプレッドシートへの書き込みのためにシートを取得

    // フラグの現在の値を取得
    const TURNONLIGHT = sheet.getRange("H1").getValue() === true || sheet.getRange("H1").getValue().toString().toUpperCase() === "TRUE";
    const TURNOFFLIGHT = sheet.getRange("H2").getValue() === true || sheet.getRange("H2").getValue().toString().toUpperCase() === "TRUE";
    const USENIGHTLIGHT = sheet.getRange("H3").getValue() === true || sheet.getRange("H3").getValue().toString().toUpperCase() === "TRUE";
    const ISATHOME = sheet.getRange("H8").getValue() === true || sheet.getRange("H8").getValue().toString().toUpperCase() === "TRUE";

    Logger.log(`現在時刻: ${time}, 起床: ${morning}, 就寝: ${sleep}`);
    Logger.log(`フラグの状態: TURNONLIGHT=${TURNONLIGHT}, TURNOFFLIGHT=${TURNOFFLIGHT}, USENIGHTLIGHT=${USENIGHTLIGHT}, ISATHOME=${ISATHOME}`);

    // ★ここから修正・追加★
    // フラグがTRUEの場合、その操作を実行し、該当フラグをFALSEに戻し、関数を終了する
    if(TURNONLIGHT){
      Logger.log("TURNONLIGHTがTRUEのため、照明を点灯します。");
      turnLightOn();
      sheet.getRange("H1").setValue(false); // フラグをFALSEに戻す
      Logger.log("H1をFALSEに設定しました。");
      return; // ここで関数を終了し、以降の処理を実行しない
    } else if(TURNOFFLIGHT){
      Logger.log("TURNOFFLIGHTがTRUEのため、照明を消灯します。");
      turnLightOff();
      sheet.getRange("H2").setValue(false); // フラグをFALSEに戻す
      Logger.log("H2をFALSEに設定しました。");
      return; // ここで関数を終了し、以降の処理を実行しない
    }
    
    // 上記のフラグがいずれもTRUEでなかった場合のみ、以下の自動制御ロジックを実行する
    if (ISATHOME) { //gps === homing
      if (isBetween(time, morning, sleep)) {
        Logger.log("在宅中かつ起きている時間。照明を点灯します。");
        turnLightOn();
      } else {
        Logger.log("在宅中かつ就寝時間。照明を常夜灯にします。");
        turnNightLightOn();
      }
    } else {
      Logger.log("外出中のため照明を消灯します。");
      turnLightOff();
    }
  } catch (e) {
    Logger.log("エラー発生: " + e.message);
    throw e; // ここで再スローして詳細ログを確認
  }
}

//スプレッドシートから取得ver↓
function getTimesFromLINE() {
  const sheet = getSheet("sensor");
  const wakeCell = sheet.getRange("H4").getValue();
  const sleepCell = sheet.getRange("H5").getValue();
  const toMinutes = time => {
    if (typeof time === "number") {
      // 分として入力されている（360など）
      return time;
    } else if (time instanceof Date) {
      return time.getHours() * 60 + time.getMinutes();
    } else {
      throw new Error("H4/H5 の形式が不正です");
    }
  };
  const wakeMinutes = toMinutes(wakeCell);
  const sleepMinutes = toMinutes(sleepCell);
  const toHHMM = min => {
    const h = Math.floor(min / 60).toString().padStart(2, "0");
    const m = (min % 60).toString().padStart(2, "0");
    return `${h}:${m}`;
  };
  return {
    morning: toHHMM(wakeMinutes),
    sleep: toHHMM(sleepMinutes)
  };
}









function getCurrentTime() {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, "0");
  const m = now.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

function isBetween(current, start, end) {
  const toMin = t => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  const c = toMin(current);
  const s = toMin(start);
  const e = toMin(end);

  return s <= e ? (c >= s && c < e) : (c >= s || c < e); // 日をまたぐ場合に対応
}

function getLightSignalId(type) {
  const appliances = getNatureRemoData("appliances");

  for (const appliance of appliances) {
    if (appliance.type === "IR" && appliance.signals) {
      const signal = appliance.signals.find(sig =>
        type === "ON"  ? /ON|オン|点灯/i.test(sig.name) :
        type === "OFF" ? /OFF|オフ|消灯/i.test(sig.name) : //false
        type === "NL"  ? /常夜灯|Nightlight/i.test(sig.name) : false
      );
      if (signal) return signal.id;
    }
  }

  Logger.log(`${type} 信号が見つかりません`);
  return null;
}

function turnLightOn() {
  const signalId = getLightSignalId("ON");
  if (signalId) sendSignalToRemo(signalId);
}

function turnLightOff() {
  const signalId = getLightSignalId("OFF");
  if (signalId) sendSignalToRemo(signalId);
}

function turnNightLightOn(){
  const signalId = getLightSignalId("NL");
  if (signalId) sendSignalToRemo(signalId);
}