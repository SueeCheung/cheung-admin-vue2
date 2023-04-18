<template>
  <div>
    <el-card class="myCardBase">
      <div style="display: flex; width: 100%">
        <my-search
          :search-config="searchConfig"
          :search-data="searchData"
          :screen-data="screenData"
          @searchFunc="searchFunc"
        />
      </div>
      <div>
        <my-filter-tag :screen-data="searchData" />
        <my-table
          :table-config="tableConfig"
          @selectChange="selectChange"
          @setOrder="setOrder"
        >
          <template v-slot:change_data="data">
            <template v-if="data">
              <div v-for="(item,index) in data.props.row.change_data" :key="index">
                {{ item }}
              </div>
            </template>
            <span v-else>/</span>
          </template>
          <template v-slot:change_date="data">
            <span v-if="data.props.row.change_date">{{ data.props.row.change_date | timeFormatter }}</span>
            <span v-else>/</span>
          </template>
        </my-table>
        <div>
          <my-pagination :pager="pager" @change="searchFunc" />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getOperationLogList } from '@/api/system/log'
import { currencyOpt } from '@/utils/mixin'

export default {
  mixins: [currencyOpt],
  data() {
    return {
      searchConfig: {
        mainSearch: [
          {
            type: 'text',
            prop: 'search',
            placeholder: '输入用户名称'
          },
          {
            type: 'daterange',
            prop: 'change_date__range',
            format: 'yyyy-MM-dd HH:mm:ss',
            itemType: 'datetimerange',
            placeholder: '请选择请求时间范围'
          }
        ],
        advancedSearch: [
          {
            type: 'text',
            prop: 'user__name',
            label: '请求用户',
            placeholder: '请输入请求用户姓名、用户名'
          },
          {
            type: 'select',
            prop: 'action',
            label: '操作',
            placeholder: '请选择操作',
            remote: true,
            multiple: true,
            list: [
              {
                value: 0,
                label: '新增'
              },
              {
                value: 1,
                label: '更新'
              },
              {
                value: 2,
                label: '删除'
              }
            ]
          }
        ]
      },
      searchData: {
        search: '',
        ordering: '',
        change_date__range: []
      },
      screenData: {
        user__name: {
          condition: '',
          value: ''
        },
        action: {
          condition: '',
          value: []
        }
      },
      tableConfig: {
        hasMergeRowOrColumn: false, // 是否合并单元格
        loading: true, // 加载中动画
        hasShowSummary: false, // 是否显示表位合计行
        border: false, // 是否带有纵向边框，默认为false
        hasOrder: true, //  是否需要显示序列  默认fslae  显示
        hasSelect: true, // 有无选中功能
        hasOperation: false, // 有无操作功能
        hasExpand: false, // 有无展开行功能
        headerData: [
          // 表头数据 —— className:列的class名
          {
            id: '1',
            label: '请求用户',
            prop: 'user',
            className: 'classname',
            minWidth: '100',
            show: true // show有三种值：false隐藏当前列，true常规表格列，’template‘自定义表格列
          },
          {
            id: '5',
            label: '操作',
            prop: 'action',
            className: 'classname',
            minWidth: '60',
            show: true // show有三种值：false隐藏当前列，true常规表格列，’template‘自定义表格列
          },
          {
            id: '6',
            label: '数据库表',
            prop: 'model',
            className: 'classname',
            minWidth: '60',
            show: true // show有三种值：false隐藏当前列，true常规表格列，’template‘自定义表格列
          },
          {
            id: '7',
            label: '请求对象',
            prop: 'content_object',
            className: 'classname',
            minWidth: '60',
            show: true // show有三种值：false隐藏当前列，true常规表格列，’template‘自定义表格列
          },
          {
            id: '10',
            label: '操作数据',
            prop: 'change_data',
            className: 'classname',
            minWidth: '80',
            show: 'template' // show有三种值：false隐藏当前列，true常规表格列，’template‘自定义表格列
          },
          {
            id: '9',
            label: '操作时间',
            sortable: 'custom',
            prop: 'change_date',
            className: 'classname',
            minWidth: '80',
            show: 'template' // show有三种值：false隐藏当前列，true常规表格列，’template‘自定义表格列
          }
        ],
        expands: [],
        data: [], // 表格数据 —— 如需添加行class，处理数据时则需要传入class名， class需为数组
        operation: {},
        getSummaries(param) {
          // 自定义表位合计行数据
          // *** 此函数传入param参数
          // console.log(param)
          // *** 最后返回一个数组，合计行会显示数组中的内容
          return []
        }
      },
      optFunc: {
        list: getOperationLogList
      }
    }
  }
}
</script>

