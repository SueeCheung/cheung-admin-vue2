/* eslint-disable no-unused-vars */
/**
 * @author 肖阳
 * @time 2020-9-10
 * @dec 各种节点类
 */
import { HashCode } from '../../utils'
export class Node {
  childNode;
  conditionNodes;
  constructor({ id, type, isRow, name, content, parent }) {
    this.parent = parent
    this.name = name
    this.content = content
    this.id = id
    this.type = type
    this.isRow = isRow
  }
}
export class ConditionNode {
  constructor({ group, type, id, parent, isRow, name, content }) {
    this.id = id
    this.parent = parent
    this.name = name
    this.type = type
    this.content = content
    this.group = group
    this.isRow = isRow
  }
}
export class RowNode extends Node {
  constructor({ id, type, isRow, name, content, parent }) {
    super({ id, type, isRow, name, content, parent })
  }
}
export class CopyNode {
  constructor({ childNode, id, type, name, parent, group, content }) {
    this.id = id
    this.parent = parent
    this.childNode = childNode
    this.group = group
    this.name = name
    this.content = content
    this.type = type
  }
}
