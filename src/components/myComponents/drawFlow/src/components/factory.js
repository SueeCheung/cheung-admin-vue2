import RowFactory from '@/components/myComponents/drawFlow/src/components/DrawRow/FactoryRow'
import ColFactory from './DrawCol/FactoryCol'
function getFactory(h, item) {
  const tep = []
  if (item.type === 'route') {
    // 多节点
    tep.push(ColFactory.branchBoxRender.bind(this, h, item)())
    if (item.childNode) {
      tep.push(getFactory.bind(this, h, item.childNode)())
    }
  }
  if (item.type !== 'route') {
    tep.push(RowFactory.nodeWrapRender.bind(this, h, item)())
  }
  return tep
}
export default {
  getFactory
}
