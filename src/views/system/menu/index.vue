<template>
  <div style="display: flex">
    <div class="left">
      <el-card class="myCardBase">
        <my-button
          :button-config="buttonConfig"
          @addItem="addItem"
          @addSonItem="addSonItem"
          @deleteItems="deleteItems"
        />
        <el-input
          v-model="filterText"
          style="margin-top: 10px"
          size="mini"
          clearable
          placeholder="输入关键字进行过滤"
        />
        <el-tree
          ref="tree"
          :data="listData"
          node-key="id"
          show-checkbox
          check-strictly
          highlight-current
          :current-node-key="currentNodeKey"
          :default-expanded-keys="defaultExpandedKeys"
          :props="{ label: 'name', children: 'children' }"
          :filter-node-method="filterNode"
          @node-click="nodeClick"
        >
          <div slot-scope="{ node, data }" class="fontSize12">
            <svg-icon
              v-if="data.meta_icon"
              :icon-class="data.meta_icon"
              style="margin-right: 5px"
            />
            <span style="color: #606266; margin-right: 5px">
              {{ data.no }} {{ node.label }}
            </span>
            <template v-if="data.type === '按钮'">
              <el-tag type="success">按钮</el-tag>
            </template>
            <template v-if="data.type === '其他'">
              <el-tag type="info">其他</el-tag>
            </template>
          </div>
        </el-tree>
      </el-card>
    </div>
    <el-dialog
      v-el-drag-dialog
      width="1200px"
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
            <i class="el-icon-full-screen" @click="fullscreen = !fullscreen" />
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
    <div class="right">
      <el-card class="myCardBase">
        <my-form
          ref="updateForm"
          :form-config="updateFormConfig"
          :form-rules="updateFormRules"
          :form-data="updateFormData"
          :opt-func="optFunc"
          @searchFunc="searchFunc"
        >
          <template v-slot:permissions="prop">
            {{ prop.props.name }}
          </template>
        </my-form>
        <div class="bottomDiv">
          <my-button
            :button-config="updateButtonConfig"
            @updateSubmitForm="updateSubmitForm"
          />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import {
  createMenu,
  getMenuList,
  deleteMenus,
  getMenuInfo,
  updateMenu
} from '@/api/system/menu'
import { getPermissionList } from '@/api/system/permission'
import { treeAndFormOpt } from '@/utils/mixin'
import { getSysTypeList } from '@/api/system/sysType'

export default {
  mixins: [treeAndFormOpt],
  data() {
    return {
      searchConfig: [
        {
          type: 'text',
          key: 'search',
          placeholder: '请输入菜单名称',
          width: 50
        }
      ],
      buttonConfig: [
        {
          label: '添加',
          type: 'dropdown',
          icon: 'el-icon-plus', // 左侧图标
          buttonType: 'primary',
          permission: 'addMenu',
          list: [
            {
              label: '添加同级',
              func: 'addItem'
            },
            {
              label: '添加下级',
              func: 'addSonItem'
            }
          ]
        },
        {
          label: '删除',
          type: 'button',
          icon: 'el-icon-delete', // 左侧图标
          buttonType: '',
          permission: 'delMenus',
          func: 'deleteItems'
        }
      ],
      searchData: {
        search: '',
        parent__isnull: 1,
        ordering: 'no'
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
                  label: '展示名称',
                  type: 'text',
                  prop: 'name',
                  elCol: '50%',
                  placeholder: '请输入展示名称'
                },
                {
                  label: '编号',
                  type: 'text',
                  prop: 'no',
                  elCol: '50%',
                  placeholder: '请输入编号'
                },
                {
                  label: '上一级菜单',
                  type: 'cascade',
                  prop: 'parent',
                  elCol: '50%',
                  remoteFunc: getMenuList,
                  placeholder: '请选择',
                  remote: true,
                  canUpdate: true,
                  props: {
                    value: 'id',
                    label: 'name',
                    emitPath: false,
                    checkStrictly: true
                  },
                  list: []
                },
                {
                  label: '权限名称',
                  type: 'text',
                  prop: 'permission_name',
                  elCol: '50%',
                  placeholder: '请输入权限名称'
                },
                {
                  label: '菜单路径',
                  type: 'text',
                  prop: 'path',
                  elCol: '50%',
                  placeholder: '请输入菜单路径'
                },
                {
                  label: '菜单组件',
                  type: 'text',
                  prop: 'component',
                  elCol: '50%',
                  placeholder: '请输入菜单组件'
                },
                {
                  label: '跳转路径',
                  type: 'text',
                  prop: 'redirect',
                  elCol: '100%',
                  placeholder: '请输入跳转路径'
                }
              ]
            },
            {
              groupName: '',
              groupForm: [
                {
                  label: '菜单图标',
                  type: 'text',
                  prop: 'meta_icon',
                  elCol: '50%',
                  placeholder: '请输入菜单图标'
                },
                {
                  label: '类型',
                  type: 'select',
                  prop: 'type',
                  elCol: '50%',
                  placeholder: '请选择类型',
                  list: [
                     {
                      value: 0,
                      label: '菜单'
                    },
                    {
                      value: 1,
                      label: '页面'
                    },
                    {
                      value: 2,
                      label: '按钮'
                    },
                    {
                      value: 3,
                      label: '其他'
                    }
                  ]
                },
                {
                  label: '系统类别',
                  type: 'selectRemote',
                  prop: 'sys_type',
                  elCol: '50%',
                  remoteFunc: getSysTypeList,
                  placeholder: '请搜素系统类别',
                  remote: true,
                  canUpdate: true,
                  list: []
                },
                {
                  label: '是否隐藏',
                  type: 'switch',
                  prop: 'hidden',
                  elCol: '50%',
                  placeholder: '请选择是否隐藏'
                },
                {
                  label: '根路由显示',
                  type: 'switch',
                  prop: 'always_show',
                  elCol: '50%',
                  placeholder: '请选择根路由显示'
                },
                {
                  label: '是否缓存',
                  type: 'switch',
                  prop: 'meta_noCache',
                  elCol: '50%',
                  placeholder: '请选择是否缓存'
                },
                {
                  label: '面包屑显示',
                  type: 'switch',
                  prop: 'meta_breadcrumb',
                  elCol: '50%',
                  placeholder: '请选择面包屑显示'
                },
                {
                  label: '固定在tags中',
                  type: 'switch',
                  prop: 'meta_affix',
                  elCol: '50%',
                  placeholder: '请选择固定在tags中'
                },
                {
                  label: '管理员显示',
                  type: 'switch',
                  prop: 'only_admin',
                  elCol: '50%',
                  placeholder: '请选择管理员显示'
                },
                {
                  label: '接口权限',
                  type: 'selectRemote',
                  prop: 'permissions',
                  elCol: '50%',
                  remoteFunc: getPermissionList,
                  placeholder: '请搜素接口权限',
                  multiple: true,
                  remote: true,
                  canUpdate: true,
                  list: []
                }
              ]
            }
          ]
        }
      },

      formData: {
        parent: '',
        name: '',
        path: '',
        no: '',
        type: 0,
        sys_type: '',
        permission_name: '',
        component: '',
        redirect: '',
        meta_active_menu: '',
        meta_icon: '',
        hidden: false,
        meta_breadcrumb: true,
        meta_noCache: false,
        always_show: false,
        meta_affix: false,
        only_admin: false,
        permissions: []
      },
      formRules: {
        no: [{ required: true, message: '请输入编号', trigger: 'blur' }],
        sys_type_id: [
          { required: true, message: '请选择系统类别', trigger: 'blur' }
        ],
        name: [{ required: true, message: '请输入展示名称', trigger: 'blur' }],
        path: [{ required: true, message: '请输入菜单路径', trigger: 'blur' }],
        permission_name: [
          { required: true, message: '请输入权限名称', trigger: 'blur' }
        ],
        sys_type: [{ required: true, message: '请选择系统类型', trigger: 'blur' }]
      },

      updateFormConfig: {
        size: 'small',
        formType: 'update', // formType取值: update修改 create新增 review查看
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
                  label: '展示名称',
                  type: 'text',
                  prop: 'name',
                  elCol: '50%',
                  canUpdate: true,
                  placeholder: '请输入展示名称'
                },
                {
                  label: '编号',
                  type: 'text',
                  prop: 'no',
                  elCol: '50%',
                  canUpdate: true,
                  placeholder: '请输入编号'
                },
                {
                  label: '上一级菜单',
                  type: 'cascade',
                  prop: 'parent',
                  elCol: '50%',
                  remoteFunc: getMenuList,
                  placeholder: '请选择',
                  remote: true,
                  canUpdate: false,
                  disabled: true,
                  props: {
                    value: 'id',
                    label: 'name',
                    emitPath: false,
                    checkStrictly: true
                  },
                  list: []
                },
                {
                  label: '权限名称',
                  type: 'text',
                  prop: 'permission_name',
                  elCol: '50%',
                  canUpdate: true,
                  placeholder: '请输入权限名称'
                },
                {
                  label: '菜单路径',
                  type: 'text',
                  prop: 'path',
                  elCol: '50%',
                  canUpdate: true,
                  placeholder: '请输入菜单路径'
                },
                {
                  label: '菜单组件',
                  type: 'text',
                  prop: 'component',
                  elCol: '50%',
                  canUpdate: true,
                  placeholder: '请输入菜单组件'
                },
                {
                  label: '跳转路径',
                  type: 'text',
                  prop: 'redirect',
                  elCol: '100%',
                  canUpdate: true,
                  placeholder: '请输入跳转路径'
                }
              ]
            },
            {
              groupName: '',
              groupForm: [
                {
                  label: '菜单图标',
                  type: 'text',
                  prop: 'meta_icon',
                  elCol: '50%',
                  canUpdate: true,
                  placeholder: '请输入菜单图标'
                },
                {
                  label: '类型',
                  type: 'select',
                  prop: 'type',
                  elCol: '50%',
                  canUpdate: true,
                  placeholder: '请选择类型',
                  list: [
                     {
                      value: 0,
                      label: '菜单'
                    },
                    {
                      value: 1,
                      label: '页面'
                    },
                    {
                      value: 2,
                      label: '按钮'
                    },
                    {
                      value: 3,
                      label: '其他'
                    }
                  ]
                },
                {
                  label: '系统类别',
                  type: 'selectRemote',
                  prop: 'sys_type',
                  elCol: '50%',
                  remoteFunc: getSysTypeList,
                  placeholder: '请搜素系统类别',
                  remote: true,
                  canUpdate: true,
                  list: []
                },
                {
                  label: '是否隐藏',
                  type: 'switch',
                  prop: 'hidden',
                  elCol: '50%',
                  canUpdate: true,
                  placeholder: '请选择是否隐藏'
                },
                {
                  label: '根路由显示',
                  type: 'switch',
                  prop: 'always_show',
                  elCol: '50%',
                  canUpdate: true,
                  placeholder: '请选择根路由显示'
                },
                {
                  label: '是否缓存',
                  type: 'switch',
                  prop: 'meta_noCache',
                  elCol: '50%',
                  canUpdate: true,
                  placeholder: '请选择是否缓存'
                },
                {
                  label: '面包屑显示',
                  type: 'switch',
                  prop: 'meta_breadcrumb',
                  elCol: '50%',
                  canUpdate: true,
                  placeholder: '请选择面包屑显示'
                },
                {
                  label: '固定在tags中',
                  type: 'switch',
                  prop: 'meta_affix',
                  elCol: '50%',
                  canUpdate: true,
                  placeholder: '请选择固定在tags中'
                },
                {
                  label: '管理员显示',
                  type: 'switch',
                  prop: 'only_admin',
                  elCol: '50%',
                  canUpdate: true,
                  placeholder: '请选择管理员显示'
                },
                {
                  label: '接口权限',
                  type: 'selectRemote',
                  prop: 'permissions',
                  elCol: '50%',
                  remoteFunc: getPermissionList,
                  placeholder: '请搜素接口权限',
                  multiple: true,
                  remote: true,
                  canUpdate: true,
                  list: []
                }
                // {
                //   label: '接口权限',
                //   type: 'transfer',
                //   prop: 'permissions',
                //   canUpdate: true,
                //   props: {
                //     key: 'id',
                //     label: 'name'
                //   },
                //   elCol: '100%',
                //   transferTitles: ['全部', '已选择'],
                //   leftDefaultChecked: [],
                //   rightDefaultChecked: [],
                //   buttonTexts: ['到左边', '到右边'],
                //   data: []
                // }
              ]
            }
          ]
        }
      },
      updateFormData: {
        parent: '',
        name: '',
        path: '',
        no: '',
        type: 0,
        permission_name: '',
        component: '',
        redirect: '',
        sys_type: '',
        meta_active_menu: '',
        meta_icon: '',
        hidden: false,
        meta_breadcrumb: true,
        meta_noCache: false,
        always_show: false,
        meta_affix: false,
        only_admin: false,
        permissions: []
      },
      updateFormRules: {
        no: [{ required: true, message: '请输入编号', trigger: 'blur' }],
        sys_type_id: [
          { required: true, message: '请选择系统类别', trigger: 'blur' }
        ],
        name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        path: [{ required: true, message: '请输入菜单路径', trigger: 'blur' }],
        permission_name: [
          { required: true, message: '请输入权限名称', trigger: 'blur' }
        ],
        sys_type: [{ required: true, message: '请选择系统类型', trigger: 'blur' }]
      },
      updateButtonConfig: [
        {
          label: '保存',
          type: 'button',
          icon: 'el-icon-folder-checked', // 左侧图标
          buttonType: 'primary',
          permission: 'saveMenu',
          func: 'updateSubmitForm'
        }
      ],
      optFunc: {
        create: createMenu,
        update: updateMenu,
        delete: deleteMenus,
        list: getMenuList,
        info: getMenuInfo
      }
    }
  },
  mounted() {
    getPermissionList({ size: 500 }).then((res) => {
      this.updateFormConfig.itemData.groupList.forEach((ele) => {
        ele.groupForm.forEach((element) => {
          if (element.type === 'transfer') {
            element.data = res.data
          }
        })
      })
    })
  }
}
</script>

<style lang="scss" scoped>
.left {
  width: 400px;

  .el-card {
    max-height: calc(100vh - 120px);
    overflow: auto;
    .el-tree {
      border-top: 1px solid #dee5eb;
      margin-top: 10px;
      padding-top: 5px;
    }
  }
}

.right {
  width: 100%;
  .bottomDiv {
    display: flex;
    margin-top: 15px;
    .myButton {
      margin: auto;
    }
  }
}
</style>
