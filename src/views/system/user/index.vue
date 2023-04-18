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
          <template v-slot:avatar="prop">
            <cropper
              :data="prop.props"
              :extra="cropperExtra"
              :call-back="
                (data) => {
                  fileCallBack(data, 'avatar')
                }
              "
              :size="60"
            />
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
          <template v-slot:roles="data">
            <template v-if="data.props.row.roles.length > 0">
              <see-more
                :data-list="data.props.row.roles"
                :name-index="data.props.row.id.toString()"
              />
            </template>
            <span v-else> / </span>
          </template>
          <template v-slot:avatar="data">
            <el-avatar :src="data.props.row.avatar.file" size="small" />
          </template>
          <template v-slot:last_login="data">
            <span v-if="data.props.row.last_login">
              {{ data.props.row.last_login | timeFormatter }}
            </span>
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
import {
  createUser,
  updateUser,
  getUserList,
  getUserInfo,
  deleteUsers
} from '@/api/system/user'
import { currencyOpt } from '@/utils/mixin'
import { validMobile } from '@/utils/validate'
import { getRoleList } from '@/api/system/role'
import cropper from '@/components/myComponents/cropper'
import seeMore from '@/components/myComponents/seeMore'
import { isArray } from '@/utils/validate'

export default {
  components: { seeMore, cropper },
  mixins: [currencyOpt],
  data() {
    var validateMobile = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入微信绑定的手机号码'))
      } else if (value && !validMobile(value)) {
        callback(new Error('请输入合法的手机号码'))
      } else {
        callback()
      }
    }
    return {
      cropperExtra: {
        type: 1
      },
      buttonConfig: [
        {
          type: 'button',
          label: '添加',
          buttonType: 'primary',
          icon: 'el-icon-plus', // 左侧图标
          func: 'addItem',
          permission: 'addUser'
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
              permission: 'updateUser'
            },
            {
              label: '删除',
              func: 'deleteItems',
              permission: 'deleteUsers'
            }
          ]
        }
      ],
      searchConfig: {
        mainSearch: [
          {
            type: 'text',
            prop: 'search',
            placeholder: '输入姓名、联系方式'
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
            label: '姓名',
            placeholder: '请输入姓名'
          },
          {
            type: 'text',
            prop: 'username',
            label: '用户名',
            placeholder: '请输入用户名'
          },
          {
            type: 'text',
            prop: 'desc',
            label: '描述',
            placeholder: '请输入描述'
          },
          {
            type: 'selectRemote',
            prop: 'roles',
            label: '系统角色',
            remoteFunc: getRoleList,
            placeholder: '请搜索系统角色',
            remote: true,
            multiple: true,
            list: []
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
        username: {
          condition: '',
          value: ''
        },
        desc: {
          condition: '',
          value: ''
        },
        roles: {
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
                  label: '用户名',
                  type: 'text',
                  prop: 'username',
                  canUpdate: false,
                  placeholder: '请输入用户名(微信绑定的手机号码)'
                },
                {
                  label: '头像',
                  type: 'slot',
                  prop: 'avatar',
                  data: {}
                },
                {
                  label: '编号',
                  type: 'text',
                  prop: 'no',
                  canUpdate: true,
                  placeholder: '请输入编号'
                },
                {
                  label: '姓名',
                  type: 'text',
                  prop: 'name',
                  canUpdate: true,
                  placeholder: '请输入姓名'
                },
                {
                  label: '联系方式',
                  type: 'text',
                  prop: 'mobile',
                  canUpdate: true,
                  placeholder: '请输入联系方式(微信绑定的手机号码)'
                },
                {
                  label: '系统角色',
                  type: 'selectRemote',
                  prop: 'roles',
                  remoteFunc: getRoleList,
                  placeholder: '请搜素系统角色',
                  multiple: true,
                  remote: true,
                  canUpdate: true,
                  list: []
                },
                {
                  label: '是否能够登陆后台',
                  type: 'switch',
                  prop: 'is_staff',
                  canUpdate: true,
                  placeholder: '是否能够登陆后台'
                }
              ]
            }
          ]
        }
      },

      formData: {
        username: '',
        no: '',
        name: '',
        mobile: '',
        desc: '',
        avatar: '',
        roles: [],
        is_staff: false
      },
      formRules: {
        username: [
          { required: true, validator: validateMobile, trigger: 'blur' }
        ],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        no: [{ required: true, message: '请输入编号', trigger: 'blur' }],
        mobile: [{ required: true, validator: validateMobile, trigger: 'blur' }]
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
        expandFixed: true,
        headerData: [
          // 表头数据 —— className:列的class名
          {
            id: '1',
            label: '编号',
            prop: 'no',
            sortable: 'custom',
            className: 'classname',
            minWidth: '80',
            fixed: true,
            show: true // show有三种值：false隐藏当前列，true常规表格列，’template‘自定义表格列
          },
          {
            id: '2',
            label: '头像',
            prop: 'avatar',
            className: 'classname',
            minWidth: '80',
            fixed: true,
            show: 'template' // show有三种值：false隐藏当前列，true常规表格列，’template‘自定义表格列
          },
          {
            id: '3',
            label: '姓名',
            prop: 'name',
            className: 'classname',
            sortable: 'custom',
            minWidth: '70',
            fixed: true,
            show: true // show有三种值：false隐藏当前列，true常规表格列，’template‘自定义表格列
          },
          {
            id: '4',
            label: '用户名',
            prop: 'username',
            sortable: 'custom',
            className: 'classname',
            minWidth: '150',
            show: true // show有三种值：false隐藏当前列，true常规表格列，’template‘自定义表格列
          },
          {
            id: '5',
            label: '联系方式',
            prop: 'mobile',
            sortable: 'custom',
            className: 'classname',
            minWidth: '150',
            show: true // show有三种值：false隐藏当前列，true常规表格列，’template‘自定义表格列
          },
          {
            id: '6',
            label: '描述',
            prop: 'desc',
            sortable: 'custom',
            className: 'classname',
            minWidth: '80',
            show: true // show有三种值：false隐藏当前列，true常规表格列，’template‘自定义表格列
          },
          {
            id: '10',
            label: '系统角色',
            prop: 'roles',
            className: 'classname',
            minWidth: '120',
            show: 'template' // show有三种值：false隐藏当前列，true常规表格列，’template‘自定义表格列
          }
        ],
        expands: [
          // 展开行数据
          {
            id: '1',
            label: '最后登陆ip',
            prop: 'last_ip',
            show: true
          },
          {
            id: '2',
            label: '最后登陆时间',
            prop: 'last_login',
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
        update: updateUser,
        create: createUser,
        delete: deleteUsers,
        list: getUserList,
        info: getUserInfo
      },
      cropperFunc: {
        update: updateUser,
        callBack: this.searchFunc
      }
    }
  },
  methods: {
    fileCallBack(data, prop) {
      this.formConfig.itemData.groupList.forEach((ele) => {
        ele.groupForm.forEach((element) => {
          if (element.prop === prop) {
            element.data = data
          }
        })
      })
      if (!isArray(this.formData[prop])) {
        this.formData[prop] = data.id
      }
    }
    // getItemInfo(id) {
    //   this.formVisible = true
    //   this.optFunc.info(id)
    //     .then((response) => {
    //       const { data } = response
    //       this.formData = data
    //       this.avatarData = this.formData.avatar
    //       this.formConfig.itemData.groupList.forEach((ele) => {
    //         ele.groupForm.forEach((element) => {
    //           if ((element.remoteFunc !== undefined || element.type === 'slot')) {
    //             if (isArray(data[element.prop])) {
    //               element.list = data[element.prop]
    //               data[element.prop] = []
    //               element.list.forEach(item => {
    //                 data[element.prop].push(item.id)
    //               })
    //             } else {
    //               if (data[element.prop]) {
    //                 element.list = [data[element.prop]]
    //                 if (data[element.prop].id) {
    //                   data[element.prop] = data[element.prop].id
    //                 } else {
    //                   data[element.prop] = null
    //                 }
    //               }
    //             }
    //           }
    //         })
    //       })
    //     })
    //     .catch(() => {
    //     })
    // }
  }
}
</script>
