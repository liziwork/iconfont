interface EventInterface {
    click(event: any): void

    _request(params: RequestParamsInterface): void

    _toast(title: string, icon?: 'success' | 'loading' | 'none'): void
}

interface RequestParamsInterface {
    url: string
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
}

interface ResultInterface {
    code: number
    result: IconDataInterface[]
}

interface IconDataInterface {
    id: number
    name: string
    font_class: string
    project_id?: number
    projectId?: number
    show_svg?: string
    unicode?: number | string
    freeze?: number
    path_attributes?: string
}

interface DataInterface {
    iconList: []
    iconIndex: number
}


Page<DataInterface, EventInterface>({
    data: {
        iconList: [],
        iconIndex: 0
    },
    async onLoad() {
        try {
            let iconList = wx.getStorageSync('iconfont')
            if (!iconList) {
                iconList = await this._request({
                    url: 'https://api.myjson.com/bins/jpwyn',
                    method: 'GET'
                })
            }
            this.setData!({iconList})
        } catch (e) {
            this._toast(e)
        }
    },
    click({currentTarget: {dataset: {index}}}: any): void {
        if (this.data!.iconIndex !== index) this.setData!({iconIndex: index})
    },
    _request({url, method}: RequestParamsInterface): Promise<IconDataInterface[]> {
        return new Promise((resolve, reject) => {
            wx.request({
                url,
                method,
                success: ({statusCode, data}: any) => {
                    let {code, result}: ResultInterface = data
                    if (statusCode === 200 && code === 200) {
                        let list: IconDataInterface[] = []
                        result.map(({id, name, font_class}: IconDataInterface) => list.push({id, name, font_class}))
                        try {
                            wx.setStorageSync('iconfont', list)
                        } catch (e) {
                            this._toast(e)
                        }
                        resolve(list)
                    } else {
                        reject(new Error('请求失败'))
                    }
                },
                fail: (error: object) => reject(error)
            })
        })
    },
    _toast(title: string, icon = 'none'): void {
        wx.showToast({
            title,
            icon
        })
    }
})
