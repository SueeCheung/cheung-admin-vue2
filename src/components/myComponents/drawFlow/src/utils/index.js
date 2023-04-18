/**
 * @author 肖阳
 * @time 2020-9-10
 * @dec 公共方法
 */
// https://github.com/reduxjs/redux/blob/master/src/compose.js
export function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }
  if (funcs.length === 1) {
    return funcs[0]
  }
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

/**
 * 转化为el-tree树形结构数据
 */
export function transToTreeDat(arr) {
  const list = arr
  const colNodes = list.filter(i => !i.isRow)
  const colNodesGroup = getColNode(colNodes)
  const allNodes = list.concat(colNodesGroup)
  return transTree(allNodes)
}
export function getColNode(colNodeArrs) {
  const colNodes = colNodeArrs
  const map = {}
  colNodes.forEach(i => {
    if (!map[i.group]) {
      map[i.group] = []
    }
    map[i.group].push(i)
  })
  const colNodesArr = []
  for (const group in map) {
    const obj = {
      id: group,
      parent: map[group][0].parent,
      type: 'route',
      isRow: true,
      conditionNodes: map[group]
    }
    colNodesArr.push(obj)
  }
  return colNodesArr
}

/**
 * 转化为el-tree树形结构数据
 */
export function transTree(arr) {
  const list = arr
  if (!list || !list.length) return []
  const map = {}
  for (const item of list) {
    map[item.id] = item
  }
  const nodes = []
  for (const lis of list) {
    if (!lis.isRow) {
      continue
    }
    const p = map[lis.parent]
    if (!p) {
      nodes.push(lis)
      continue
    }
    p.isParent = true
    // p.childNode || (p.childNode = {})
    p.childNode = lis
  }
  return nodes
}
/**
 * Hash 哈希值
 */
export function HashCode(hashLength) {
  // 默认长度 24
  return (
    'a' +
    Array.from(Array(Number(hashLength) || 15), () =>
      Math.floor(Math.random() * 36).toString(36)
    ).join('')
  )
}
/**
 * 树结构转化为扁平化结构
 */
export function deepTraversal(tree) {
  const list = []
  tree.forEach(item => {
    const loop = data => {
      list.push(data)
      const children = data.children
      children &&
        children.length &&
        children.forEach(child => {
          loop(child)
        })
    }
    loop(item)
  })
  return list
}
