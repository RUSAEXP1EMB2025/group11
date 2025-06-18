class userInformation {
  constructor() {
    this.lineId = '';
    this.sheetId = '';
    this.updateTime = '';
  }

  setUserInfo(userInfo) {
    this.userInfo = userInfo;
  }

  getUserInfo() {
    return this.userInfo;
  }
}