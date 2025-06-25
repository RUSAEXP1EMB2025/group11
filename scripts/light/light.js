function myFunction() {
  try {

    const time = getCurrentTime();
    const { sleep, morning } = getTimesFromLINE();
    const { TURNONLIGHT, TURNOFFLIGHT, USENIGHTLIGHT, ISATHOME} = getFlagsFromLINE();

    Logger.log(`現在時刻: ${time}, 起床: ${morning}, 就寝: ${sleep}`);

    if(TURNONLIGHT){
      turnLightOn();
    }else if(TURNOFFLIGHT){
      turnLightOff();
    }else if(USENIGHTLIGHT){
      turnNightLightOn();
    }

    if (ISATHOME) { //gps === homing
      if (isBetween(time, morning, sleep)) {
        Logger.log("起きている時間。照明を点灯します。");
        turnLightOn();
      } else {
        Logger.log("就寝時間。照明を常夜灯にします。");
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
  const sheet = getSheet("sensor"); // 共通のgetSheet関数を使用

  const wakeMinutes = sheet.getRange("H4").getValue();
  const sleepMinutes = sheet.getRange("H5").getValue();

  if (!wakeMinutes || !sleepMinutes) {
    throw new Error("H4/H5 に起床・就寝時間（分）が設定されていません");
  }

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

function getFlagsFromLINE() {
  const sheet = getSheet("sensor");

  // 各フラグのセル位置（例としてC2,H2など固定）
  const cells = {
    TURNONLIGHT: "H1",        // 1H
    TURNOFFLIGHT: "H2",       // 2H
    USENIGHTLIGHT: "H3",   // 3H
    // 5Hは指定ないのでスルー（もしくは必要なら追加）
    ISATHOME: "H8"            // 8H
  };

  const flags = {};

  for (const [key, cell] of Object.entries(cells)) {
    let val = sheet.getRange(cell).getValue();

    // 文字列 "TRUE"/"FALSE" ならBooleanに変換、それ以外はBooleanキャスト
    if (typeof val === "string") {
      val = val.toUpperCase() === "TRUE";
    } else {
      val = Boolean(val);
    }
    flags[key] = val;
  }

  return flags;
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
