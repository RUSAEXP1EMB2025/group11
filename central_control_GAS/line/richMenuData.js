const iniRichMenuDescription  = {
  size: {
    width: 1024,
    height: 512
  },
  selected: false,
  name: "初期リッチメニュー",
  chatBarText: "初期リッチメニュー",
  areas: [
    {
      bounds: { x: 0, y: 0, width: 1250, height: 843 },
      action: { type: "message", text: "左ボタン" }
    },
    {
      bounds: { x: 1250, y: 0, width: 1250, height: 843 },
      action: { type: "message", text: "右ボタン" }
    }
  ]
};

const iniRichMenuImageFileID = '1hofGVuv7x2_ACV9h3ii7TvIXhVcranu8';

function getIniRichMenuDescription() {
  return iniRichMenuDescription;
}

function getIniRichMenuImageFileID() {
  return iniRichMenuImageFileID;
}