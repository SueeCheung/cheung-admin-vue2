<template>
  <div class="MenuBlock">
    <b>{{ sys_type.name }}</b>
    <template v-for="(item, index) in portalList">
      <template v-if="isMy">
        <div
          v-if="!getIntersect(item.meta.roles) && item.meta.title!=404"
          :key="index"
          class="myPortalList"
          @click="jump(item)"
        >
          <span class="mySpan">
            <svg-icon :icon-class="item.meta.icon" /> {{ item.meta.title }}
          </span>
        </div>
      </template>
      <template v-else>
        <div
          v-if="sys_type.id === item.sys_type"
          :key="index"
          :class="getIntersect(item.meta.roles) ? 'disabled' : 'myPortalList'"
          @click="getIntersect(item.meta.roles) ? '' : jump(item)"
        >
          <span class="mySpan">
            <svg-icon :icon-class="item.meta.icon" /> {{ item.meta.title }}
          </span>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    sys_type: {
      type: Object,
      required: true
    },
    isMy: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      portalList: this.$store.state.permission.allRoutes,
      roles: this.$store.state.user.roles
    }
  },
  methods: {
    // 判断是否有交集
    getIntersect(rights) {
      rights = new Set(rights)
      const roles = new Set(this.roles)
      const intersect = new Set([...roles].filter((x) => rights.has(x)))
      if (roles.has('超级管理员')) {
        return false
      } else {
        return !(intersect.size > 0)
      }
    },
    jump(item) {
      if (this.$route.path !== item.redirect) {
        this.$emit('closePopover', item)
        this.$store.dispatch('tagsView/delAllViews')
        this.$store.dispatch('permission/currentRoutes', {
          roles: this.$store.state.user.roles,
          forefathers_id: item.meta.forefathers_id
        })
        this.$router.push({ path: item.redirect })
      }
    }
  }
}
</script>
<style lang="scss">
.MenuBlock {
  width: 200px;
  margin: 10px;
  width: calc(100% / 3 - 20px);
  border-bottom: 2px solid #e2e1e1;
  b {
    width: 200px;
  }
  .myPortalList {
    height: 30px;
    width: 200px;
    display: flex;
    cursor: pointer;
    font-size: 14px;
    font-size: var(--font-size-14);
    transition: all 0.15s linear;
    &:hover {
      color: #4ba9f2;
    }
    .mySpan {
      margin-bottom: auto;
      margin-top: auto;
      margin-left: 20px;
      margin-right: 20px;
    }
  }
  .disabled {
    @extend .myPortalList;
    opacity: 0.5;
    &:hover {
      color: #000;
      cursor: not-allowed;
    }
  }
}
</style>
