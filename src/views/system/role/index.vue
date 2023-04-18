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
        >
          <template v-slot:menus="data">
            <span style="color: #606266; margin-right: 5px">
              {{ data.props.no }} {{ data.props.name }}
            </span>
            <template v-if="data.props.type === '按钮'">
              <el-tag type="success">按钮</el-tag>
            </template>
            <template v-if="data.props.type === '其他'">
              <el-tag type="info">其他</el-tag>
            </template>
          </template>
        </my-form>
      </el-dialog>
      <div>
        <my-filter-tag :screen-data="searchData" />
        <my-table
          :table-config="tableConfig"
          @selectChange="selectChange"
          @setOrder="setOrder"
        >
          <template v-slot:menus="data">
            <div v-if="data.props.row.menus.length > 0">
              <el-tree
                ref="tree"
                :data="data.props.row.menus"
                node-key="id"
                :props="{ label: 'name', children: 'children' }"
                :filter-node-method="filterNode"
              >
                <div slot-scope="{ node, data }">
                  <span style="color: #606266; margin-right: 5px">{{
                    data.name
                  }}</span>
                  <template v-if="data.type === '按钮'">
                    <el-tag type="success">按钮</el-tag>
                  </template>
                  <template v-if="data.type === '其他'">
                    <el-tag type="info">其他</el-tag>
                  </template>
                </div>
              </el-tree>
            </div>
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
import { getMenuList } from '@/api/system/menu'
import { getUserList } from '@/api/system/user'
import {
  createRole,
  updateRole,
  getRoleInfo,
  getRoleList,
  deleteRoles
} from '@/api/system/role'
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
          permission: 'addRole'
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
              permission: 'updateRole'
            },
            {
              label: '删除',
              func: 'deleteItems',
              permission: 'deleteRoles'
            }
          ]
        }
      ],
      searchConfig: {
        mainSearch: [
          {
            type: 'text',
            prop: 'search',
            placeholder: '输入角色名称'
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
            label: '角色名称',
            placeholder: '请输入角色名称'
          },
          {
            type: 'text',
            prop: 'desc',
            label: '描述',
            placeholder: '请输入描述'
          },
          {
            type: 'cascade',
            prop: 'menus',
            label: '系统菜单',
            remoteFunc: getMenuList,
            placeholder: '请搜素系统菜单',
            remote: true,
            props: {
              value: 'id',
              label: 'name',
              multiple: true,
              emitPath: false
            },
            list: []
          },
          {
            type: 'selectRemote',
            prop: 'users',
            label: '系统用户',
            remoteFunc: getUserList,
            placeholder: '请搜素系统用户',
            remote: true,
            multiple: true,
            list: []
          }
        ]
      },
      searchData: {
        search: ''
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
        },
        menus: {
          condition: '',
          value: []
        },
        users: {
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
                  label: '编号',
                  type: 'text',
                  prop: 'no',
                  elCol: '100%',
                  canUpdate: true,
                  placeholder: '请输入编号'
                },
                {
                  label: '角色名称',
                  type: 'text',
                  prop: 'name',
                  elCol: '100%',
                  canUpdate: true,
                  placeholder: '请输入角色名称'
                },
                {
                  label: '描述',
                  type: 'textarea',
                  prop: 'desc',
                  elCol: '100%',
                  canUpdate: true,
                  placeholder: '请输入用户描述'
                },
                {
                  label: '系统菜单',
                  type: 'tree',
                  prop: 'menus',
                  elCol: '100%',
                  placeholder: '请选择系统菜单',
                  canUpdate: true,
                  props: {
                    label: 'name',
                    children: 'children',
                    disabled: false
                  },
                  data: []
                }
              ]
            }
          ]
        }
      },

      formData: {
        no: '',
        name: '',
        desc: '',
        menus: []
      },
      formRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        no: [{ required: true, message: '请输入编号', trigger: 'blur' }]
      },
      tableConfig: {
        hasMergeRowOrColumn: false, // 是否合并单元格
        loading: true, // 加载中动画
        hasShowSummary: false, // 是否显示表位合计行
        border: false, // 是否带有纵向边框，默认为false
        hasOrder: true, //  是否需要显示序列  默认fslae  显示
        hasSelect: true, // 有无选中功能
        hasOperation: false, // 有无操作功能
        hasExpand: true, // 有无展开行功能
        headerData: [
          // 表头数据 —— className:列的class名
          {
            id: '1',
            label: '编号',
            prop: 'no',
            sortable: 'custom',
            className: 'classname',
            minWidth: '50',
            // fixed: true,
            show: true // show有三种值：false隐藏当前列，true常规表格列，’template‘自定义表格列
          },
          {
            id: '2',
            label: '角色名称',
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
        expands: [
          {
            id: '1',
            label: '权限菜单',
            prop: 'menus',
            show: 'template'
          }
        ],
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
        update: updateRole,
        create: createRole,
        delete: deleteRoles,
        list: getRoleList,
        info: getRoleInfo
      }
    }
  },
  mounted() {
    getMenuList({ parent__isnull: 1 }).then((response) => {
      const { data } = response
      // this.formConfig['otherForm'][1].data = data
      this.formConfig.itemData.groupList[0].groupForm[3].data = data
    })
  },
  methods: {
    filterNode(value, data) {
      // console.log(value, data)
      if (!value) return true
      return data.label.indexOf(value) !== -1
    }
  }
}
</script>
