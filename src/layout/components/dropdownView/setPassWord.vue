<template>
  <el-dialog
    v-el-drag-dialog
    width="800px"
    :visible.sync="formVisible"
    :fullscreen="fullscreen"
    :show-close="false"
    append-to-body
    @close="reset"
  >
    <template slot="title">
      <span class="formDialogTitle">
        <svg-icon icon-class="addSvg" />
        修改密码
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
      :opt-func="optFunc"
      :form-rules="formRules"
      :form-data="formData"
      :form-config="formConfig"
      @searchFunc="refresh"
      @closeDialog="formVisible = false"
    />
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

export default {
  name: 'SetPassWord',
  data() {
    var validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码必须大于6位'))
      } else {
        if (this.formData.checkPass !== '') {
          // console.log(this.$refs.publicForm)
          this.$refs.publicForm.$refs.myForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.formData.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      formVisible: false,
      fullscreen: false,
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
                  label: '密码',
                  type: 'password',
                  prop: 'password',
                  canUpdate: true,
                  placeholder: '请输入密码'
                },
                {
                  label: '确认密码',
                  type: 'password',
                  prop: 'checkPass',
                  canUpdate: true,
                  placeholder: '请确认新密码'
                }
              ]
            }
          ]
        }
      },

      formData: {
        password: '',
        checkPass: ''
      },
      formRules: {
        password: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      },
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
    this.formData.id = this.user_info.id
  },
  methods: {
    openDialog() {
      this.formVisible = true
    },
    submitForm() {
      this.$refs.publicForm.submitForm()
    },
    refresh() {
      this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    reset() {
      this.$refs.publicForm.$refs.myForm.resetFields()
      if (this.$refs.publicForm.$refs.tree) {
        this.$refs.publicForm.$refs.tree[0].setCheckedKeys([])
      }
    }
  }
}
</script>

<style scoped>
</style>
