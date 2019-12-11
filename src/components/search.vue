<template>
  <!-- 搜索 -->
  <div class="search" :class="{focused: focused}">
    <!-- 搜索框 -->
    <div class="input-wrap" @click="goSearch">
      <!-- bindconfirm小程序特有事件,点击确定触发 -->
      <input 
        type="text" 
        :placeholder="placeholder"
        v-model="keyWords"
        @input="query"
        @confirm="goList"
      >
      <span class="cancle" @click.stop="cancleSearch">取消</span>
    </div>
    <!-- 搜索结果 -->
    <div class="content">
      <div class="title">搜索历史<span class="clear"></span></div>
      <div class="history">
        <navigator url="/pages/list/index" v-for="(item,index) in history" :key="index">{{item}}</navigator>
      </div>
      <!-- 结果 -->
      <scroll-view v-if="list.length" scroll-y class="result">
        <navigator url="/pages/goods/index" v-for="item in list" :key="item.goods_id">{{item.goods_name}}</navigator>
      </scroll-view>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        focused: false,
        // 提示信息
        placeholder: '',
        // 搜索建议
        list:[],
        // 搜索关键字
        keyWords:"",
        // 搜索历史记录
        history:uni.getStorageSync('history') || []
      }
    },
    methods: {
      // 监听用户输入操作,发送请求获取数据 
      async query(){
        const {message} = await this.request({
          url:"/api/public/v1/goods/qsearch",
          data:{
            query:this.keyWords
          }
        })
        this.list = message
        console.log(message);
        
        
      },
      // 点击确定去列表页
      goList(){
        // 小程序有专门实现本地存储的API
        // 追加到历史记录列表
        this.history.push(this.keyWords)
        // 去除重复
        this.history = [...new Set(this.history)]
        // 存入本地
        uni.setStorageSync('history',this.history) 

        // 小程序有专门实现跳转的API
        uni.navigateTo({
          // 页面跳转携带上关键字
          url:"/pages/list/index?query="+this.keyWords
        })
      },
      // 点击搜索
      goSearch (ev) {
        this.focused = true;
        // 提示信息
        this.placeholder = '请输入您要搜索的内容';
        
        // 触发父组件自定义事件
        this.$emit('search', {
          pageHeight: uni.getSystemInfoSync().windowHeight
        });

        // 隐藏tabBar
        // 通过此API控制tabBer的显示,实现在搜索页面不可切换tabBer功能
        uni.hideTabBar();
      },
      // 点击取消
      cancleSearch () {
        this.focused = false
        this.placeholder = ''
        // 清空搜索框
        this.keyWords = ""
        // 清空查询结果列表
        this.list = []
        // 关闭加载提示
        uni.hideLoading()

        // 触发父组件自定义事件
        this.$emit('search', {
          pageHeight: 'auto'
        });

        // 显示tabBar
        // 通过此API控制tabBer的显示,实现在搜索页面不可切换tabBer功能
        uni.showTabBar();
      }
    },
    // 小程序自定义组件中没有onload
    // onLoad(){
    //   this.history = uni.getStorageSync('history')||[]
    // }
  }
</script>

<style lang="scss" scoped>
  .search {
    display: flex;
    flex-direction: column;
    
    // 搜索框
    .input-wrap {
      display: flex;
      height: 100rpx;
      padding: 20rpx 30rpx;
      background-color: #ea4451;
      box-sizing: border-box;
      position: relative;

      &::before,
      &::after {
        height: 44rpx;
        line-height: 1;
        background-image: url(http://static.botue.com/ugo/images/icon_search%402x.png);
        background-size: 32rpx;
        background-position: 6rpx center;
        background-repeat: no-repeat;

        position: absolute;
        top: 28rpx;
        z-index: 9;
      }

      &::before {
        content: '搜索';
        display: block;

        width: 100rpx;
        padding: 11rpx 0 10rpx 44rpx;
        box-sizing: border-box;
        color: #666;
        font-size: 24rpx;
        left: 325rpx;
      }

      &::after {
        display: none;
        content: '';
        width: 44rpx;
        left: 40rpx;
      }

      input {
        flex: 1;
        height: 60rpx;
        padding: 0 20rpx 0 64rpx;
        background-color: #fff;
        border-radius: 8rpx;
        font-size: 24rpx;
        color: #666;
      }

      span.cancle {
        display: none;
        width: 80rpx;
        text-align: right;
        line-height: 60rpx;
        font-size: 27rpx;
        color: #666;
      }
    }

    // 搜索结果
    .content {
      display: none;
      flex: 1;
      padding: 27rpx;
      background-color: #fff;
      position: relative;

      .title {
        font-size: 27rpx;
        line-height: 1;
        color: #333;
      }

      .clear {
        display: block;
        width: 27rpx;
        height: 27rpx;
        float: right;
        background-image: url(http://static.botue.com/ugo/images/clear.png);
        background-size: cover;
      }

      .history {
        padding-top: 30rpx;

        navigator {
          display: inline-block;
          line-height: 1;
          padding: 15rpx 20rpx 12rpx;
          background-color: #ddd;
          font-size: 24rpx;
          margin-right: 20rpx;
          margin-bottom: 15rpx;
          color: #333;
        }
      }

      .result {
        // display: none;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: #fff;

        navigator {
          line-height: 1;
          padding: 20rpx 30rpx;
          font-size: 24rpx;
          color: #666;
          border-bottom: 1px solid #eee;

          &:last-child {
            border-bottom: none;
          }
        }
      }
    }
    
    // 获得焦点状态
    &.focused {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 9;

      .input-wrap {
        background-color: #eee;

        &::before {
          display: none;
        }

        &::after {
          display: block;
        }
      }

      span.cancle {
        display: block;
      }

      .content {
        display: block;
      }
    }
  }
</style>