<template>
  <div style="padding: 0 15px">
    <div v-popover:popover @click="visible = true" @blur="visible = false">
      <svg-icon icon-class="switch" />
    </div>
    <el-popover
      ref="popover"
      v-model="visible"
      placement="bottom-start"
      trigger="manual"
      popper-class="menuPopover"
    >
      <div class="MyMenuBlock">
        <menu-block
          :is-my="true"
          :sys_type="{'name':'我的'}"
          @closePopover="closePopover"
        />
        <menu-block
          v-for="(item, index) in kindList"
          :key="index"
          :is-my="false"
          :sys_type="item"
          @closePopover="closePopover"
        />
      </div>
    </el-popover>
  </div>
</template>

<script>
import menuBlock from './menuBlock'
import { getSysTypeList } from '@/api/system/sysType'
export default {
  name: 'SwitchSys',
  components: {
    menuBlock
  },
  data() {
    return {
      visible: false,
      kindList: []
    }
  },
  mounted() {
    getSysTypeList({ 'size': 500, page: 1 }).then((res) => {
      this.kindList = res.data
    })
  },
  methods: {
    // 判断是否有交集
    closePopover(param) {
      if (param) {
        this.visible = false
      } else {
        this.visible = true
      }
    }
  }
}
</script>

<style>
.menuPopover.el-popover {
  width: 600px;
  height: 500px;
  overflow: auto;
}
.MyMenuBlock {
  display: flex;
  flex-flow: column wrap;
  height: 100vh;
  max-height: 700px;
}
</style>
