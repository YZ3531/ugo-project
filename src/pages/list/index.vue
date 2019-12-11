<template>
  <view>
    <!-- 筛选 -->
    <view class="filter">
      <text class="active">综合</text>
      <text>销量</text>
      <text>价格</text>
    </view>
    <!-- 商品列表 -->
    <!-- scrolltolower小程序区域滚动底部事件,滚动至底部||右边触发 -->
    <scroll-view class="goods" @scrolltolower="getMore" scroll-y>
      <view class="item" @click="goDetail" v-for="goods in goodList" :key="goods.goods_id">
        <!-- 商品图片 -->
        <image class="pic" :src="goods.goods_small_logo"></image>
        <!-- 商品信息 -->
        <view class="meta">
          <view class="name">{{goods.goods_name}}</view>
          <view class="price">
            <text>￥</text>{{goods.goods_price}}<text>.00</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
  export default {
    data () {
      return {
        query:null,
        // 初始分页信息
        pagenum:1, // 第几页
        pagesize:10, // 每页几条数据 
        // 商品列表
        goodList:[]
      }
    },
    methods: {
      goDetail () {
        uni.navigateTo({
          url: '/pages/goods/index'
        })
      },
      // 列表到底部,加载更多列表数据
      getMore(){
        // 页码+1
        this.pagenum += 1
        // 获取下一页数据
        this.getGoodsList(this.query)
      },
      // 获取商品列表页
      async getGoodsList(){
        const {message} = await this.request({
          url:"/api/public/v1/goods/search",
          data:{
            query:this.query,
            pagenum:this.pagenum,
            pagesize:this.pagesize
          }
        })
        // 更新初始数据,不建议采用push操作,因为是将一个数组中的数据添加到另一个数组里面
        this.goodList = this.goodList.concat(message.goods)
      }
    },
    onLoad(query){
      // 小程序中通过在onload中来获取传递到当前页面的参数
      // 保存地址栏传递来的参数
      this.query = query.query
      // 获取第一屏列表数据
      this.getGoodsList()
    },
    // 监听页面是否滚动到底部
    // 只对页面滚动有效
    // 页面滚动:当前窗口下内容滚动
    // 区域滚动:当前页面下某盒子内部内容滚动
    // onReachBottom(){
    //   console.log('666666666');
      
    // }
  }
</script>

<style scoped lang="scss">
  .filter {
    display: flex;
    height: 96rpx;
    line-height: 96rpx;
    border-bottom: 1rpx solid #ddd;

    /* #ifdef H5 */
    position: relative;
    z-index: 99;
    /* #endif */

    text {
      flex: 1;
      text-align: center;
      font-size: 30rpx;
      color: #333;

      &.active {
        color: #ea4451;
      }
    }
  }
  
  .goods {
    position: absolute;
    width: 100%;
    top: 97rpx;
    bottom: 0;
  }

  .item {
    display: flex;
    padding: 30rpx 20rpx 30rpx 0;
    margin-left: 20rpx;
    border-bottom: 1rpx solid #eee;

    &:last-child {
      border-bottom: none;
    }

    .pic {
      width: 200rpx;
      height: 200rpx;
      margin-right: 30rpx;
    }

    .meta {
      flex: 1;
      font-size: 27rpx;
      color: #333;
      position: relative;
    }

    .name {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .price {
      position: absolute;
      bottom: 0;

      color: #ea4451;
      font-size: 33rpx;

      text {
        font-size: 22rpx;
      }
    }
  }
</style>
