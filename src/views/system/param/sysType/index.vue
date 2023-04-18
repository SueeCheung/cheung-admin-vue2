<template>
  <div>
    <el-card class="myCardBase">
      <div style="display: flex; width: 100%">
        <my-button
          :button-config="buttonConfig"
          @addItem="addItem"
          @updateItem="updateItem"
          @deleteItems="deleteItems"
        />
        <my-search
          :search-config="searchConfig"
          :search-data="searchData"
          :screen-data="screenData"
          @searchFunc="searchFunc"
        />
      </div>
      <el-dialog
        v-el-drag-dialog
        width="800px"
        :visible.sync="formVisible"
        :fullscreen="fullscreen"
        :show-close="false"
        @close="reset"
      >
        <template slot="title">
          <span class="formDialogTitle">
            <svg-icon icon-class="addSvg" />
            信息
          </span>
          <div class="formDialogOpt">
            <el-button
              type="primary"
              icon="el-icon-folder-checked"
              @click="submitForm"
            >
              保存
            </el-button>
            <el-link :underline="false">
              <i
                class="el-icon-full-screen"
                @click="fullscreen = !fullscreen"
              />
            </el-link>
            <el-link :underline="false">
              <i class="el-icon-close" @click="formVisible = false" />
            </el-link>
          </div>
        </template>
        <my-form
          ref="publicForm"
          :form-config="formConfig"
          :form-rules="formRules"
          :form-data="formData"
          :opt-func="optFunc"
          @searchFunc="searchFunc"
          @closeDialog="closeDialog"
        />
      </el-dialog>
      <div>
        <my-filter-tag :screen-data="searchData" />
        <my-table
          :table-config="tableConfig"
          @selectChange="selectChange"
          @setOrder="setOrder"
        />
        <div>
          <my-pagination :pager="pager" @change="searchFunc" />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  getSysTypeInfo,
  createSysType,
  updateSysType,
  getSysTypeList,
  deleteSysTypes
} from '@/api/system/sysType'
import { currencyOpt } from '@/utils/mixin'

export default {
  mixins: [currencyOpt],
  data() {
    return {
      buttonConfig: [
        {
          type: 'button',
          label: '添加',
          buttonType: 'primary',
          icon: 'el-icon-plus', // 左侧图标
          func: 'addItem',
          permission: 'addSysType'
        },
        {
          label: '编辑',
          type: 'dropdown',
          icon: 'el-icon-edit', // 左侧图标
          buttonType: '',
          list: [
            {
              label: '修改',
              func: 'updateItem',
              permission: 'updateSysType'
            },
            {
              label: '删除',
              func: 'deleteItems',
              permission: 'delSysType'
            }
          ]
        }
      ],
      searchConfig: {
        mainSearch: [
          {
            type: 'text',
            prop: 'search',
            placeholder: '输入类型名称'
          }
        ],
        advancedSearch: [
          {
            type: 'text',
            prop: 'no',
            label: '编号',
            placeholder: '请输入编号'
          },
          {
            type: 'text',
            prop: 'name',
            label: '类型名称',
            placeholder: '请输入姓名'
          },
          {
            type: 'text',
            prop: 'desc',
            label: '描述',
            placeholder: '请输入描述'
          }
        ]
      },
      searchData: {
        search: '',
        ordering: ''
      },
      screenData: {
        no: {
          condition: '',
          value: ''
        },
        name: {
          condition: '',
          value: ''
        },
        desc: {
          condition: '',
          value: ''
        }
      },

      formConfig: {
        size: 'small',
        formType: 'create', // formType取值: update修改 create新增 review查看
        labelPosition: 'left', // labelPosition设置input左边文字位置默认 left 取值: right/left/top
        labelWidth: '120px', // labelWidth 设置input左边文字宽度,默认 90px
        labelSuffix: ':', // labelSuffix 设置input左边文字的公共文字,默认 :
        inlineMessage: true, // inlineMessage 是否以行内形式展示校验信息,默认false 取值: boolean
        itemData: {
          groupType: 'text', // text常规分组,tabs切换分组,collapse收缩分组
          groupList: [
            {
              groupName: '',
              groupForm: [
                {
                  label: '类型名称',
                  type: 'text',
                  prop: 'name',
                  elCol: '100%',
                  canUpdate: true,
                  placeholder: '请输入类型名称'
                },
                {
                  label: '编号',
                  type: 'text',
                  prop: 'no',
                  elCol: '100%',
                  canUpdate: true,
                  placeholder: '请输入编号'
                },
                {
                  label: '描述',
                  type: 'textarea',
                  prop: 'desc',
                  elCol: '100%',
                  canUpdate: true,
                  placeholder: '请输入用户描述'
                }
              ]
            }
          ]
        }
      },
      formData: {
        no: '',
        name: '',
        desc: ''
      },
      formRules: {
        name: [{ required: true, message: '请输入类型名称', trigger: 'blur' }],
        no: [{ required: true, message: '请输入编号', trigger: 'blur' }]
      },
      tableConfig: {
        hasMergeRowOrColumn: false, // 是否合并单元格
        loading: true, // 加载中动画
        hasShowSummary: false, // 是否显示表位合计行
        border: false, // 是否带有纵向边框，默认为false
        hasOrder: true, //  是否需要显示序列  默认false  显示
        hasSelect: true, // 有无选中功能
        hasOperation: false, // 有无操作功能
        hasExpand: false, // 有无展开行功能
        headerData: [
          // 表头数据 —— className:列的class名
          {
            id: '1',
            label: '编号',
            prop: 'no',
            sortable: 'custom',
            className: 'classname',
            minWidth: '50',
            show: true // show有三种值：false隐藏当前列，true常规表格列，’template‘自定义表格列
          },
          {
            id: '2',
            label: '类型名称',
            prop: 'name',
            className: 'classname',
            sortable: 'custom',
            minWidth: '70',
            show: true // show有三种值：false隐藏当前列，true常规表格列，’template‘自定义表格列
          },
          {
            id: '3',
            label: '描述',
            prop: 'desc',
            sortable: 'custom',
            className: 'classname',
            minWidth: '80',
            show: true // show有三种值：false隐藏当前列，true常规表格列，’template‘自定义表格列
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
        update: updateSysType,
        create: createSysType,
        delete: deleteSysTypes,
        list: getSysTypeList,
        info: getSysTypeInfo
      }
    }
  }
}
</script>
