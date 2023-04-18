<template>
  <div
    :class="{ disabled: disabled, btn: !disabled }"
    @click="disabled ? '' : jump(route)"
  >
    <li :class="route.icon" class="icon">
      <span class="svg-container">
        <svg-icon :icon-class="route.meta.icon" />
      </span>
      <span class="metaTitle">
        {{ route.meta.title }}
      </span>
    </li>
  </div>
</template>

<script>
export default {
  props: ['route', 'disabled'],
  data() {
    return {}
  },
  methods: {
    jump(route) {
      this.$store.dispatch('tagsView/delAllViews')
      // this.$store.dispatch('permission/currentRoutes', {
      //   roles: this.$store.state.user.roles,
      //   forefathers_id: route.meta.forefathers_id
      // })
      this.$router.push({ path: route.redirect })
    }
  }
}
</script>

<style lang="scss" scoped>
.btn {
  border: 1px solid #dad7d7;
  height: 120px;
  width: 150px;
  background-color: rgba(255, 255, 255, 0.5);
  color: #000;
  border-radius: 15px;
  margin-top: 20px;
  cursor: pointer;
  &:hover {
    color: #4ba9f2;
    border: 1px solid #4ba9f2;
  }
  .icon {
    height: 120px;
    width: 150px;
    display: grid;
    list-style: none;
    .svg-container {
      margin: auto;
      font-size: 50px;
    }
    .metaTitle {
      // width: 100%;
      text-align: center;
      font-size: 16px;
    }
  }
}
.disabled {
  @extend .btn;
  background-color: rgb(233, 231, 231);
  opacity: 0.5;
  &:hover {
    color: #000;
    border: 1px solid #dad7d7;
    cursor: not-allowed;
  }
}
</style>
