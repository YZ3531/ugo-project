<template>
  <view v-if="topCategories.length">
    <!-- 搜索 -->
    <search />
    <!-- 分类 -->
    <view class="category">
      <!-- 顶级分类 -->
      <view class="sup">
        <scroll-view scroll-y>
          <text :class="{active:currentIndex===index}" @click="getChildCategories(index)" v-for="(top,index) in topCategories" :key="top.cat_id">{{top.cat_name}}</text>
        </scroll-view>
      </view>
      <!-- 子级分类 -->
      <view class="sub">
        <scroll-view scroll-y>
          <!-- 封面图 -->
          <image src="http://static.botue.com/ugo/uploads/category.png" class="thumb"></image>
          <view class="children" v-for="child in childCategories" :key="child.cat_id">
            <view class="title">{{child.cat_name}}</view>
            <!-- 品牌 -->
            <view class="brands">
              <navigator url="/pages/list/index" v-for="brand in child.children" :key="brand.cat_pid">
                <image :src="brand.cat_icon"></image>
                <text>{{brand.cat_name}}</text>
              </navigator>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
  import search from '@/components/search';

  export default {
    data () {
      return {
        // 顶级分类列表
        topCategories:[],
        // 当前二级分类对应的索引值  
        currentIndex:0
      }
    },
    components: {
      search
    },
    methods:{
      // 获取顶级分类(一级分类,右侧)
      async getTopCategories(){
        const {message} = await this.request({
          url:"/api/public/v1/categories"
        })
        this.topCategories = message
        console.log(message);
        
      },
      // 顶级分类的点击事件
      getChildCategories(index){
        // 注意 : 使用索引值来判断点击的是哪一个一级分类
        // 展示对应的二级分类,并根据索引判断哪个一级分类
        // 需要加上选中样式
        this.currentIndex = index
      }
    },
    computed:{
      // 计算对应一级分类下的二级分类列表
      childCategories(){
        return this.topCategories.length && this.topCategories[this.currentIndex].children
      }
    },
    onLoad(){
      this.getTopCategories()
    }
  }
</script>

<style scoped lang="scss">
  scroll-view {
    height: 100%;
  }

  .category {
    display: flex;
    width: 100%;
    position: absolute;
    top: 100rpx;
    bottom: 0;

    .sup {
      width: 196rpx;
      background-color: #f4f4f4;

      text {
        display: block;
        height: 100rpx;
        text-align: center;
        line-height: 100rpx;
        font-size: 27rpx;
        color: #333;
        border-bottom: 1rpx solid #eee;

        &:last-child {
          border-bottom: none;
        }
        
        &.active {
          background-color: #FFF;
          color: #ea4451;
          position: relative;

          &::before {
            content: '';
            display: block;
            width: 8rpx;
            height: 60rpx;
            transform: translateY(-50%);
            background-color: #ea4451;

            position: absolute;
            left: 0;
            top: 50%;
          }
        }
      }
    }

    .sub {
      flex: 1;
      padding: 20rpx 18rpx;

      .thumb {
        width: 100%;
        height: 180rpx;
      }

      .children {
        text-align: center;
        color: #333;

        .title {
          display: inline-block;
          margin: 40rpx 0 20rpx;
          font-size: 30rpx;

          &::before {
            content: '/';
            margin-right: 20rpx;
            color: #666;
          }

          &::after {
            content: '/';
            margin-left: 20rpx;
            color: #666;
          }
        }
      }

      .brands {
        display: flex;
        flex-wrap: wrap;

        navigator {
          width: 33%;
          margin-bottom: 20rpx;
        }

        image {
          width: 120rpx;
          height: 120rpx;
        }

        text {
          display: block;
          font-size: 24rpx;
        }
      }
    }
  }
</style>
