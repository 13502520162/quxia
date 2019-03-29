export default function() {
  try {
    let permissionss = wx.getStorageSync('permissions');
    if (permissionss != '') {
      return permissionss.admin || permissionss.permissions;
    }
  } catch (err) {
    console.error(err);
  }
};