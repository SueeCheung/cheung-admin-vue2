<!--
* @author 肖阳
* @time 2020-9-10
* @dec 生成流程绘制 基本节点(审批 抄送)组装逻辑
*  组装
-->
<script>
import AddNodeBtn from '@/components/myComponents/drawFlow/src/components/AddNodeBtn'
import RowFactory from '@/components/myComponents/drawFlow/src/components/DrawRow/FactoryRow'
// import EventBus from "@/components/ApprovalProcess/ProcessDesign/components/EventBus/EventBus";

import {
  RowNode,
  ConditionNode,
  CopyNode
} from './components/NodeConfigFactory/NodeFactory'
// import { deepClone } from "@/common/utils";
import FlowFactory from './components/factory'
import { transToTreeDat } from './utils'
import FlowNode from '@/components/myComponents/drawFlow/src/components/DrawRow/FlowNode'
import { isArray } from '@/utils/validate'
export default {
  name: 'FactoryDrawFlow',
  components: {
    AddNodeBtn,
    FlowNode
  },
  props: {
    FlowConfig: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      rectTypeDic: {
        1: '审批节点',
        2: '规则节点',
        3: '抄送人',
        4: '开始节点'
      },
      isColList: ['3', '5'],
      selfConfig: null,
      currentNode: null,
      // 缓存数据
      cacheData: null
    }
  },
  watch: {
    FlowConfig: {
      handler() {
        this.init()
      },
      deep: true
    }
  },
  created() {
    this.init()
    // this.creatBusNodeChange();  // 可用事件派发
  },
  destroyed() {
    // EventBus.$off("nodeChange");
  },
  methods: {
    // 节点数据变化事件
    nodeChange(node) {
      this.currentNode.name = node.name
      this.currentNode.content = node.content
      this.selfConfig.forEach(i => {
        if (i.id === this.currentNode.id) {
          i.data = node.data
          i.content = node.content
          i.name = node.name
        }
      })
      this.$forceUpdate()
    },
    /**
     * 添加条件框
     */
    addBranch(node) {
      const newNode = { type: 2, name: '条件分支', auditors: [], mode: 0, parent: node[0].parent, group: node[0].group, signing: false, own: false, conditions: null }
      this.$emit('createCondition', newNode, (data) => {
        const newNode = new CopyNode(data)
        this.selfConfig = this.selfConfig.concat([newNode])
      })
    },
    creatBusNodeChange() {
      // EventBus.$on("nodeChange", this.nodeChange);
    },
    /**
     * 获取传参数据结构
     */
    getResData() {
      const list = JSON.parse(JSON.stringify(this.selfConfig))
      this.transformTree(list)
      list.forEach(i => {
        if (i.isRow) {
          delete i.childNode
        }
      })
      return list
    },
    /**
     * 初始化 数据私有化
     */

    init() {
      this.selfConfig = JSON.parse(JSON.stringify(this.FlowConfig))
    },
    /**
     *  @param data  源数组一维数组
     *  @requires  tree 二维数组
     */
    transformTree(data) {
      return transToTreeDat(data)
    },
    clickSelectBox(nextNode) {
      const { node, selfConfig } = this.getNodeFactory(nextNode)
      this.selfConfig = selfConfig.concat(node)
    },
    /**
     * 根据isRow去判断row或者rol
     */
    getNodeFactory(nextNode) {
      if (isArray(nextNode)) {
        const { node, selfConfig } = this.getColNode(nextNode)
        return { node, selfConfig }
      } else if (nextNode.isRow) {
        const { node, selfConfig } = this.getRowNode(nextNode)
        return { node, selfConfig }
      }
    },
    /**
     * 获取row节点
     */
    getRowNode(nextNode) {
      const node = [new RowNode(nextNode)]
      const selfConfig = this.repickArr(node[0])
      // this.clickNode(node[0]);
      return { node, selfConfig }
    },
    /**
     * 获取col节点
     */
    getColNode(nextNode) {
      const node = []
      nextNode.forEach(item => {
        node.push(new ConditionNode({ ...item }))
      })
      const repickConfig = {
        parent: node[0].parent,
        id: node[0].id
      }
      const selfConfig = this.repickArr(repickConfig)
      this.locationScroll()
      return { node, selfConfig }
    },
    /**
     * 定位滚动条
     */
    locationScroll() {
      // window.location.hash = ".bottom-right-cover-line";
      const el = document.getElementsByClassName('dingflow-design')[0]
      setTimeout(() => {
        el.scrollLeft = el.scrollWidth - el.clientWidth + 340
      }, 0)
    },
    /**
     * 重定位数组
     */
    repickArr(newNode) {
      const selfConfig = JSON.parse(JSON.stringify(this.selfConfig))
      const updateNode = []
      selfConfig.forEach(i => {
        if (i.parent === newNode.parent) {
          i.parent = newNode.id
          updateNode.push(i.id)
        }
      })
      if (updateNode.length > 0) {
        this.$emit('updateNodes', updateNode, newNode.id)
      }
      return selfConfig
    },
    // 点击节点
    clickNode(nodeConfig) {
      this.currentNode = nodeConfig
      this.$emit('clickNode', nodeConfig)
    },
    // 点击关闭节点
    closeNode(node) {
      let ids = []
      let repickConfig = {}
      const selfConfig_bak = JSON.parse(JSON.stringify(this.selfConfig))
      if (node.isRow) {
        repickConfig.parent = node.parent
        repickConfig.id = node.id
        const selfConfig = JSON.parse(JSON.stringify(this.selfConfig))
        this.selfConfig = this.deleteNode(selfConfig, node)
        ids.push(node.id)
      } else {
        const res = this.deleteColNode(node)
        ids = res['ids']
        repickConfig = res['repickConfig']
      }
      this.$emit('delNodes', ids, (res) => {
        if (res) {
          this.repickDeleteArr(repickConfig)
        } else {
          this.selfConfig = selfConfig_bak
        }
      })
    },
    // 删除节点
    deleteNode(selfConfig, node) {
      selfConfig = selfConfig.map(i => i.id !== node.id && i).filter(Boolean)
      return selfConfig
    },
    // 单独删除col下node
    deleteColNode(node) {
      let selfConfig = JSON.parse(JSON.stringify(this.selfConfig))
      const nodeArr = selfConfig.filter(
        i => i.group === node.group && !i.isRow
      )
      let deleteArr = []
      let repickConfig = {}
      if (nodeArr.length > 2) {
        // 递归删除所有关联子节点
        deleteArr = [node]
        this.deleteLoop(selfConfig, node, deleteArr)
        repickConfig = {
          id: node.id,
          parent: node.parent,
          group: node.group
        }
      } else {
        // 删除整个group
        const allCol = selfConfig
          .map(i => i.group === node.group && !i.isRow && i)
          .filter(Boolean)
        deleteArr = allCol
        allCol.forEach(i => {
          this.deleteLoop(selfConfig, i, deleteArr)
        })
        repickConfig = {
          id: node.id,
          parent: node.parent,
          group: node.group
        }
      }
      const ids = []
      deleteArr.forEach(i => {
        selfConfig = this.deleteNode(selfConfig, i)
        ids.push(i.id)
      })
      this.selfConfig = selfConfig
      return { ids, repickConfig }
    },
    // 循环遍历删除组下关联节点
    deleteLoop(selfConfig, node, deleteArr) {
      // 获取当前节点下所有关联节点
      const currentDeleteArr = selfConfig.filter(i => {
        return i.parent === node.id
        // if (i.isRow) {
        //   return i.parent === node.id
        // } else {
        //   return i.groupPid === node.id || i.groupPid === node.groupId
        // }
      })
      if (currentDeleteArr.length) {
        currentDeleteArr.forEach(i => {
          deleteArr.push(i)
          this.deleteLoop(selfConfig, i, deleteArr)
        })
      } else {
        return
      }
    },
    // 删除后重组数组
    repickDeleteArr(repickConfig) {
      const selfConfig = JSON.parse(JSON.stringify(this.selfConfig))
      const updateNode = []
      selfConfig.forEach(i => {
        if (i.parent === repickConfig.id || i.parent === repickConfig.group) {
          i.parent = repickConfig.parent
          updateNode.push(i.id)
        }
      })
      if (updateNode.length > 0) {
        this.$emit('updateNodes', updateNode, repickConfig.parent)
      }
      this.selfConfig = selfConfig
    },
    // 绘制body
    drawBody(h, node) {
      if (node.childNode) {
        return FlowFactory.getFactory.bind(this, h, node.childNode)()
      } else {
        return <div></div>
      }
    }
  },
  render(h) {
    // this.init();
    let FlowConfig = JSON.parse(JSON.stringify(this.selfConfig))
    FlowConfig = this.transformTree(FlowConfig)
    this.cacheData = FlowConfig
    const root = JSON.parse(JSON.stringify(this.selfConfig[0]))
    return (
      <div class='design-engine'>
        <div class='dingflow-design'>
          <div class='ie-polyfill-container'>
            <div class='box-scale' id='box-scale'>
              <div class='begin-node'>
                <div class='begin-node-text'>流程开始</div>
                <div class='begin-node-circle'></div>
              </div>
              {RowFactory.nodeWrapRender.bind(this, h, root)()}
              {this.drawBody(h, FlowConfig[0])}
              <div class='end-node'>
                <div class='end-node-circle'></div>
                <div class='end-node-text'>流程结束</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
</script>

<style scoped lang="less">
.design-engine {
  position: relative;
  height: 100%;

  .dingflow-design {
    width: 100%;
    // background-color: #f5f5f7;
    overflow: auto;
    height: 100%;
    position: relative;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;

    /deep/ .ant-popover-arrow {
      display: none !important;
    }

    .ie-polyfill-container {
      display: -ms-grid;
      -ms-grid-columns: min-content;

      .box-scale {
        transform: scale(1);
        display: inline-block;
        position: relative;
        width: 100%;
        padding: 54.5px 0;
        -webkit-box-align: start;
        -ms-flex-align: start;
        align-items: flex-start;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
        min-width: -webkit-min-content;
        min-width: -moz-min-content;
        min-width: min-content;
        // background-color: #f5f5f7;
        -webkit-transform-origin: 0 0 0;
        transform-origin: 50% 0px 0px;

        .end-node {
          border-radius: 50%;
          font-size: 14px;
          color: rgba(25, 31, 37, 0.4);
          text-align: left;

          .end-node-circle {
            width: 10px;
            height: 10px;
            margin: auto;
            border-radius: 50%;
            background: #dbdcdc;
          }

          .end-node-text {
            margin-top: 5px;
            text-align: center;
          }
        }

        .begin-node {
          border-radius: 50%;
          font-size: 14px;
          color: rgba(25, 31, 37, 0.4);
          text-align: left;
          position: relative;

          &::before {
            content: "";
            position: absolute;
            top: 60px;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 0;
            margin: auto;
            width: 2px;
            height: 130%;
            background-color: #cacaca;
          }

          .begin-node-circle {
            width: 10px;
            height: 10px;
            margin: 10px auto 40px auto;
            border-radius: 50%;
            background: #dbdcdc;
          }

          .begin-node-text {
            text-align: center;
          }
        }
      }
    }
  }
}
</style>
