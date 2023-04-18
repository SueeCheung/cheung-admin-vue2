/**
 * @author 肖阳
 * @time 2020-9-10
 * @dec row节点包裹框
 */
import './row.less'
import drawFlow from '../factory'
export default {
  /**
   *
   * @param {creatElement} h
   * @param {Object} nodeConfig
   */
  nodeWrapRender(h, nodeConfig) {
    const tep = []
    tep.push(
      <div class='node-wrap'>
        <flow-node
          {...{
            props: { nodeConfig },
            on: {
              clickNode: this.clickNode,
              closeNode: this.closeNode
            }
          }}
        ></flow-node>
        <add-node-btn
          {...{
            props: { belongToNode: nodeConfig },
            on: {
              clickSelectBox: this.clickSelectBox
            }
          }}
        ></add-node-btn>
      </div>
    )
    if (nodeConfig.isRoot) {
      return tep
    }
    if (nodeConfig.childNode) {
      const el = drawFlow.getFactory.bind(this, h, nodeConfig.childNode)()
      tep.push(el)
    }
    return tep
  }
}
