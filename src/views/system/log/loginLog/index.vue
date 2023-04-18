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
          <template v-slot:login_date="data">
            <span v-if="data.props.row.login_date">{{ data.props.row.login_date | timeFormatter }}</span>
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
import { getLoginLogList } from '@/api/system/log'
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
            prop: 'login_date__range',
            format: 'yyyy-MM-dd HH:mm:ss',
            itemType: 'datetimerange',
            placeholder: '请选择请求时间范围'
          }
        ],
        advancedSearch: []
      },
      searchData: {
        search: '',
        ordering: '',
        login_date__range: []
      },
      screenData: {
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
            label: '登陆ip',
            prop: 'ip',
            className: 'classname',
            minWidth: '60',
            show: true // show有三种值：false隐藏当前列，true常规表格列，’template‘自定义表格列
          },
          {
            id: '9',
            label: '登陆时间',
            sortable: 'custom',
            prop: 'login_date',
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
        list: getLoginLogList
      }
    }
  }
}
</script>

