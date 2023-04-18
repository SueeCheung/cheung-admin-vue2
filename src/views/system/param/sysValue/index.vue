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
              v-show="formConfig.formType!=='review'"
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
        >
          <template v-slot:sys_type="data">
            <span v-if="data.props.row.sys_type">
              {{ data.props.row.sys_type.name }}
            </span>
            <span v-else> / </span>
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
import { getSysTypeList } from '@/api/system/sysType'
import {
  getSysValueInfo,
  getSysValueList,
  createSysValue,
  updateSysValue,
  deleteSysValues
} from '@/api/system/sysValue'
import { currencyOpt } from '@/utils/mixin'
import { isNumber } from '@/utils/validate'

export default {
  mixins: [currencyOpt],
  data() {
    var validateValue = (rule, value, callback) => {
      if (isNumber(this.formData.data_type) && this.formData.data_type !== 4 && value === null) {
        callback(new Error('请输入参数值'))
      }
      callback()
    }
    var validateJson = (rule, value, callback) => {
      if (isNumber(this.formData.data_type) && this.formData.data_type === 4 && value === null) {
        callback(new Error('请输入json值'))
      }
      callback()
    }
    return {
      buttonConfig: [
        {
          type: 'button',
          label: '添加',
          buttonType: 'primary',
          icon: 'el-icon-plus', // 左侧图标
          func: 'addItem',
          permission: 'addSysValue'
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
              permission: 'updateSysValue'
            },
            {
              label: '删除',
              func: 'deleteItems',
              permission: 'deleteSysValues'
            }
          ]
        }
      ],
      searchConfig: {
        mainSearch: [
          {
            type: 'selectRemote',
            prop: 'sys_type_id',
            placeholder: '请选择系统类型',
            remoteFunc: getSysTypeList,
            remote: true,
            list: []
          },
          {
            type: 'text',
            prop: 'search',
            placeholder: '输入参数名称'
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
            prop: 'value',
            label: '参数值',
            placeholder: '请输入参数值'
          },
          {
            type: 'text',
            prop: 'desc',
            label: '描述',
            placeholder: '请输入描述'
          },
          {
            type: 'selectRemote',
            prop: 'sys_type',
            label: '系统类型',
            remoteFunc: getSysTypeList,
            placeholder: '请搜索系统类型',
            remote: true,
            multiple: true,
            list: []
          },
          {
            type: 'select',
            prop: 'data_type',
            label: '数据类型',
            placeholder: '请选择数据类型',
            remote: true,
            multiple: true,
            list: [
              {
                value: 0,
                label: '文本'
              },
              {
                value: 1,
                label: '数值'
              },
              {
                value: 2,
                label: '日期'
              },
              {
                value: 3,
                label: '链接'
              },
              {
                value: 4,
                label: 'Json'
              }
            ]
          }
        ]
      },
      searchData: {
        search: '',
        ordering: '',
        sys_type_id: ''
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
        value: {
          condition: '',
          value: ''
        },
        desc: {
          condition: '',
          value: ''
        },
        sys_type: {
          condition: '',
          value: []
        },
        data_type: {
          condition: '',
          value: []
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
                  label: '参数名称',
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
                  label: '系统类别',
                  type: 'selectRemote',
                  prop: 'sys_type',
                  elCol: '100%',
                  remoteFunc: getSysTypeList,
                  placeholder: '请搜索系统类别',
                  remote: true,
                  canUpdate: true,
                  list: []
                },
                {
                  label: '描述',
                  type: 'textarea',
                  prop: 'desc',
                  elCol: '100%',
                  canUpdate: true,
                  placeholder: '请输入参数描述'
                },
                {
                  label: '数据类型',
                  type: 'select',
                  prop: 'data_type',
                  elCol: '100%',
                  canUpdate: true,
                  placeholder: '请选择数据类型',
                  list: [
                    {
                      value: 0,
                      label: '文本'
                    },
                    {
                      value: 1,
                      label: '数值'
                    },
                    {
                      value: 2,
                      label: '日期'
                    },
                    {
                      value: 3,
                      label: '链接'
                    },
                    {
                      value: 4,
                      label: 'Json'
                    }
                  ]
                },
                {
                  label: '参数值',
                  type: 'text',
                  prop: 'value',
                  elCol: '100%',
                  canUpdate: true,
                  placeholder: '请输入参数值'
                },
                {
                  label: 'json',
                  type: 'jsonEditor',
                  prop: 'json',
                  elCol: '100%',
                  canUpdate: true,
                  data: {}
                },
              ]
            }
          ]
        }
      },

      formData: {
        no: '',
        name: '',
        desc: '',
        sys_type: '',
        data_type: '',
        value: '',
        json:''
      },
      formRules: {
        name: [{ required: true, message: '请输入类型名称', trigger: 'blur' }],
        data_type: [
          { required: true, message: '请选择数据类型', trigger: 'blur' }
        ],
        value: [
          { validator: validateValue, trigger: 'blur' }
        ],
        json: [
          { validator: validateJson, trigger: 'blur' }
        ],
        sys_type: [
          { required: true, message: '请选择系统类别', trigger: 'blur' }
        ],
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
            label: '参数名称',
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
          },
          {
            id: '4',
            label: '系统类型',
            prop: 'sys_type',
            className: 'classname',
            sortable: 'custom',
            minWidth: '70',
            show: 'template' // show有三种值：false隐藏当前列，true常规表格列，’template‘自定义表格列
          },
          {
            id: '5',
            label: '数据类型',
            prop: 'data_type',
            className: 'classname',
            sortable: 'custom',
            minWidth: '70',
            show: true // show有三种值：false隐藏当前列，true常规表格列，’template‘自定义表格列
          },
          {
            id: '6',
            label: '参数值',
            prop: 'value',
            className: 'classname',
            sortable: 'custom',
            minWidth: '70',
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
        update: updateSysValue,
        create: createSysValue,
        delete: deleteSysValues,
        list: getSysValueList,
        info: getSysValueInfo
      }
    }
  }
}
</script>
