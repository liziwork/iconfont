"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Page({
    data: {
        iconList: [],
        iconIndex: 0
    },
    onLoad() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let iconList = wx.getStorageSync('iconfont');
                if (!iconList) {
                    iconList = yield this._request({
                        url: 'https://api.myjson.com/bins/jpwyn',
                        method: 'GET'
                    });
                }
                this.setData({ iconList });
            }
            catch (e) {
                this._toast(e);
            }
        });
    },
    click({ currentTarget: { dataset: { index } } }) {
        if (this.data.iconIndex !== index)
            this.setData({ iconIndex: index });
    },
    _request({ url, method }) {
        return new Promise((resolve, reject) => {
            wx.request({
                url,
                method,
                success: ({ statusCode, data }) => {
                    let { code, result } = data;
                    if (statusCode === 200 && code === 200) {
                        let list = [];
                        result.map(({ id, name, font_class }) => list.push({ id, name, font_class }));
                        try {
                            wx.setStorageSync('iconfont', list);
                        }
                        catch (e) {
                            this._toast(e);
                        }
                        resolve(list);
                    }
                    else {
                        reject(new Error('请求失败'));
                    }
                },
                fail: (error) => reject(error)
            });
        });
    },
    _toast(title, icon = 'none') {
        wx.showToast({
            title,
            icon
        });
    }
});
