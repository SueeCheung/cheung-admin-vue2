<!--
* @author 肖阳
* @time 2020-9-10
* @dec 多列生成流程中 添加节点的图标
-->
<template>
  <div class="add-node-btn-box">
    <div class="add-node-btn">
      <el-popover v-model="popoverVisible" placement="right" trigger="click" visible-arrow :offset="offset">
        <add-box :node-config="belongToNode" @closePopover="closePopover" />
        <button slot="reference" class="btn" type="button">
          <i class="el-icon-plus" style="color:#ffff" />
        </button>
      </el-popover>
    </div>
  </div>
</template>

<script>
import AddBox from '@/components/myComponents/drawFlow/src/components/DrawAddSelectBox/DrawAddBox.vue'
export default {
  name: 'AddNodeBtn',
  components: {
    AddBox
  },
  props: {
    belongToNode: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      popoverVisible: false,
      offset: 50
    }
  },
  mounted() {},
  methods: {
    getPopupContainer() {
      const el = document.getElementsByClassName('dingflow-design')[0]
      return el
    },
    closePopover() {
      this.popoverVisible = false
    }
  }
}
</script>

<style scoped lang="less">
.add-node-btn-box {
  width: 240px;
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -ms-flex-negative: 0;
  flex-shrink: 0;
  -webkit-box-flex: 1;
  -ms-flex-positive: 1;
  position: relative;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
    margin: auto;
    width: 2px;
    height: 100%;
    background-color: #cacaca;
  }
  .add-node-btn {
    user-select: none;
    width: 240px;
    padding: 20px 0px 32px;
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    flex-shrink: 0;
    -webkit-box-flex: 1;
    flex-grow: 1;
    .btn {
      outline: none;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
      width: 30px;
      height: 30px;
      background: #3296fa;
      border-radius: 50%;
      position: relative;
      border: none;
      line-height: 30px;
      -webkit-transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      &:hover {
        transform: scale(1.3);
        box-shadow: 0 13px 27px 0 rgba(0, 0, 0, 0.1);
      }
      .iconfont {
        color: #fff;
        font-size: 16px;
      }
    }
  }
}
</style>
