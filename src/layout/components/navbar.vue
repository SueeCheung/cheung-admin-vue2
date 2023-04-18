<template>
  <div class="navbar">
    <!-- 菜单栏伸缩 -->
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <switch-sys class="switch-sys" />
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <div class="right-menu">
<!--      <div class="ldBox" @click="addEventClick">-->
<!--        <img :src="require('@/icons/png/ld.png')" alt="">-->
<!--        <span v-if="isDot" class="numBox" />-->
<!--      </div>-->
      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <el-avatar :size="35" :src="user_info.avatar.file" />
          <span style="font-size: 13px; margin-left: 5px">{{
            user_info.name
          }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <span style="display: block" @click="openCenter">个人中心</span>
          </el-dropdown-item>
<!--          <el-dropdown-item>-->
<!--            <span style="display: block" @click="toApprovalTask">审批任务</span>-->
<!--          </el-dropdown-item>-->
          <el-dropdown-item>
            <span
              style="display: block"
              @click="openSetPassword"
            >修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item @click.native="logout">
            <span style="display: block">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <center ref="center" />
    <set-pass-word ref="password" />
    <messages ref="messages" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import breadcrumb from '@/components/breadcrumb'
import switchSys from '@/components/myComponents/switchSys'
import hamburger from '@/components/hamburger'
import center from '@/layout/components/dropdownView/center'
import setPassWord from '@/layout/components/dropdownView/setPassWord'
import messages from '@/layout/components/messages'
import { getHasMessage } from '@/api/message/sysMessage'

export default {
  components: {
    breadcrumb,
    hamburger,
    center,
    setPassWord,
    switchSys,
    messages
  },
  data() {
    return {
      isDot: false,
      timer: null
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'user_info'])
  },
  mounted() {
    // this.getHasMessage()
    // this.timer = setInterval(() => {
    //   this.getHasMessage()
    // }, 5000)
  },
  destroyed() {
    clearInterval(this.timer)
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    logout() {
      this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    toApprovalTask() {
      if (this.$route.name === 'approval') {
        return
      }
      this.$router.push({ name: 'approval', params: { forefathers_id: this.$route.meta.forefathers_id }})
    },
    openCenter() {
      this.$refs.center.openDialog()
    },
    openSetPassword() {
      this.$refs.password.openDialog()
    },
    addEventClick() {
      this.$refs.messages.openDrawer()
    },
    closeSidebar(evt) {
      const parent = evt.target.closest('.rightPanel')
      if (!parent) {
        this.show = false
        window.removeEventListener('click', this.closeSidebar)
      }
    },
    getHasMessage() {
      getHasMessage().then((response) => {
        const { data } = response
        this.isDot = data.has_msg
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }
  .switch-sys {
    line-height: 48px;
    height: 100%;
    float: left;
    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }
  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    display: flex;
    .ldBox{
      display: flex;
      align-items: center;
      padding: 0px 15px;
      &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
      img{
        width: 20px;
        height: 20px;
      }
      .numBox{
        position: absolute;
        width: 6px;
        height: 6px;
        background: red;
        color: #fff;
        text-align: center;
        line-height: 16px;
        font-size: 12px;
        border-radius: 50%;
        top: 8px;
        transform: translateX(16px);
      }
    }
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;
      display: flex;
      .avatar-wrapper {
        position: relative;
        display: flex;
        align-items: center;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 18px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
