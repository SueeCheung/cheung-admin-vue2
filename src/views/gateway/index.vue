<template>
  <div class="loader">
    <el-header class="logoColumn" height="40px">
      <el-button type="info" @click.native="logout">退出</el-button>
    </el-header>
    <el-tabs v-model="activeName" stretch>
      <el-tab-pane label="我的" name="我的">
        <el-row :gutter="100" class="elRow">
          <template v-for="item in routeList">
            <el-col :key="item.id" :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
              <portal
                v-if="!getIntersect(item.meta.roles) && !item.hidden"
                :route="item"
                :disabled="false"
              />
            </el-col>
          </template>
        </el-row>
      </el-tab-pane>

      <el-tab-pane
        v-for="(item, index) in kindList"
        :key="index"
        :label="item.name"
        :name="item.name"
      >
        <el-row class="elRow" :gutter="100">
          <template v-for="item1 in routeList">
            <el-col
              v-if="item.id === item1.sys_type"
              :key="item1.id"
              :xs="24"
              :sm="12"
              :md="8"
              :lg="6"
              :xl="4"
            >
              <portal
                :route="item1"
                :disabled="getIntersect(item1.meta.roles)"
              />
            </el-col>
          </template>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import portal from '@/components/myComponents/portalModule'
import { getSysTypeList } from '@/api/system/sysType'

export default {
  components: { portal },
  data() {
    return {
      routeList: this.$store.state.permission.allRoutes,
      roles: this.$store.state.user.roles,
      kindList: [],
      activeName: '我的'
    }
  },
  mounted() {
    getSysTypeList({ 'size': 500, page: 1 }).then((res) => {
      this.kindList = res.data
    })
  },
  methods: {
    // 判断是否有交集
    getIntersect(routeRoles) {
      routeRoles = new Set(routeRoles)
      const roles = new Set(this.roles)
      const intersect = new Set([...roles].filter((x) => routeRoles.has(x)))
      if (roles.has('超级管理员')) {
        return false
      } else {
        return !(intersect.size > 0)
      }
    },
    logout() {
      this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>
<style lang="scss">
.loader {
  height: 100%;
  background-size: 100% 100%;
  background-image: url(../../icons/jpg/Bglogin.jpg);
  display: flex;
  flex-wrap: wrap;
  overflow: auto;

  .el-tabs {
    width: 70%;
    position: fixed;
    top: 0;
    left: 50%;
    bottom: 0;
    transform: translate(-50%);
    opacity: 0.8;

    .el-tabs__item {
      color: #000;

      &:hover,
      &:focus,
      &.is-active {
        color: #4ba9f2;
      }
    }

    .el-tabs__content {
      background-color: #fff;
      height: 100%;
    }

    .el-tabs__header {
      margin: 0;
    }
  }

  .elRow {
    margin: 0 !important;
  }

  .logoColumn {
    display: flex;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.5);
    border-bottom: 2px solid #dfe4ed;

    .el-button {
      margin-left: auto;
      margin-top: auto;
      margin-bottom: auto;
    }
  }
}
</style>
