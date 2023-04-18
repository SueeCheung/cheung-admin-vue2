<template>
  <el-drawer
    title="我是标题"
    :visible.sync="drawer"
    :with-header="false"
    :size="300"
    :modal-append-to-body="false"
  >
    <div class="rightTab">
      <div class="listTab">
        <el-tabs v-model="activeName" @tab-click="tabChange">
          <el-tab-pane label="全部通知" name="first" />
          <el-tab-pane label="未读通知" name="second" />
          <el-tab-pane label="已读通知" name="third" />
        </el-tabs>
        <div class="btnTab" name="fourth" @click="readAll">
          <span slot="label" class="svg-container">
            <el-link :underline="false">
              <el-tooltip class="item" effect="dark" content="一键已读" placement="bottom-end">
                <svg-icon icon-class="eliminate" />
              </el-tooltip>
            </el-link>
          </span>
        </div>
      </div>
      <div v-if="dataList.length>0" v-infinite-scroll="getList" class="listBox">
        <div
          v-for="(item, index) in dataList"
          :key="index"
          class="box"
          @click="SeeInformation(item)"
        >
          <p>系统管理员</p>
          <p class="content">{{ item.content }}</p>
          <div class="functionBox">
            <div class="time"><span :class="!item.is_read?'read':'unread'" /> {{ item.send_time| timeFormatter }}</div>
            <span class="dle" @click="delItem(item,index)">删除</span>
          </div>
        </div>
      </div>
      <el-empty v-else description="暂无消息" :image-size="42" style="padding-top: 50%" />
    </div>
  </el-drawer>
</template>
<script>
import { getSysMessageList, updateSysMessage, deleteSysMessage, readMessage } from '@/api/message/sysMessage'
import { mapGetters } from 'vuex'
export default {
  props: {},
  data() {
    return {
      activeName: 'first',
      drawer: false,
      dataList: [],
      count: 0,
      page: 1,
      searchDate: {}
    }
  },
  computed: {
    ...mapGetters([
      'user_info'
    ])
  },
  watch: {
    drawer(val) {
      if (val) {
        this.getList()
      }
    }
  },
  methods: {
    readAll() {
      readMessage().then((res) => {
        this.dataList.forEach(data => {
          data.is_read = true
        })
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    },
    tabChange(e) {
      const index = e.index
      this.searchDate = {}
      if (index === '1') {
        this.searchDate['is_read'] = 0
      } else if (index === '2') {
        this.searchDate['is_read'] = 1
      }
      this.dataList = []
      this.page = 1
      this.getList()
    },
    openDrawer() {
      this.drawer = true
    },
    // 获取数据
    getList() {
      // //console.log(this.dataList.length, this.count, this.page)
      if (this.count === 0 || this.dataList.length < this.count) {
        getSysMessageList({ recv_id: this.user_info.id, page: this.page, size: 20, ...this.searchDate }).then((response) => {
          const { data, count } = response
          this.page += 1
          this.count = count
          this.dataList.push(...data)
        })
      }
    },
    SeeInformation(item) {
      if (item.type === 1) {
        if (item.link === '/approval') {
          if (this.$route.meta.forefathers_id) {
            this.$router.push({ name: 'approval', params: { forefathers_id: this.$route.meta.forefathers_id }})
          }
        } else {
          this.$router.push({ path: item.link })
        }
      }
      // this.drawer = false
      if (!item.is_read) {
        updateSysMessage(item.id, { is_read: true }).then(() => {
          item.is_read = true
        })
      }
    },
    delItem(item, index) {
      deleteSysMessage(item.id).then(response => {
        this.dataList.splice(index, 1)
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      })
    }
  }
}
</script>
<style>
.rightTab .el-tabs__nav-scroll{
  padding: 0 20px;
}
.rightTab .el-tabs__item{
    padding: 0 24px 0 0 !important;
    font-size: 12px;
  }
 .rightTab  .el-tabs__header{
   margin: 0;
 }
.rightTab .svg-container{
  font-size: 18px;
}

</style>
<style lang="scss">
.rightTab{
  background-color: #eee;
  min-height: 100vh;
  .listTab{
    width: 100%;
    background: #fff;
    position: absolute;
    top: 0;
    z-index: 9;
    display: flex;
    align-items: center;
  }
  .btnTab{
    flex: 1;
  }
.listBox {
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding-top: 60px;
  .box:hover{
    height: 100px;
    width: 260px;

  }
  .box{
    width: 232px;
    height: 80px;
    background: #FFFFFF;
    border-radius: 8px;
    margin-bottom: 10px;
    box-sizing: border-box;
    padding: 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    cursor: pointer;
    p{
      margin: 0;
      padding: 0;
      font-size: 12px;
    }
    .content {
      text-overflow: ellipsis;
      margin-top: 4px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;

      display: -moz-box;
      -moz-line-clamp: 2;
      -moz-box-orient: vertical;

      overflow-wrap: break-word;
      word-break: break-all;
      white-space: normal;
      overflow: hidden;
    }
    .functionBox{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 4px;
      .time{
        font-size: 11px;
        color: #7C7C7C;
        //transform: scale(0.8) translateX(-12px);
        .unread{
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: gray;
        }
        .read{
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: red;
        }
      }
      .dle{
        font-size: 12px;
      }
      .dle:hover{
        color: #4183DA;
      }
    }
  }
  // .box {
  //   width: 86%;
  //   background: #fff;
  //   margin-top: 10px;
  //   border-radius: 20px;
  //   padding: 12px 16px;
  //   .myTips {
  //     height: 24px;
  //     line-height: 24px;
  //     border-radius: 20px;
  //     font-size: 11px;
  //     background: red;
  //     color: #fff;
  //     padding: 0 6px;
  //   }
  //   .read {
  //     background: #eee;
  //     color: #000;
  //   }
  //   .imgText {
  //     display: flex;
  //     align-items: center;
  //     justify-content: center;
  //     .imgBox {
  //       width: 24px;
  //       height: 24px;
  //       background: #eee;
  //       border-radius: 50%;
  //       margin-right: 6px;
  //     }
  //   }
  //   p {
  //     font-size: 12px;
  //     margin: 0;
  //   }
  //   .tip {
  //     font-weight: 400;
  //     font-size: 12px;
  //     text-align: center;
  //     margin-top: 6px;
  //   }
  //   .myDate {
  //     font-weight: 400;
  //     font-size: 12px;
  //     text-align: right;
  //     margin-top: 6px;
  //   }
  // }
}
}
</style>
