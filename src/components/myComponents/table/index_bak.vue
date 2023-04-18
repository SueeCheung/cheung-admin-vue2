<template>
  <div id="tableBox" class="tl-rl">
    <template :table="table">
      <el-table
        ref="TlRlTable"
        v-loading="table.loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :show-summary="table.hasShowSummary"
        :summary-method="table.getSummaries"
        :height="table.height"
        :data="table.data"
        tooltip-effect="dark"
        :border="table.border"
        style="width: 100%"
        max-height="529px"
        :row-class-name="rowClassName"
        :span-method="objectSpanMethod"
        header-row-class-name="thClassName"
        row-class-name="singleDoubleStyle"
        @selection-change="handleSelectionChange"
        @row-click="rowClick"
      >
        <el-table-column
          v-if="table.hasSelect"
          align="center"
          type="selection"
          width="55"
        />
        <!--序号列-->
        <el-table-column
          v-if="!table.hasOrder"
          type="index"
          align="center"
          width="55"
          label="序"
        />
        <el-table-column v-if="table.hasExpand" type="expand" align="center">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item v-for="item in table.expands" :key="item.id" :label="item.label">
                <span>{{ props.row[item.prop] }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <template v-for="item in table.tr">
          <el-table-column
            v-if="item.show !== false && item.show === 'template'"
            :key="item.id"
            :label="item.label"
            :class-name="item.className ? item.className : ''"
            :width="item.width ? item.width : ''"
            :min-width="item.minWidth ? item.minWidth : ''"
          >
            <template slot-scope="scope">
              <slot :name="item.prop" :obj="scope" />
            </template>
          </el-table-column>
          <el-table-column
            v-else-if="item.show !== false && item.show !== 'template'"
            :key="item.id"
            :label="item.label"
            :prop="item.prop"
            :class-name="item.className ? item.className : ''"
            :width="item.width ? item.width : ''"
            :min-width="item.minWidth ? item.minWidth : ''"
          >
            <el-table-column
              v-for="item1 in item.children"
              v-show="item.children"
              :key="item1.id"
              :label="item1.label"
              :prop="item1.prop"
              :class-name="item1.className ? item1.className : ''"
              :width="item1.width ? item1.width : ''"
              :min-width="item1.minWidth ? item1.minWidth : ''"
            >
              <el-table-column
                v-for="item2 in item1.children"
                v-show="item1.children"
                :key="item2.id"
                :label="item2.label"
                :prop="item2.prop"
                :class-name="item2.className ? item2.className : ''"
                :width="item2.width ? item2.width : ''"
                :min-width="item2.minWidth ? item2.minWidth : ''"
              />
            </el-table-column>
          </el-table-column>
        </template>
        <el-table-column
          v-if="table.hasOperation"
          column-key="operation"
          :label="table.operation.label"
          :width="table.operation.width ? table.operation.width : ''"
          :min-width="table.operation.minWidth ? table.operation.minWidth : ''"
          :class-name="table.operation.className"
          align="center"
        >
          <template slot-scope="scope">
            <!--操作栏改为自定义操作栏-->
            <slot :name="table.operation.label" :obj="scope" />
            <!-- <el-Button
               v-if="item.show !== false && item.show === 'template'"
               v-for="item in Table.operation.data"
               :class="item.classname ? item.classname : ''"
               :key="item.id"
               :size="item.size"
               :icon="item.icon"
               :type="item.type"
               :plain="item.plain"
               @click.stop="handleOperation(scope.$index, scope.row, item.id)">{{ item.label }}</el-Button>
 -->
          </template>

        </el-table-column>

      </el-table>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Recordlist',
  props: {
    table: {
      type: Object,
      default() {
        return {
          hasMergeRowOrColumn: false, // 是否合并单元格
          loading: false, // 加载中动画
          hasShowSummary: false, // 是否显示表位合计行
          border: false, // 是否带有纵向边框，默认为false
          hasOrder: false, //  是否需要显示序列  默认fslae  显示
          hasSelect: false, // 有无选中功能
          hasOperation: false, // 有无操作功能
          hasExpand: false, // 有无展开行功能
          tr: [ // 表头数据 —— className:列的class名
            {
              id: '1',
              label: 'label',
              prop: 'prop',
              className: 'classname',
              minWidth: '80',
              show: true // show有三种值：false隐藏当前列，true常规表格列，’template‘自定义表格列
              // <template slot-scope="props" slot="example">
              //       <a class="list-a" target="_blank" :href="'/#/bombscreen?mobile=' + props.obj.row.mobile">{{ props.obj.row.username }}</a>
              // </template>
            }
          ],
          data: [], // 表格数据 —— 如需添加行class，处理数据时则需要传入class名， class需为数组
          operation: { // 操作功能
            label: '操作', // 操作列的行首文字
            width: '200', // 操作列的宽度
            className: '', // 操作列的class名
            data: [ // 如果每一行的操作列的数据都是一样的，可以把操作数据定义在data 里面。但是如果每一列的操作列根据具体情况来定义的话 需要在模板里面自定义操作类别
              {
                label: '编辑', // 按钮文字
                Fun: 'handleSubmit', // 点击按钮后触发的父组件事件
                size: 'mini', // 按钮大小
                id: '1', // 按钮循环组件的key值
                classname: 'show', // 按钮的类名
                icon: 'el-icon-delete', // 按钮的图标
                type: 'primary', // 按钮的类型  primary / success / warning / danger / info / text，如果设置为text  那么一定是plain:false
                plain: true // 是否朴素按钮

              }
            ]
          },
          expands: [ // 展开行数据
            {
              id: '1',
              label: 'label',
              prop: 'prop'
            }
          ],
          getSummaries(param) { // 自定义表位合计行数据
            // *** 此函数传入param参数
            // console.log(param)
            // *** 最后返回一个数组，合计行会显示数组中的内容
            return []
          }
        }
      }
    },
    sendmethod: {
      type: Function,
      required: false
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.$emit('onHandleSelectionChange', val)
    },
    handleOperation(a, b, id) {
      const data = this.table.operation.data
      for (let i = 0; i < data.length; i++) {
        if (id === data[i].id) {
          this.$emit(data[i].Fun, a, b)
        }
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (!this.table.hasMergeRowOrColumn) {
        return
      } else {
        // this.$emit('onMergeRowOrColumn', { row, column, rowIndex, columnIndex });
        return this.sendmethod({ row, column, rowIndex, columnIndex }) // 通过父组件传递方法的形式来达到单元格的合并
      }
    },
    // 点击某一行时触发的函数
    // *** 按下左键然后移动鼠标到其它列放开左键，会有报错 -- 优化：添加点击行参数，
    rowClick(Row, Event, Column) {
      if (!Column || Column.type === 'selection' || Column.columnKey === 'operation' || Column.type === 'expand') {
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
      const data = this.table.data
      let className = data[rowdata.rowIndex].class ? data[rowdata.rowIndex].class : ''
      if (className.length === 0) {
        return
      }
      className = className.join(' ')
      return className
    }
  }
}
</script>
<style scoped>
  >>> .el-table th {
    text-align: center !important;
  }
  >>> .el-table td, .el-table th{
    text-align: center !important;
  }

  >>>.el-table th {
    text-align: center;
    font-size: 12px;
    color: #323232;
    font-weight: normal;
    background: #bbb;
    font-family:'SourceHanSansCN-Normal';
  }

  >>>.el-table td{
    padding: 8px 0 !important;
  }
  >>>.el-table th{
    padding: 10px 0 !important;
  }
  table tr:nth-child(odd){background:#fff;}
  table tr:nth-child(even){background:#f1f1f1;}

  /*Table, thead, tbody, tfoot, tr, th, td, caption, col, colgroup {
    text-align: inherit;
    line-height: inherit;
    font-size: 100%;
    border-bottom: 1px solid #eee !important;
  }*/
  /*.el-Table--border td, .el-Table--border th：*/
 /* >>>.el-table__header thead {
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    border-left: 1px solid #eee !important;
    box-sizing: border-box;
  }*/
</style>
<style>
  .el-table th ,.el-table td{
    text-align: center;
  }
  #tableBox tbody tr:last-child td{
    border-right: 1px solid #EBEEF5;
    border-bottom: 1px solid #EBEEF5;
  }

 /* #tableBox .el-Table{
    border-left: 1px solid #EBEEF5;
  }*/
  #tableBox  .thClassName th:nth-child(1){
    border-left: 1px solid #EBEEF5;
  }
  #tableBox  .el-table__row td:nth-child(1){
    border-left: 1px solid #EBEEF5;
  }
  #tableBox  .el-table__row td:nth-child(1){
    border-left: 1px solid #EBEEF5;
  }
</style>
