<template>
  <div>
    <!-- number -->
    <el-input
      v-if="item.type === 'number'"
      v-model.number="formData[item.prop]"
      type="number"
      :disabled="item.disabled"
      :placeholder="item.placeholder || ''"
      :style="{ width: item.width }"
      clearable
    />
    <!-- password -->
    <el-input
      v-if="item.type === 'password'"
      v-model="formData[item.prop]"
      type="password"
      :disabled="item.disabled"
      :placeholder="item.placeholder || ''"
      :style="{ width: item.width }"
      clearable
    />

    <!-- tree -->
    <el-tree
      v-if="item.type === 'tree'"
      ref="tree"
      :data="item.data"
      show-checkbox
      check-strictly
      node-key="id"
      :default-expanded-keys="formData[item.prop]"
      :default-checked-keys="formData[item.prop]"
      :props="item.props"
      @check="
        (item, checked) => {
          treeCheck(item, checked, index);
        }
      "
    />

    <!-- 下拉选择 -->
    <el-select
      v-if="item.type === 'select'"
      v-model="formData[item.prop]"
      :disabled="item.disabled"
      :placeholder="item.placeholder || '请选择'"
      :style="{ width: item.width }"
      clearable
      :value-key="item.prop"
      :value="formData[item.prop]"
    >
      <el-option
        v-for="(item1, index1) in item.list"
        :key="index1"
        :label="item1.label"
        :value="item1.value"
      />
    </el-select>

    <!-- 下拉远程选择 -->
    <el-select
      v-if="item.type === 'selectRemote'"
      ref="selectRemote"
      v-model="formData[item.prop]"
      :disabled="item.disabled"
      :placeholder="item.placeholder || '请选择'"
      :style="{ width: item.width }"
      filterable
      :multiple="item.multiple"
      autocomplete="on"
      :remote="item.remote"
      :remote-method="
        (query) => {
          selectQuerySearch(query, item.remoteFunc, index);
        }
      "
      clearable
      :value-key="item.prop"
      :value="formData[item.prop]"
      @focus="
        selectQuerySearch('', item.remoteFunc, index)
      "
    >
      <el-option
        v-for="(item1, index1) in item.list"
        :key="index1"
        :label="item1.name"
        :value="item1.id"
        :disabled="item1.disabled"
      />
    </el-select>

    <!-- 单选 -->
    <el-radio-group
      v-if="item.type === 'radio'"
      v-model="formData[item.prop]"
      :disabled="item.disabled"
      :placeholder="item.placeholder || ''"
    >
      <template v-for="(item1, index1) in item.list">
        <el-radio :key="index1" :label="item1.prop">{{
          item1.label
        }}
        </el-radio>
      </template>
    </el-radio-group>

    <!-- 日期选择框 -->
    <el-date-picker
      v-if="item.type === 'date'"
      v-model="formData[item.prop]"
      :type="item.itemType"
      :placeholder="item.placeholder || ''"
      :disabled="item.disabled"
      :value-format="item.format"
      clearable
      size="mini"
      :style="{ width: item.width }"
    />

    <!-- 穿梭框 -->
    <el-transfer
      v-if="item.type === 'transfer'"
      v-model="formData[item.prop]"
      style="text-align: left"
      :data="item.list"
      filterable
      :titles="['可选项', '已选项']"
    />
    <!-- 联级搜索 -->
    <el-cascader
      v-if="item.type === 'cascade'"
      v-model="formData[item.prop]"
      :placeholder="item.placeholder || ''"
      :options="item.list"
      filterable
      clearable
      :props="{
        value:'id',
        label:'name',
        emitPath:false
      }"
      @focus="
        cascadeQuerySearch(item.remoteFunc, index)
      "
    />

  </div>
</template>

<script>
export default {
  name: 'Bak'
}
</script>

<style scoped>

</style>
