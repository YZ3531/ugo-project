export default function(Vue,config){
    // 对uni.request进行封装
    return function(){
        // 解构出基准地址
        const {baseURL} = config
        // 封装请求,挂载到vue原型上去
        Vue.prototype.request = async function(params){
            // 解构出发请求时传入参数
            const {url} = params
            // 调用uni封装的请求 发送请求
            const res = await uni.request({
                url:baseURL + url
            })
            return res[1].data;
        }
        
    }
}