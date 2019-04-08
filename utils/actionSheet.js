let IS_ANDROID = false;

wx.getSystemInfo({
    success(res) {
        IS_ANDROID = res.platform === 'android';
    }
});

const ActionSheet = {

    show: function (items, context) {
        if (!items || items.length === 0) {
            return;
        }

        var args = [];
        if (arguments.length > 2) {
            for (var i = 2; i < arguments.length; i++) {
                args.push(arguments[i]);
            }
        }


        let itemNames = [], validItems = [];
        items.forEach((item)=> {

            if (
                (!item.hasOwnProperty('test'))
                || (typeof item.test === 'function' && item.test.apply(context, args) === true)
            ) {
                itemNames.push(item.name || '');
                validItems.push(item);
            }


        });

        if (IS_ANDROID) {
            itemNames.push('取消');
        }


        wx.showActionSheet({
            itemList: itemNames,
            success: res => {
                if (!res.cancel) {
                    let index = res.tapIndex;

                    if (index >= validItems.length) {
                        return;
                    }

                    let item = validItems[index];
                    if (item.click && typeof item.click === 'function') {
                        item.click.apply(context, args);
                    }
                }
            }
        })

    }

};


export default ActionSheet;