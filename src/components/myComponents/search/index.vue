<template>
  <div class="mySearch">
    <!-- <p>查询列表</p> -->
    <el-form :inline="true" :model="searchData" size="mini">
      <template v-for="(item, index) in searchConfig.mainSearch">
        <el-form-item :key="index">
          <!-- input框 -->
          <el-input
            v-if="item.type === 'text'"
            v-model.trim="searchData[item.prop]"
            size="mini"
            :placeholder="item.placeholder || ''"
            clearable
            @input="searchFunc"
            @clear="searchFunc"
          />
          <!-- 下拉远程选择 -->
          <el-select
            v-if="item.type === 'selectRemote'"
            v-model="searchData[item.prop]"
            :placeholder="item.placeholder || '请选择'"
            :style="{ width: item.width }"
            filterable
            :remote="item.remote"
            :multiple="item.multiple ? item.multiple : false"
            :remote-method="
              (query) => {
                selectQuerySearch(query, item.remoteFunc, index)
              }
            "
            clearable
            :value="searchData[item.prop]"
            @clear="searchFunc"
            @change="searchFunc"
            @focus="selectQuerySearch('', item.remoteFunc, index)"
          >
            <el-option
              v-for="(item1, index1) in item.list"
              :key="index1"
              :label="item1.label"
              :value="item1.value"
            />
          </el-select>
          <!--  下拉选择 -->
          <el-select
            v-if="item.type === 'select'"
            v-model.trim="searchData[item.prop]"
            :style="{ width: item.width }"
            clearable
            filterable
            :placeholder="item.placeholder || '请选择'"
            :value="searchData[item.prop]"
            @change="searchFunc"
            @clear="searchFunc"
          >
            <el-option
              v-for="(item1, index1) in item.list"
              :key="index1"
              :label="item1.label"
              :value="item1.value"
            />
          </el-select>
          <!-- daterange日期范围选择 -->
          <el-date-picker
            v-if="item.type === 'daterange'"
            v-model="searchData[item.prop]"
            clearable
            align="right"
            :type="item.itemType"
            :value-format="item.format"
            :format="item.format"
            :placeholder="item.placeholder || ''"
            unlink-panels
            range-separator="至"
            :start-placeholder="item.startPlaceholder || '开始时间'"
            :end-placeholder="item.endPlaceholder || '结束时间'"
            @clear="searchFunc"
            @change="searchFunc"
          />
          <!-- date日期选择 -->
          <el-date-picker
            v-if="item.type === 'date'"
            v-model="searchData[item.prop]"
            :type="item.itemType"
            :format="item.format"
            :placeholder="item.placeholder || ''"
            :value-format="item.format"
            clearable
            size="mini"
            align="right"
            :style="{ width: item.width }"
            @clear="searchFunc"
            @change="searchFunc"
          />
          <!-- 季度选择 -->
          <my-quarter-picker
            v-if="item.type === 'quarter'"
            v-model="searchData[item.prop]"
            :format="item.format"
            :placeholder="item.placeholder || ''"
            :value-format="item.format"
            clearable
            size="mini"
            align="right"
            :style="{ width: item.width }"
            @clear="searchFunc"
            @change="searchFunc"
          />
          <!-- 联级搜索 -->
          <el-cascader
            v-if="item.type === 'cascade'"
            v-model="searchData[item.prop]"
            :placeholder="item.placeholder || ''"
            :options="item.list"
            filterable
            clearable
            :props="{
              value: 'id',
              label: 'name',
              emitPath: false,
            }"
            @focus="
              cascadeQuerySearch(
                item.remoteFunc,
                index,
                item.disabled ? item.disabled : false,
                item.param ? item.param : {}
              )
            "
            @clear.native="searchFunc"
            @change="searchFunc"
          />
        </el-form-item>
      </template>
      <el-link
        v-if="searchConfig.advancedSearch.length > 0"
        class="searchSetting"
        :underline="false"
        @click="openDrawer"
      >
        <i class="el-icon-search" />
      </el-link>
    </el-form>
    <search-drawer
      ref="searchDrawer"
      :advanced-search="searchConfig.advancedSearch"
      :screen-data="screenData"
    />
  </div>
</template>
<script>
import searchDrawer from '@/components/myComponents/search/searchDrawer'
import myQuarterPicker from '@/components/myComponents/quarterPicker'

export default {
  components: { searchDrawer, myQuarterPicker },
  props: {
    searchConfig: {
      type: Object,
      required: true
    },
    searchData: {
      type: Object,
      required: true
    },
    screenData: {
      type: Object,
      required: true
    }
  },
  methods: {
    // 联级选择选择服务器后台搜索
    cascadeQuerySearch(func, index, disabled, param) {
      func({ parent__isnull: 1, ...param })
        .then((response) => {
          let { data } = response
          data = this.getTreeData(data, disabled)
          // console.log(data)
          this.searchConfig.mainSearch[index].list = data
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
    selectQuerySearch(queryString, func, index) {
      func({ search: queryString, page: 1, size: 10 })
        .then((response) => {
          const { data } = response
          this.searchConfig['mainSearch'][index].list = data.map((item) => {
            return { value: item.id, label: item.name }
          })
        })
        .catch(() => {})
    },
    searchFunc() {
      this.$emit('searchFunc', this.searchData)
    },
    openDrawer() {
      this.$refs.searchDrawer.openDrawer()
    }
  }
}
</script>
