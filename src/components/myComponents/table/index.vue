<template>
  <div id="tableBox" class="tl-rl">
    <template>
      <el-table
        ref="TlRlTable"
        v-loading="tableConfig.loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        tooltip-effect="dark"
        :show-summary="tableConfig.hasShowSummary"
        :summary-method="tableConfig.getSummaries"
        :height="tableConfig.height"
        :data="tableConfig.data"
        :border="tableConfig.border"
        style="width: 100%"
        :row-class-name="rowClassName"
        :span-method="objectSpanMethod"
        :tree-props="tableConfig.treeProps"
        row-key="id"
        size="mini"
        empty-text="暂无数据"
        header-row-class-name="thClassName"
        @selection-change="handleSelectionChange"
        @sort-change="tableSort"
        @row-click="rowClick"
      >
        <!-- 多选框 -->
        <el-table-column
          v-if="tableConfig.hasSelect"
          align="center"
          type="selection"
          :fixed="!!tableConfig.selectFixed"
          width="45"
          :selectable="(row, index)=>{return selectable(row, index,tableConfig.selectable ? tableConfig.selectable:{})}"
        />

        <!--序号列-->
        <el-table-column
          v-if="!tableConfig.hasOrder"
          type="index"
          align="center"
          width="55"
          label="序"
        />
        <!-- 可展开 -->
        <el-table-column v-if="tableConfig.hasExpand" :fixed="!!tableConfig.expandFixed" type="expand">
          <template slot-scope="props">
            <el-form label-position="left" class="tableExpand" label-width="90px">
              <el-form-item
                v-for="item in tableConfig.expands"
                :key="item.id"
                :label="item.label + ':'"
              >
                <div class="fontSize12">
                  <template v-if="item.show !== false && item.show === 'template'">
                    <slot :name="item.prop" :props="props" />
                  </template>
                  <template v-else-if="item.show !== false && item.show !== 'template'">
                    <span v-if="props.row[item.prop]">{{ props.row[item.prop] }}</span>
                    <span v-else>/</span>
                  </template>
                </div>

              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <!-- 表头 -->
        <template v-for="item in tableConfig.headerData">
          <el-table-column
            v-if="item.show !== false && item.show === 'template'"
            :key="item.id"
            :label="item.label"
            :prop="item.prop"
            :fixed="item.fixed"
            :sortable="item.sortable"
            :class-name="item.className ? item.className : ''"
            :width="item.width ? item.width : ''"
            :min-width="item.minWidth ? item.minWidth : ''"
            show-overflow-tooltip
          >
            <template v-slot:default="props">
              <slot :name="item.prop" :props="props" />
            </template>
          </el-table-column>

          <el-table-column
            v-else-if="item.show !== false && item.show !== 'template'"
            :key="item.id"
            :label="item.label"
            :prop="item.prop"
            :fixed="item.fixed"
            :class-name="item.className ? item.className : ''"
            :width="item.width ? item.width : ''"
            :sortable="item.sortable"
            :min-width="item.minWidth ? item.minWidth : ''"
            show-overflow-tooltip
            :formatter="dataFormat"
          >
            <el-table-column
              v-for="item1 in item.children"
              v-show="item.children"
              :key="item1.id"
              :label="item1.label"
              :prop="item1.prop"
              :sortable="item.sortable"
              :class-name="item1.className ? item1.className : ''"
              :width="item1.width ? item1.width : ''"
              :min-width="item1.minWidth ? item1.minWidth : ''"
              show-overflow-tooltip
              :formatter="dataFormat"
            >
              <template v-if="item1.show==='template'" v-slot:default="props">
                <slot :name="item1.prop" :props="props" />
              </template>
              <el-table-column
                v-for="item2 in item1.children"
                v-show="item1.children"
                :key="item2.id"
                :label="item2.label"
                :prop="item2.prop"
                :sortable="item.sortable"
                :class-name="item2.className ? item2.className : ''"
                :width="item2.width ? item2.width : ''"
                :min-width="item2.minWidth ? item2.minWidth : ''"
                show-overflow-tooltip
                :formatter="dataFormat"
              >
                <template v-if="item2.show==='template'" v-slot:default="props">
                  <slot :name="item2.prop" :props="props" />
                </template>
              </el-table-column>
            </el-table-column>
          </el-table-column>
        </template>
        <!-- 自定义操作栏 -->
        <el-table-column
          v-if="tableConfig.hasOperation"
          column-key="operation"
          :label="tableConfig.operation.label"
          :width="tableConfig.operation.width ? tableConfig.operation.width : ''"
          :min-width="tableConfig.operation.minWidth ? tableConfig.operation.minWidth : ''"
          :class-name="tableConfig.operation.className"
          :fixed="tableConfig.operation.fixed"
          align="center"
        >
          <template v-slot:default="scope">
            <!--操作栏改为自定义操作栏-->
            <slot :name="tableConfig.operation.slotName" :scope="scope" />
            <el-button
              v-for="item in tableConfig.operation.data"
              :key="item.id"
              v-permission="item.permission"
              :class="item.classname ? item.classname : ''"
              :size="item.size"
              :icon="item.icon"
              :type="item.type"
              :plain="item.plain"
              :disabled="scope.row[item.disabledProp] !== item.disabledValue"
              @click.stop="handleOperation(scope.$index, scope.row, item.id)"
            >{{ item.label }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    tableConfig: {
      type: Object,
      required: true
    },
    sendMethod: {
      type: Function,
      required: false
    }
  },
  methods: {
    // 是否可选
    selectable(row, index, selectable) {
      if (selectable === {}) {
        return true
      } else {
        return Boolean(row[selectable.key] === selectable.value)
      }
    },
    // 格式化表格数据
    dataFormat(row, column) {
      // console.log(row, column)
      if (row[column.property] === 0) {
        return row[column.property]
      }
      return row[column.property] ? row[column.property] : '/'
    },

    // checkedChange
    handleSelectionChange(val) {
      const pks = []
      const selectItems = val
      val.forEach(item => {
        pks.push(item.id)
      })
      this.$emit('selectChange', pks, selectItems)
    },

    // 调用操作绑定的方法
    handleOperation(index, item, id) {
      const data = this.tableConfig.operation.data
      for (let i = 0; i < data.length; i++) {
        if (id === data[i].id) {
          this.$emit(data[i].Fun, index, item, id)
        }
      }
    },

    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (!this.tableConfig.hasMergeRowOrColumn) {
        return
      } else {
        // this.$emit('onMergeRowOrColumn', { row, column, rowIndex, columnIndex });
        return this.sendmethod({ row, column, rowIndex, columnIndex }) // 通过父组件传递方法的形式来达到单元格的合并
      }
    },
    // 点击某一行时触发的函数
    // *** 按下左键然后移动鼠标到其它列放开左键，会有报错 -- 优化：添加点击行参数，
    rowClick(Row, Event, Column) {
      if (
        !Column ||
        Column.type === 'selection' ||
        Column.columnKey === 'operation' ||
        Column.type === 'expand'
      ) {
        return
      }
      const data = {
        row: Row,
        event: Event,
        column: Column
      }
      this.$emit('onRowClick', data)
    },

    // 行类名的回调函数
    // 在表格数据中添加class字段即为表格行类名，配合css可对表格行中的自定义标签进行样式优化
    rowClassName(rowdata) {
      // const data = this.Table.data;
      // let className = data[rowdata.rowIndex].class ? data[rowdata.rowIndex].class : '';
      // if (className.length === 0) {
      //   return
      // }
      // className = className.join(' ');
      // return className
    },

    tableSort(column) {
      const order = column.order === 'ascending' ? '-' + column.prop : column.prop
      this.$emit('setOrder', order)
    }
  }
}
</script>
<style lang="scss" scoped>

  /* 展开行样式 */
.tableExpand {
  font-size: 12px !important;
  label {
    color: #99a9bf;
  }
  .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
}
.el-form-item__content {
  width: 100%;
}

</style>

