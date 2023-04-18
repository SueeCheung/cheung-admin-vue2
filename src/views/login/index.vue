<template>
  <div class="login">
    <el-header class="logoColumn">
      <img class="logo" src="../../icons/jpg/logo.jpg">
      <span class="logoTitle">{{ system_name }}</span>
    </el-header>
    <div class="login-container">
      <img class="img" src="../../icons/png/login.png" alt="">
      <!-- 登录模块 -->
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        autocomplete="on"
        label-position="left"
      >
        <div class="title-container">
          <h3 class="title">账号登录</h3>
        </div>
        <!-- 账号 -->
        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="logoUser" />
          </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="Username"
            name="username"
            type="text"
            tabindex="1"
            autocomplete="on"
          />
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="Password"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon
              :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
            />
          </span>
        </el-form-item>
        <!-- 登录按钮 -->
        <el-button
          :loading="loading"
          type="primary"
          style="width: 100%; margin-bottom: 30px"
          @click.native.prevent="handleLogin"
        >
          登录
        </el-button>
      </el-form>
<!--      <el-dialog-->
<!--        title="认证"-->
<!--        :visible="organization_no === null"-->
<!--        :close-on-click-modal="false"-->
<!--        :close-on-press-escape="false"-->
<!--        append-to-body-->
<!--        :show-close="false"-->
<!--      >-->
<!--        <el-form-->
<!--          ref="sysForm"-->
<!--          label-position="left"-->
<!--          :model="sysValueForm"-->
<!--          autocomplete="on"-->
<!--          size="mini"-->
<!--        >-->
<!--          <el-form-item prop="value" label="系统机构编号">-->
<!--            <el-input-->
<!--              v-model="sysValueForm.value"-->
<!--              style="width: 80%"-->
<!--              clearable-->
<!--              type="text"-->
<!--              size="mini"-->
<!--              placeholder="请输入主系统颁发的机构编号"-->
<!--            />-->
<!--          </el-form-item>-->
<!--        </el-form>-->
<!--        <span slot="footer" class="dialog-footer">-->
<!--          <el-button type="primary" @click="saveOrganizationNo">-->
<!--            确 定-->
<!--          </el-button>-->
<!--        </span>-->
<!--      </el-dialog>-->
    </div>
  </div>
</template>

<script>
import { createSysValue } from '@/api/system/sysValue'
import { mapState } from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      dialogTableVisible: true,
      loginForm: {
        username: 'admin',
        password: 'admin'
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 4, message: '密码大于4个字符', trigger: 'blur' }
        ]
      },
      passwordType: 'password',
      loading: false,
      redirect: undefined,
      otherQuery: {},
      sysValueForm: {
        no: 1,
        name: 'organization_no',
        desc: '系统机构号',
        data_type: 1,
        value: '',
        sys_type: 1
      }
    }
  },
  computed: {
    ...mapState({
      // organization_no: (state) => state.permission.organizationNo,
      system_name: (state) => state.settings.system_name
    })
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          // 获取跳转登录前的地址
          this.redirect = query.redirect
          // 获取跳转登录前的其他参数
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },

  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    // 登录请求
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              // //console.log({ path: this.redirect || '/', query: this.otherQuery })
              this.$router.push({
                path: this.redirect || '/',
                query: this.otherQuery
              })
              this.loading = false
            })
            .catch((error) => {
              const keys = Object.keys(error)
              keys.forEach((key) => {
                this.$refs.loginForm.fields.find(
                  (item) => item.prop === key
                ).validateMessage = error[key][0]
                this.$refs.loginForm.fields.find(
                  (item) => item.prop === key
                ).validateState = 'error'
              })
              this.loading = false
            })
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    saveOrganizationNo() {
      createSysValue(this.sysValueForm)
        .then((response) => {
          const { data } = response
          this.$store.commit('permission/SET_ORGANIZATION_NO', data.value)
        })
        .catch((error) => {
          const keys = Object.keys(error)
          keys.forEach((key) => {
            this.$refs.sysForm.fields.find(
              (item) => item.prop === key
            ).validateMessage = error[key][0]
            this.$refs.sysForm.fields.find(
              (item) => item.prop === key
            ).validateState = 'error'
          })
        })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #283443;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #000;
      height: 47px;
      caret-color: $cursor;

      // &:-webkit-autofill {
      //   box-shadow: 0 0 0px 1000px $bg inset !important;
      //   -webkit-text-fill-color: $cursor !important;
      // }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: #f9f9f9;
    opacity: 0.8;
    border-radius: 5px;
    // color: #454545;
  }
  .elFormItem {
    .el-form-item {
      background: none;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
}
</style>

<style lang="scss" scoped>
$bg: #f9f9f9;
$dark_gray: #889aa4;
$light_gray: #eee;

.login {
  width: 100%;
  height: 100%;
  background-color: #f9f9f9;
  background-size: cover;
  background-image: url(../../icons/jpg/Bglogin.jpg);
  // background: -webkit-linear-gradient(315deg, #10AEFF, #fff);

  .logoColumn {
    display: flex;
    background-color: rgba(255, 255, 255, 0.5);
    // opacity: 0.5;

    .logo {
      height: 50px;
      margin: 5px;
    }
    .logoTitle {
      margin-left: 15px;
      line-height: 60px;
    }
  }
}

.login-container {
  display: flex;
  background: #fff;
  height: 380px;
  width: 800px;
  border-radius: 15px;
  // 居中
  overflow: hidden;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .img {
    position: relative;
    height: 320px;
    max-width: 100%;
    background-color: #fff;
    padding: 10px;
    margin: auto;
    overflow: hidden;
  }
  .login-form {
    position: relative;
    width: 320px;
    // height: ;
    max-width: 100%;
    padding: 65px 20px 20px 20px;
    background-size: 100% 100%;
    background-image: url(../../icons/jpg/login.jpg);
    background-color: #fff;
    // margin: auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 24px;
      color: #1f1e1e;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
