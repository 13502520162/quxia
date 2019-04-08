import fetch from "../../lib/fetch.js";

const WxHelper = {

  session: undefined,

  currentSession: function() {
    return this.session;
  },
  login: function(onSuccess, onFail) {
    let self = this,
      session = self.currentSession();

    if (session) {
      wx.checkSession({
        success: function() {
          onSuccess(self.session);
        },
        fail() {
          self.doLogin(onSuccess, onFail);

        }
      });
    } else {
      self.doLogin(onSuccess, onFail);
    }
  },

  doLogin: function(onSuccess, onFail) {
    let self = this;
    wx.login({
      success: res => {
        var code = res.code;
        if (code) {
          fetch({
              url: '/login?code=' + code,
              method: 'post'
            })
            .then(res => {
              self.session = res.data;
              onSuccess(self.session);
            })

        } else {
          if (onFail) {
            onFail(res);
          }

        }
      }
    })
  }
};


export default WxHelper;