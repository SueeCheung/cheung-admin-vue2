<!--
* @author 肖阳
* @time 2020-9-10
* @dec 添加新增节点按钮
-->
<template>
  <div class="add-node-popover">
    <div class="add-node-popover-body">
      <a v-for="(item,index) in boxArr" :key="index" :class="item.className" class="add-node-popover-item" @click="clickSelectBox(item)">
        <div class="item-wrapper">
          <i :class="'iconfont '+item.icon" />
        </div>
        <span>{{ item.value }}</span>
      </a>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import './addBox.less'

export default {
  name: 'AddBox',
  props: {
    nodeConfig: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      boxArr: [
        {
          type: 1,
          value: '审批',
          isRow: true,
          className: 'approver',
          icon: 'el-icon-user'
        },
        // {
        //   type: 2,
        //   value: '条件分支',
        //   isRow: false,
        //   className: 'route',
        //   icon: 'el-icon-s-operation'
        // },
        {
          type: 3,
          value: '确认',
          isRow: true,
          className: 'notifier',
          icon: 'el-icon-edit'
        }
      ]
    }
  },
  methods: {
    clickSelectBox(item) {
      let node = {}
      if (item.type === 1) {
        node = { type: 1, name: '审批', auditors: [], mode: 0, parent: this.nodeConfig.id, signing: true, own: false, conditions: null }
        this.$bus.$emit('clickSelectBox', node)
      } else if (item.type === 3) {
        node = { type: 3, name: '确认', auditors: [], mode: 0, parent: this.nodeConfig.id, signing: true, own: true, conditions: null }
        this.$bus.$emit('clickSelectBox', node)
      } else if (item.type === 2) {
        node = { type: 2, name: '条件分支', auditors: [], mode: 0, parent: this.nodeConfig.id, signing: false, own: false, conditions: null }
        this.$bus.$emit('createConditions', 2, node)
      }
      this.$emit('closePopover')
    }
  }
}
</script>
