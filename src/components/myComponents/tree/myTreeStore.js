import TreeStore from 'element-ui/packages/tree/src/model/tree-store'

export default class MyTreeStore extends TreeStore {
  _initDefaultCheckedNodes() {
    const defaultCheckedKeys = this.defaultCheckedKeys || []
    const nodesMap = this.nodesMap

    defaultCheckedKeys.forEach((checkedKey) => {
      const node = nodesMap[checkedKey]
      if (node) {
        // 判断是否为叶子节点 ，选中了叶子节点，但该父节点所有的叶子节点未被全部选中，父节点显示成半选中状态，解决tree的回显问题
        if (node.isLeaf) {
          node.setChecked(true, !this.checkStrictly)
        }
      }
    })
  }
}
