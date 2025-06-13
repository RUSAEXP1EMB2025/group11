class userInformation {
  constructor() {
    this.lineID = '';
    this.sheetID = '';
    this.updateTime = '';
  }

  setUserInfo(userInfo) {
    this.userInfo = userInfo;
  }

  getUserInfo() {
    return this.userInfo;
  }
}