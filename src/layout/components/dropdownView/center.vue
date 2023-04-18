<template>
  <el-dialog
    title="个人中心"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    width="800px"
  >
    <my-form
      ref="publicForm"
      :opt-func="optFunc"
      :form-rules="formRules"
      :form-data="formData"
      :form-config="formConfig"
      @closeDialog="dialogVisible = false"
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
    <div class="bottomDiv">
      <my-button :button-config="ButtonConfig" @submitForm="submitForm" />
    </div>
  </el-dialog>
</template>

<script>
import {
  createUser,
  deleteUser,
  getUserInfo,
  getUserList,
  updateUser
} from '@/api/system/user'
import { mapGetters } from 'vuex'
import cropper from '@/components/myComponents/cropper'

export default {
  name: 'Center',
  components: { cropper },
  data() {
    return {
      cropperExtra: {
        type: 1
      },
      dialogVisible: false,
      ButtonConfig: [
        {
          label: '保存',
          type: 'button',
          icon: 'el-icon-folder-checked', // 左侧图标
          buttonType: 'primary',
          permission: 'saveMenu',
          func: 'submitForm'
        }
      ],

      formConfig: {
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
                  label: '头像',
                  type: 'slot',
                  prop: 'avatar',
                  data: {}
                },
                {
                  label: '姓名',
                  type: 'text',
                  prop: 'name',
                  elCol: '100%',
                  canUpdate: true,
                  placeholder: '请输入姓名'
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
        name: '',
        desc: '',
        avatar: ''
      },
      formRules: {},
      optFunc: {
        update: updateUser,
        create: createUser,
        delete: deleteUser,
        list: getUserList,
        info: getUserInfo
      }
    }
  },
  computed: {
    ...mapGetters(['user_info'])
  },
  mounted() {
    this.formData.name = this.user_info.name
    this.formData.desc = this.user_info.desc
    this.formData.id = this.user_info.id
    if (this.user_info.avatar.id) {
      this.formData.avatar = this.user_info.avatar.id
    } else {
      this.formData.avatar = null
    }
    this.formConfig.itemData.groupList[0].groupForm[0].data = this.user_info.avatar
  },
  methods: {
    openDialog() {
      this.dialogVisible = true
    },
    fileCallBack(data) {
      this.formConfig.itemData.groupList[0].groupForm[0].data = data
      this.formData.avatar = data.id
    },
    submitForm() {
      this.$refs.publicForm.submitForm()
    }
  }
}
</script>

<style lang="scss" scoped>
.my-avatar {
  display: grid;
  justify-items: center;
}
.bottomDiv {
  display: flex;
  margin-top: 15px;

  .myButton {
    margin: auto;
  }
}
</style>
