export default function () {
  try {
    return wx.getStorageSync('permissions');
  } catch (err){
    console.error(err);
  }
};

