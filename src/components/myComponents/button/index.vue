<template>
  <div class="myButton">
    <template v-for="(item, index) in buttonConfig">
      <!-- 下拉框 -->
      <el-dropdown v-if="item.type === 'dropdown'" :key="index" v-permission="item.permission" :disabled="item.disabled" :split-button="item.func!==undefined" :type="item.buttonType" @click="handleOperation(item.func)">
        <template v-if="item.func===undefined">
          <el-button :type="item.buttonType" :icon="item.icon">
            {{ item.label }}<i class="el-icon-arrow-down el-icon--right" />
          </el-button>
        </template>
        <template v-else>
          <i :class="item.icon" class="el-icon--left" />{{ item.label }}
        </template>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item1, index1) in item.list" :key="index1" v-permission="item1.permission" @click.native="handleOperation(item1.func, item1.funcType)">{{ item1.label }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- 普通按钮 -->
      <el-button
        v-else-if="item.type==='button'"
        :key="index"
        v-permission="item.permission"
        :type="item.buttonType"
        :icon="item.icon"
        :disabled="item.disabled"
        @click.stop="handleOperation(item.func)"
      >
        {{ item.label }}
      </el-button>
    </template>
  </div>
</template>
<script>
export default {
  props: {
    buttonConfig: {
      type: Array,
      required: true
    }
  },
  data() {
    return {}
  },
  methods: {
    handleOperation(func, funcType) {
      this.$emit(func)
      if (funcType) {
        this.$bus.$emit('changeFormType', funcType)
      }
    }
  }
}
</script>
