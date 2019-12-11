<template>
  <view :style="{height: pageHeight, overflow: 'hidden'}">
    <search @search="disableScroll" />
    <!-- 焦点图 -->
    <swiper class="banner" indicator-dots indicator-color="rgba(255, 255, 255, 0.6)" indicator-active-color="#fff">
      <swiper-item v-for="banner in bannerList" :key="banner.goods_id">
        <navigator :url="banner.navigator_url">
          <image :src="banner.image_src"></image>
        </navigator>
      </swiper-item>
    </swiper>
    <!-- 导航条 -->
    <view class="navs">
      <navigator v-for="nav in navList" :key="nav.name" :open-type="nav.open_type||'navigate'" :url="nav.navigator_url||'/pages/list/index?query='+nav.name">
        <image :src="nav.image_src"></image>
      </navigator>
    </view>
    <!-- 楼层 -->
    <view class="floors">
      <view class="floor" v-for="(floor,index) in floorList" :key="index">
        <view class="title">
          <image :src="floor.floor_title.image_src"></image>
        </view>
        <view class="items">
          <navigator url="/pages/list/index" v-for="product in floor.product_list" :key="product.name">
            <image :src="product.image_src"></image>
          </navigator>
        </view>
      </view>
     
    </view>
    <!-- 回到顶部 -->
    <!-- v-show在小程序中有bug,使用v-if -->
    <view class="goTop icon-top" v-if="scrollTop>200" @click="goTop"></view>
  </view>
</template>

<script>
  import search from '@/components/search';

  export default {

    data () {
      return {
        pageHeight: 'auto',
        // 轮播图初始化数据
        bannerList:[],
        // 主导航初始化数据
        navList:[],
        // 楼层初始化数据
        floorList:[],
        // 页面滚动距离
        scrollTop:0
      }
    },

    components: {
      search
    },
    
    methods: {
      disableScroll (ev) {
        this.pageHeight = ev.pageHeight + 'px';
      },
      // 获取轮播图数据
      async getBannerList(){
        const {message} =  await this.request({
          url:"/api/public/v1/home/swiperdata"
        })
        this.bannerList = message
      },
      // 获取导航数据
      async getNavList(){
        const {message} = await this.request({
          url:"/api/public/v1/home/catitems"
        })
        this.navList = message

      },
      // 获取楼层数据,
      async getFlootList(){
        const {message} = await this.request({
          url:"/api/public/v1/home/floordata"
        })
        this.floorList = message
      },
      // 回到顶部
      goTop(){
        // 调用API可以设置页面的滚动距离
        uni.pageScrollTo({scrollTop:0})
      }
    },
    // 加载
    async onLoad(){
      // 发送请求,获取首屏的数据
      this.getBannerList()
      this.getNavList()
      this.getFlootList()
      // 调用API开启转发功能
      uni.showShareMenu()
      // 自定义转发内容
    },
    // 监听下拉事件,获取数据并显示下拉动画(小程序自带)
    async onPullDownRefresh(){
      await this.getBannerList()
      await this.getNavList()
      await this.getFlootList()
      // 用于停止下拉刷新效果
      uni.stopPullDownRefresh()
    },
    // 监听用户滚动操作,到达指定距离显示回到顶部按钮 
    onPageScroll(ev){
      // 将滚动距离记录下来
      this.scrollTop = ev.scrollTop
    },
    // 当用户点击了转发执行
    onShareAppMessage(){
      // 该事件回调的返回值即为转发的自定义内容
      return {
        // 转发标题
        title:"江南皮革厂倒闭了!!!",
        // 转发携带图片
        imageUrl:"http://i1.hdslb.com/bfs/archive/7d8b831d5ea8c01e0c10c7161c9935ba8a27ddb0.jpg",
        // 点击转发进入页面
        path:"/pages/index/index"
      }
    }
  }
</script>

<style scoped lang="scss">
  .banner {
    width: 100%;
    height: 340rpx;

    image {
      width: 100%;
      height: 340rpx;
    }
  }

  .navs {
    display: flex;
    justify-content: space-between;
    padding: 30rpx 44rpx;

    image {
      width: 128rpx;
      height: 140rpx;
    }
  }

  .floor {

    .title {
      width: 750rpx;
      height: 60rpx;
      padding: 20rpx 0 0 8rpx;
      background-color: #f4f4f4;
    }

    .items {
      padding: 20rpx 16rpx;
      overflow: hidden;

      navigator {
        width: 193rpx;
        height: 188rpx;
        margin-left: 10rpx;
        margin-bottom: 10rpx;
        float: left;
      }

      navigator:first-child {
        width: 232rpx;
        height: 386rpx;
        margin-left: 0rpx;
      }

      navigator:nth-child(2),
      navigator:nth-child(5) {
        width: 273rpx;
      }
    }

    &:first-child {

      .items {

        navigator {
          width: 233rpx;
        }
      }
    }
  }

  .goTop {
    position: fixed;
    bottom: 30rpx;
    /* #ifdef H5 */
    bottom: 65px;
    /* #endif */
    right: 30rpx;
  
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100rpx;
    height: 100rpx;
    font-size: 48rpx;
    color: #666;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.8);
  }
</style>