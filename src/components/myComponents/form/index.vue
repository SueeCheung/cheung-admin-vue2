<template>
  <el-form
    ref="myForm"
    class="myForm"
    :label-position="formConfig.labelPosition || 'left'"
    :label-width="formConfig.labelWidth || '90px'"
    :inline-message="formConfig.inlineMessage"
    :label-suffix="formConfig.labelSuffix || ':'"
    :validate-on-rule-change="false"
    :disabled="formConfig.formType === 'review'"
    :model="formData"
    :rules="formRules"
    :inline="false"
    :size="formConfig.size || 'small'"
  >
    <div v-if="formConfig.itemData.groupType === 'text'">
      <template v-for="(form, index) in formConfig.itemData.groupList">
        <div
          v-if="form['groupForm'].length > 0"
          :key="index"
          :class="form.groupName"
        >
          <h2 v-if="form.groupName">{{ form.groupName }}</h2>
          <div class="formItem clearfix formFlex">
            <form-item
              v-for="(item, index1) in form.groupForm"
              :key="index1"
              :form-type="formConfig.formType"
              :item="item"
              :index="index"
              :index1="index1"
              :form-config="formConfig"
              :form-data="formData"
              :form-rules="formRules"
            >
              <!--      text        -->
              <template :slot="item.prop + 'Prepend'">
                <slot :name="item.prop + 'Prepend'" />
              </template>
              <template :slot="item.prop + 'Append'">
                <slot :name="item.prop + 'Append'" />
              </template>
              <!--      穿梭框        -->
              <template :slot="item.prop + 'left-footer'">
                <slot :name="item.prop + 'left-footer'" />
              </template>
              <template :slot="item.prop + 'right-footer'">
                <slot :name="item.prop + 'right-footer'" />
              </template>
              <template :slot="item.prop" slot-scope="prop">
                <!-- {{ prop.data }} -->
                <slot :name="item.prop" :props="prop.data" />
              </template>

            </form-item>
          </div>
        </div>
      </template>
    </div>
    <div v-else-if="formConfig.itemData.groupType === 'tabs'">
      <template>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane
            v-for="(form, index) in formConfig.itemData.groupList"
            :key="index"
            :label="form.groupName"
            :name="'tabName' + index"
          >
            <div class="formItem clearfix formFlex">
              <form-item
                v-for="(item, index1) in form.groupForm"
                :key="index1"
                :form-type="formConfig.formType"
                :item="item"
                :index1="index1"
                :form-config="formConfig"
                :form-data="formData"
                :form-rules="formRules"
              >
                <!--      text        -->
                <template :slot="item.prop + 'Prepend'">
                  <slot :name="item.prop + 'Prepend'" />
                </template>
                <template :slot="item.prop + 'Append'">
                  <slot :name="item.prop + 'Append'" />
                </template>
                <!--      穿梭框        -->
                <template :slot="item.prop + 'left-footer'">
                  <slot :name="item.prop + 'left-footer'" />
                </template>
                <template :slot="item.prop + 'right-footer'">
                  <slot :name="item.prop + 'right-footer'" />
                </template>
                <template :slot="item.prop" slot-scope="prop">
                  <!-- {{ prop.data }} -->
                  <slot :name="item.prop" :props="prop.data" />
                </template>
              </form-item>
            </div>
          </el-tab-pane>
        </el-tabs>
      </template>
    </div>
    <div v-else-if="formConfig.itemData.groupType === 'collapse'">
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item
          v-for="(form, index) in formConfig.itemData.groupList"
          :key="index"
          :title="form.groupName"
          :disabled="index === 0"
          :name="index.toString()"
        >
          <div class="formItem clearfix formFlex">
            <form-item
              v-for="(item, index1) in form.groupForm"
              :key="index1"
              :form-type="formConfig.formType"
              :item="item"
              :index1="index1"
              :form-config="formConfig"
              :form-data="formData"
              :form-rules="formRules"
            >
              <!--      text        -->
              <template :slot="item.prop + 'Prepend'">
                <slot :name="item.prop + 'Prepend'" />
              </template>
              <template :slot="item.prop + 'Append'">
                <slot :name="item.prop + 'Append'" />
              </template>
              <!--      穿梭框        -->
              <template :slot="item.prop + 'left-footer'">
                <slot :name="item.prop + 'left-footer'" />
              </template>
              <template :slot="item.prop + 'right-footer'">
                <slot :name="item.prop + 'right-footer'" />
              </template>
              <template :slot="item.prop" slot-scope="prop">
                <!-- {{ prop.data }} -->
                <slot :name="item.prop" :props="prop.data" />
              </template>
            </form-item>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <template v-if="formConfig.tabData">
      <div v-for="item in formConfig.tabData" :key="item.id" class="tabSlot">
        <slot :name="item.prop" :props="item" />
      </div>
    </template>
  </el-form>
</template>
<script>
import formItem from './formItem'

export default {
  components: { formItem },
  props: {
    formConfig: {
      // 表单配置数据
      type: Object,
      required: true
    },
    formData: {
      // 表单显示数据
      type: Object,
      required: true
    },
    formRules: {
      // 表单验证
      type: Object,
      required: true
    },
    optFunc: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      activeName: 'tabName0',
      activeNames: ['0']
    }
  },
  watch: {
    // 监听form表单数据
    formData: {
      deep: true,
      handler() {
        for (const key in this.formData) {
          if (this.formData[key] === '') {
            this.formData[key] = null
          }
        }
      }
    }
  },
  mounted() {
    // 去除slider边框
    if (this.$el.querySelector('.el-slider')) {
      const elm = this.$el.querySelector('.el-slider').parentNode.parentNode
      elm.style.border = 'none'
    }
    if (this.$el.querySelector('.el-color-picker__trigger')) {
      const trigger = this.$el.querySelector('.el-color-picker__trigger')
        .parentNode.parentNode
      trigger.style.height = '32px'
    }

    document
      .getElementsByTagName('body')[0]
      .style.setProperty('--test', this.formConfig.inlineWidth)
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    handleChange(val) {
      console.log(val)
    },
    openFormDialog() {
      this.formVisible = true
    },
    submitForm() {
      // 表单验证事件 父组件调用
      this.$refs.myForm.validate((valid) => {
        if (valid) {
          let func = NaN
          // return //console.log('不保存')
          if (this.formConfig.formType === 'update') {
            // 一个更新接口, type作为不同修改的类型
            // func = this.optFunc.update(this.formData.id, this.formData, type: this.formConfig.requestType)
            func = this.optFunc.update(this.formData.id, this.formData)
          } else {
            func = this.optFunc.create(this.formData)
          }
          func
            .then(() => {
              // 提示成功
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              // 重置
              this.$emit('searchFunc')
              this.$emit('closeDialog')
            })
            .catch((error) => {
              const keys = Object.keys(error)
              keys.forEach((key) => {
                this.$refs.myForm.fields.find(
                  (item) => item.prop === key
                ).validateMessage = error[key][0]
                this.$refs.myForm.fields.find(
                  (item) => item.prop === key
                ).validateState = 'error'
              })
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style>
.myForm * {
  font-size: 12px;
}

.formFlex {
  display: flex;
  flex-wrap: wrap;
}

.myForm .formItem {
  border-top: 1px solid #dcdfe6;
  border-left: 1px solid #dcdfe6;
  margin-bottom: 10px;
}

.myForm .el-form-item {
  background-color: #fff;
  margin-bottom: 0 !important;
  padding: 5px 0;
  box-sizing: border-box;
}

/* .el-form-item__content {
  height: 32px !important;
} */
.myForm .el-input-group__prepend ~ .el-input__inner {
  border-color: #dcdfe6 !important;
}

.myForm .el-input-group__append ~ .el-input__inner {
  border-color: #dcdfe6 !important;
}

/* .el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item,
.el-form-item--medium.el-form-item {
  box-sizing: border-box;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  padding: 4px 8px;
  margin: 0 5px 10px;
} */
.myForm .el-input-number .el-input__inner {
  border-color: #dcdfe6;
}

.myForm .el-input__inner,
.myForm .el-input.is-disabled .el-input__inner,
.myForm .el-textarea__inner,
.myForm .el-input.is-disabled .el-textarea__inner {
  border-color: rgba(0, 0, 0, 0);
}
/* input hover时的颜色 */
.myForm .el-textarea__inner:hover,
.myForm .el-input__inner:hover {
  outline: none;
  border: 1px solid #c0c4cc;
}
/* input聚焦时的颜色 */
.myForm .el-textarea__inner:focus,
.myForm .el-input__inner:focus {
  border-color: #409eff;
}

.myForm .el-radio.is-bordered,
.myForm .el-checkbox.is-bordered {
  border: none;
  box-sizing: border-box;
}

.myForm .el-radio.is-bordered.is-checked,
.myForm .el-checkbox.is-bordered.is-checked {
  border: 1px solid #409eff;
}

/*影响角色管理树形菜单展示样式*/
/*.myForm .el-checkbox__input,*/
/*.myForm .el-checkbox__label {*/
/*  transform: translateY(3px);*/
/*}*/

.myForm .el-form--inline .el-form-item {
  margin-right: 0px;
  padding-right: 10px;
  box-sizing: border-box;
}

.myForm .clearfix:after {
  content: '020';
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

.myForm .el-select{
  width: 100%;
}

/* .odd .otherForm .formItem .el-form-item:last-child{
  width: 100%;
} */
</style>

<style lang="scss" scoped>
$width: var(--test);
.el-form-item {
  width: $width;
}
</style>

