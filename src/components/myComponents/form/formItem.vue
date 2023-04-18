<template>
  <div class="myBorder" :style="{ width: item.elCol ? item.elCol : '100%' }">
    <!-- <el-col :span="item.elCol"> -->
    <el-form-item
      v-show="!item.show"
      :key="index1"
      :prop="item.prop"
      :label="item.label"
      :inline-message="true"
    >
      <!-- 单选框 -->
      <el-radio-group
        v-if="item.type === 'radio'"
        v-model="formData[item.prop]"
      >
        <el-radio
          v-for="(item1, index2) in item.optionList"
          :key="index2"
          :label="item1.label"
          :border="item.border"
          :disabled="(formType === 'update' && !item.canUpdate) || item.disabled"
        >
          {{ item1.name }}
        </el-radio>
      </el-radio-group>
      <!-- 多选框 -->
      <el-checkbox-group
        v-if="item.type === 'checkbox'"
        v-model="formData[item.prop]"
      >
        <el-checkbox
          v-for="(item1, index2) in item.optionList"
          :key="index2"
          :label="item1.label"
          :border="item.border"
          :disabled="(formType === 'update' && !item.canUpdate) || item.disabled"
        >
          {{ item1.name }}
        </el-checkbox>
      </el-checkbox-group>
      <!-- number -->
      <el-input-number
        v-if="item.type === 'number'"
        v-model.number="formData[item.prop]"
        :style="{ width: item.width }"
        :disabled="(formType === 'update' && !item.canUpdate) || item.disabled"
        :placeholder="item.placeholder"
        clearable
        :max="item.max"
        :min="item.min"
        :precision="item.precision === undefined ? 2 : item.precision"
        :step="item.step === undefined ? 0.1 : item.step"
      />
      <!-- text -->
      <el-input
        v-if="item.type === 'text'"
        v-model="formData[item.prop]"
        :style="{ width: item.width }"
        :suffix-icon="item.icon"
        :disabled="(formType === 'update' && !item.canUpdate) || item.disabled"
        :placeholder="item.placeholder"
        :clearable="!item.clearable"
      >
        <!-- prepend和append element-ui 自带的插槽 -->
        <template slot="prepend">
          <slot :name="item.prop + 'Prepend'" />
        </template>
        <template slot="append">
          <slot :name="item.prop + 'Append'" />
        </template>
      </el-input>
      <!-- password -->
      <el-input
        v-if="item.type === 'password'"
        v-model="formData[item.prop]"
        :style="{ width: item.width }"
        type="password"
        :disabled="(formType === 'update' && !item.canUpdate) || item.disabled"
        :placeholder="item.placeholder"
        clearable
      />
      <!-- textarea -->
      <el-input
        v-if="item.type === 'textarea'"
        v-model="formData[item.prop]"
        :style="{ width: item.width }"
        :disabled="(formType === 'update' && !item.canUpdate) || item.disabled"
        :placeholder="item.placeholder"
        type="textarea"
        autosize
        clearable
      />
      <!-- 下拉远程选择 -->
      <el-select
        v-if="item.type === 'selectRemote'"
        ref="selectRemote"
        v-model="formData[item.prop]"
        :style="{ width: item.width }"
        :disabled="(formType === 'update' && !item.canUpdate) || item.disabled"
        :placeholder="item.placeholder"
        filterable
        :multiple="item.multiple"
        autocomplete="on"
        :remote="item.remote"
        prefix-icon="el-icon-search"
        :remote-method="
          (query) => {
            selectQuerySearch(
              query,
              item.remoteFunc,
              index,
              index1,
              item.param ? item.param : {}
            )
          }
        "
        clearable
        :value-key="item.prop"
        :value="formData[item.prop]"
        @focus="
          selectQuerySearch(
            '',
            item.remoteFunc,
            index,
            index1,
            item.param ? item.param : {}
          )
        "
      >
        <el-option
          v-for="item2 in item.list"
          :key="item.props ? item2[item.props.value] : item2.id"
          :label="item.props ? item2[item.props.label] : item2.name"
          :value="item.props ? item2[item.props.value] : item2.id"
          :disabled="item2.disabled"
        />
      </el-select>
      <!-- 开关 -->
      <el-switch
        v-if="item.type === 'switch'"
        v-model="formData[item.prop]"
        :style="{ width: item.width }"
        :disabled="(formType === 'update' && !item.canUpdate) || item.disabled"
        :active-color="item.activeColor"
        :inactive-color="item.inactiveColor"
        :active-text="item.activeText"
        :inactive-text="item.inactiveText"
        :width="item.width"
        :active-value="true"
        :inactive-value="false"
      />

      <!-- 下拉选择 -->
      <el-select
        v-if="item.type === 'select'"
        v-model="formData[item.prop]"
        :disabled="(formType === 'update' && !item.canUpdate) || item.disabled"
        :placeholder="item.placeholder"
        :style="{ width: item.width }"
        :multiple="item.multiple ? item.multiple : false"
        clearable
        :value-key="item.prop"
        :value="formData[item.prop]"
      >
        <el-option
          v-for="item2 in item.list"
          :key="item.props ? item2[item.props.value] : item2.value"
          :label="item.props ? item2[item.props.label] : item2.label"
          :value="item.props ? item2[item.props.value] : item2.value"
        />
      </el-select>

      <!-- 联级搜索 -->
      <el-cascader
        v-if="item.type === 'cascade'"
        v-model="formData[item.prop]"
        :style="{ width: item.width }"
        :placeholder="item.placeholder"
        :options="item.list"
        :disabled="(formType === 'update' && !item.canUpdate) || item.disabled"
        clearable
        collapse-tags
        :props="item.props"
        @focus="
          cascadeQuerySearch(
            item.remoteFunc,
            index,
            index1,
            item.disabledCenter ? item.disabledCenter : false,
            item.param ? item.param : {}
          )
        "
      />
      <!-- tree -->
      <my-tree
        v-if="item.type === 'tree'"
        ref="tree"
        :data="item.data"
        show-checkbox
        node-key="id"
        :default-checked-keys="formData[item.prop]"
        :props="item.props"
        @check="
          (ite, checked) => {
            treeCheck(ite, checked, item)
          }
        "
      >
        <div slot-scope="{ node, data }">
          <!-- {{ data }} -->
          <slot :name="item.prop" :node="node" :data="data" />
        </div>
      </my-tree>
      <!-- 日期选择框 -->
      <el-date-picker
        v-if="item.type === 'date' && item.itemType !== 'quarter'"
        v-model="formData[item.prop]"
        :type="item.itemType"
        :placeholder="item.placeholder"
        :disabled="(formType === 'update' && !item.canUpdate) || item.disabled"
        :value-format="item.valueFormat"
        :format="item.format"
        clearable
        align="center"
        :style="{ width: item.width }"
      />
      <!-- 季度选择 -->
      <my-quarter-picker
        v-if="item.type === 'date' && item.itemType === 'quarter'"
        v-model="formData[item.prop]"
        :format="item.format"
        :placeholder="item.placeholder || ''"
        :value-format="item.format"
        clearable
        align="right"
        :style="{ width: item.width }"
      />

      <!-- daterange日期范围选择 -->
      <el-date-picker
        v-if="item.type === 'daterange'"
        v-model="formData[item.prop]"
        clearable
        align="center"
        :type="item.itemType"
        :value-format="item.valueFormat"
        :format="item.format"
        :placeholder="item.placeholder"
        :disabled="(formType === 'update' && !item.canUpdate) || item.disabled"
        unlink-panels
        range-separator="至"
        :start-placeholder="item.startPlaceholder || '开始时间'"
        :end-placeholder="item.endPlaceholder || '结束时间'"
      />
      <!-- 时间选择 -->
      <el-time-select
        v-if="item.type === 'time'"
        v-model="formData[item.prop]"
        :disabled="(formType === 'update' && !item.canUpdate) || item.disabled"
        :placeholder="item.placeholder"
        :value-format="item.valueFormat"
        :picker-options="item.pickerOptions"
        clearable
      />
      <!-- 评分 -->
      <div v-if="item.type === 'rate'" class="myRate">
        <el-rate
          v-model="formData[item.prop]"
          show-text
          :colors="item.colors"
          :texts="item.texts"
          :text-color="item.textColor"
          :disabled="(formType === 'update' && !item.canUpdate) || item.disabled"
        />
      </div>
      <!-- 颜色选择器 -->
      <el-color-picker
        v-if="item.type === 'colorPicker'"
        v-model="formData[item.prop]"
        :show-alpha="item.showAlpha"
        :predefine="item.predefineColors"
        :disabled="(formType === 'update' && !item.canUpdate) || item.disabled"
      />
      <!-- Slider 滑块 -->
      <el-slider
        v-if="item.type === 'slider'"
        v-model="formData[item.prop]"
        :show-tooltip="item.showTooltip"
        :format-tooltip="item.formatTooltip"
        :disabled="(formType === 'update' && !item.canUpdate) || item.disabled"
        :step="item.step"
        :show-stops="item.showStops"
        :show-input="item.showInput"
        :marks="item.marks"
      />
      <!-- JSON输入框 -->
      <div v-if="item.type === 'jsonEditor'">
        <vue-json-editor
          v-model="formData[item.prop]"
          :show-btns="false"
          :mode="'code'"
          @json-change="onJsonChange"
          @json-save="onJsonSave"
          @has-error="onError"
        />
        <el-button type="primary" @click="checkJson">验证格式</el-button>
      </div>

      <!-- 文件上传框 -->
      <el-upload
        v-if="item.type === 'file'"
        class="uploadFile"
        action="https://jsonplaceholder.typicode.com/posts/"
        :http-request="
          (option) => {
            submitUpload(option, item)
          }
        "
        :data="item.extra"
        :on-remove="
          (file, fileList) => {
            onRemove(file, fileList, item.prop)
          }
        "
        :on-preview="onPreview"
        :list-type="item.listType"
        :accept="item.accept"
        :limit="item.limit"
        :disabled="(formType === 'update' && !item.canUpdate) || item.disabled"
        :file-list="item.list"
        :on-exceed="
          (files, fileList) => {
            handleExceed(files, fileList, item.limit)
          }
        "
      >
        <el-link
          icon="el-icon-upload"
          :underline="false"
          class="fontSize12"
          :disabled="
            (formType === 'update' && !item.canUpdate) || item.disabled
          "
        >
          点击上传
        </el-link>
      </el-upload>
      <!--   穿梭框   -->
      <el-transfer
        v-if="item.type === 'transfer'"
        v-model="formData[item.prop]"
        style="text-align: left; display: inline-block"
        filterable
        :left-default-checked="item.leftDefaultChecked || []"
        :right-default-checked="item.rightDefaultChecked || []"
        :titles="item.transferTitles"
        :button-texts="item.buttonTexts"
        :props="item.props"
        :data="item.data"
        :format="{
          noChecked: '${total}',
          hasChecked: '${checked}/${total}',
        }"
      >
        <template slot-scope="{ option }">
          <slot :name="item.prop" :data="option" />
        </template>
        <template slot="left-footer">
          <slot :name="item.prop + 'left-footer'" />
        </template>
        <template slot="right-footer">
          <slot :name="item.prop + 'right-footer'" />
        </template>
      </el-transfer>
      <!--   插槽   -->
      <div v-if="item.type === 'slot'" class="slotInput">
        <slot
          :name="item.prop"
          :data="item.data"
        />
      </div>
    </el-form-item>
    <!-- </el-col> -->
  </div>
</template>
<script>
import myTree from '@/components/myComponents/tree'
import myQuarterPicker from '@/components/myComponents/quarterPicker'
import { isArray } from '@/utils/validate'
import { createFile } from '@/api/system/file'
import vueJsonEditor from 'vue-json-editor'
export default {
  components: { myTree, myQuarterPicker, vueJsonEditor },
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
    item: {
      type: Object,
      required: true
    },
    index1: {
      type: Number,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    formType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      hasJsonFlag: true, // json是否验证通过
      // json数据
      resultInfo: {
        employees: [
          {
            firstName: 'Bill',
            lastName: 'Gates'
          },
          {
            firstName: 'George',
            lastName: 'Bush'
          },
          {
            firstName: 'Thomas',
            lastName: 'Carter'
          }
        ]
      }
    }
  },
  methods: {
    // 联级选择选择服务器后台搜索
    cascadeQuerySearch(func, index, index1, disabled, param) {
      func({ parent__isnull: 1, ...param })
        .then((response) => {
          let { data } = response
          data = this.getTreeData(data, disabled)
          this.formConfig.itemData.groupList[index].groupForm[index1].list =
            data
        })
        .catch(() => {})
    },
    getTreeData(data, disabled) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].children.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].children = undefined
          if (disabled && data[i][disabled.prop] === disabled.value) {
            data[i].disabled = true
          }
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].children, disabled)
        }
      }
      return data
    },
    // 下拉选择服务器后台搜索
    selectQuerySearch(queryString, func, index, index1, param) {
      // this.formConfig[form][index].loading = true
      func({ search: queryString, page: 1, size: 10, ...param })
        .then((response) => {
          const { data } = response
          this.formConfig.itemData.groupList[index].groupForm[index1].list =
            data
          // this.formConfig[form][index].loading = false
        })
        .catch(() => {
          // this.formConfig[form][index].loading = false
        })
    },
    // tree被点击
    treeCheck(ite, checked, item) {
      // console.log(ite, item)
      const checkedKeys = checked.checkedKeys
      const halfCheckedKeys = checked.halfCheckedKeys
      // this.formData[this.formConfig[form][index].prop] =
      //   checkedKeys.concat(halfCheckedKeys)
      this.formData[item.prop] = checkedKeys.concat(halfCheckedKeys)
    },
    handleIconClick(item, i) {
      if (this.formConfig[i].icon === true) {
        if (this.formConfig[i].event === 'focus') {
          this.formConfig[i].event = ''
        } else {
          this.formConfig[i].event = 'focus'
        }
        this.$emit('handleIconClick', { item, i })
      }
    },
    onPreview(file) {
      let path = null
      // eslint-disable-next-line no-prototype-builtins
      if (file.hasOwnProperty('response')) {
        path = file.response.file
      } else {
        path = file.file
      }
      window.open(path)
    },
    handleExceed(files, fileList, limit) {
      this.$message.warning(
        `当前限制选择 ${String(limit)} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      )
    },
    onRemove(file, fileList, prop) {
      let id = null
      // eslint-disable-next-line no-prototype-builtins
      if (file.hasOwnProperty('response')) {
        id = file.response.id
      } else {
        id = file.id
      }
      if (isArray(this.formData[prop])) {
        const index = this.formData[prop].indexOf(id)
        delete this.formData[prop].splice(index, 1)
      } else {
        this.formData[prop] = null
      }
    },
    // JSON输入框
    onJsonChange(value) {
      // console.log('更改value:', value);
      // 实时保存
      this.onJsonSave(value)
    },
    onJsonSave(value) {
      // console.log('保存value:', value);
      this.resultInfo = value
      this.hasJsonFlag = true
    },
    onError(value) {
      // console.log("json错误了value:", value);
      this.hasJsonFlag = false
    },
    // 检查json
    checkJson() {
      if (this.hasJsonFlag === false) {
        // console.log("json验证失败")
        // this.$message.error("json验证失败")
        alert('json验证失败')
        return false
      } else {
        // console.log("json验证成功")
        // this.$message.success("json验证成功")
        alert('json验证成功')
        return true
      }
    },
    submitUpload(option, item) {
      // console.log(option)
      const file = option.file
      const data = option.data
      const formData = new FormData()
      formData.append('file', file)
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key])
      })
      createFile(formData)
        .then((response) => {
          const { data } = response
          if (isArray(this.formData[item.prop])) {
            this.formData[item.prop].push(data.id)
          } else {
            this.formData[item.prop] = data.id
          }
          data['prop'] = item.prop
        })
        .catch()
    }
  }
}
</script>
<style >
/* input {
  height: 66px !important;
} */
.el-transfer-panel .el-transfer-panel__header .el-checkbox {
  display: flex;
  height: 100%;
  align-items: center;
}
.el-transfer-panel__filter {
  margin: 0px;
}
.el-transfer-panel .el-transfer-panel__header .el-checkbox .el-checkbox__label {
  width: 100% !important;
}
.myRate {
  transform: translateY(5px);
}
.myBorder {
  border-right: 1px solid #dcdfe6;
  border-bottom: 1px solid #dcdfe6;
  background-color: #fff;
  padding: 0px 10px 0;
}
div.jsoneditor-menu a.jsoneditor-poweredBy {
  display: none !important;
}
</style>
