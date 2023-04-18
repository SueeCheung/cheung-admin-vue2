<template>
  <el-drawer
    title="筛选"
    :visible.sync="drawer"
    :modal="false"
    size="410px"
    :show-close="false"
  >
    <template slot="title">
      <span class="searchDrawerTitle">
        <svg-icon icon-class="addSvg" />
        筛选
      </span>
      <el-button type="primary" @click="search">确定</el-button>
      <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
      <el-link :underline="false" @click="drawer = false"><i class="el-icon-close" /></el-link>
    </template>
    <div class="searchDrawerForm">
      <el-form ref="drawerForm" :model="form" size="mini" label-width="70px" label-position="left">
        <el-form-item v-for="(item,index) in advancedSearch" :key="index" :label="item.label">
          <template v-if="item.type==='text'">
            <el-select v-model="screenData[item.prop]['condition']" class="searchCondition" placeholder="请选择" clearable>
              <el-option
                v-for="item1 in textCondition"
                :key="item1.value"
                :label="item1.label"
                :value="item1.value"
              />
            </el-select>
            <el-autocomplete
              v-model="screenData[item.prop]['value']"
              class="searchText"
              autocomplete="off"
              :fetch-suggestions="(queryString, cb)=>{querySearch(queryString, cb,item.list ? item.list:[])}"
              clearable
              :placeholder="item.placeholder"
            />
          </template>
          <template v-if="item.type==='number'">
            <el-select v-model="screenData[item.prop]['condition']" class="searchCondition" placeholder="请选择" clearable>
              <el-option
                v-for="item1 in numberCondition"
                :key="item1.value"
                :label="item1.label"
                :value="item1.value"
              />
            </el-select>
            <el-input-number
              v-model="screenData[item.prop]['value']"
              class="searchText"
              autocomplete="off"
              clearable
              :placeholder="item.placeholder"
            />
          </template>
          <template v-if="item.type==='selectRemote'">
            <el-select v-model="screenData[item.prop]['condition']" class="searchCondition" placeholder="请选择" clearable :disabled="item.activate">
              <el-option
                v-for="item1 in selectRemoteCondition"
                :key="item1.value"
                :label="item1.label"
                :value="item1.value"
              />
            </el-select>
            <!-- 下拉远程选择 -->
            <el-select
              ref="selectRemote"
              v-model="screenData[item.prop]['value']"
              class="searchSelect"
              :placeholder="item.placeholder || '请选择'"
              filterable
              :multiple="item.multiple"
              :disabled="item.activate"
              autocomplete="on"
              :loading="item.loading"
              :remote="item.remote"
              prefix-icon="el-icon-search"
              collapse-tags
              :remote-method="
                (query) => {
                  selectQuerySearch(query, item.remoteFunc,index,item.param?item.param:{});
                }
              "
              clearable
              :value-key="item.prop"
              :value="screenData[item.prop]['value']"
              @focus="
                selectQuerySearch('', item.remoteFunc, index,item.param?item.param:{})
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
          </template>
          <template v-if="item.type==='cascade'">
            <el-select
              v-model="screenData[item.prop]['condition']"
              class="searchCondition"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item1 in cascadeCondition"
                :key="item1.value"
                :label="item1.label"
                :value="item1.value"
              />
            </el-select>
            <!-- 联级搜索 -->
            <el-cascader
              v-model="screenData[item.prop]['value']"
              :placeholder="item.placeholder || ''"
              :options="item.list"
              size="mini"
              class="searchCascader"
              :show-all-levels="false"
              collapse-tags
              clearable
              :props="item.props"
              @focus="
                cascadeQuerySearch(item.remoteFunc, index,item.disabled?item.disabled:false,item.param?item.param:{})
              "
            />
          </template>
          <template v-if="item.type==='select'">
            <el-select
              v-model="screenData[item.prop]['condition']"
              class="searchCondition"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item1 in selectCondition"
                :key="item1.value"
                :label="item1.label"
                :value="item1.value"
              />
            </el-select>
            <!--  下拉选择 -->
            <el-select
              v-model.trim="screenData[item.prop]['value']"
              class="searchSelect"
              clearable
              filterable
              :multiple="item.multiple"
              collapse-tags
              :placeholder="item.placeholder || '请选择'"
              :value="screenData[item.prop]['value']"
            >
              <el-option
                v-for="(item1, index1) in item.list"
                :key="index1"
                :label="item1.label"
                :value="item1.value"
              />
            </el-select>
          </template>
          <template v-if="item.type==='date'">
            <el-select
              v-model="screenData[item.prop]['condition']"
              class="searchCondition"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item1 in dateCondition"
                :key="item1.value"
                :label="item1.label"
                :value="item1.value"
              />
            </el-select>
            <el-date-picker
              v-model="screenData[item.prop]['value']"
              class="searchDate"
              :type="item.itemType"
              :placeholder="item.placeholder || ''"
              :value-format="item.format"
              clearable
              size="mini"
            />
          </template>
        </el-form-item>
      </el-form>
    </div>
  </el-drawer>
</template>

<script>
import { isArray, isString, isNumber } from '@/utils/validate'

export default {
  props: {
    advancedSearch: {
      type: Array,
      required: true
    },
    screenData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      drawer: false,
      form: {},
      textCondition: [
        {
          value: '__iexact',
          label: '等于'
        },
        {
          value: '__!iexact',
          label: '不等于'
        },
        {
          value: '__icontains',
          label: '包含'
        },
        {
          value: '__istartswith',
          label: '开头为'
        },
        {
          value: '__iendswith',
          label: '结束为'
        }
      ],
      selectRemoteCondition: [
        {
          value: '__in',
          label: '包含'
        },
        {
          value: '__!in',
          label: '不包含'
        }
      ],
      selectCondition: [
        {
          value: '__in',
          label: '包含'
        },
        {
          value: '__!in',
          label: '不包含'
        }
      ],
      cascadeCondition: [
        {
          value: '__in',
          label: '包含'
        },
        {
          value: '__!in',
          label: '不包含'
        }
      ],
      numberCondition: [
        {
          value: '__gt',
          label: '大于'
        },
        {
          value: '__lt',
          label: '小于'
        },
        {
          value: '__iexact',
          label: '等于'
        },
        {
          value: '__!iexact',
          label: '不等于'
        }
      ],
      dateCondition: [
        {
          value: '__gt',
          label: '大于'
        },
        {
          value: '__lt',
          label: '小于'
        },
        {
          value: '__iexact',
          label: '等于'
        },
        {
          value: '__!iexact',
          label: '不等于'
        }
      ]
    }
  },
  watch: {
    // 计算属性的 getter
    screenData: {
      deep: true,
      handler() {
        const tagList = []
        Object.keys(this.screenData).forEach(key => {
          const item = this.screenData[key] // 获取每一个筛选值obj
          if (item.condition) { // 如果筛选值obj有条件
            if ((!isArray(item.value) && item.value) || (isArray(item.value) && item.value.length > 0)) { // 如果筛选值obj有值
              const advancedSearchObj = this.advancedSearch.find((obj) => { // 获取当前的筛选的配置
                return obj.prop === key // 筛选出匹配的数据
              })
              const tagObj = {}
              tagObj['value'] = ''
              tagObj['key'] = key // 用于删除tag 响应到screenData
              tagObj['label'] = advancedSearchObj.label // 用于展示搜素字段
              const conditionObj = this[advancedSearchObj.type + 'Condition'].find((obj) => { // 获取当前的选中的条件
                return obj.value === item.condition // 筛选出匹配的数据
              })
              tagObj['condition'] = conditionObj.label // 获取条件的label
              if (advancedSearchObj.type === 'text' || advancedSearchObj.type === 'number' || advancedSearchObj.type === 'date') {
                tagObj['value'] = item.value // 获取值
              } else if (advancedSearchObj.type === 'selectRemote') {
                const valueList = []
                item.value.forEach((value, index) => {
                  advancedSearchObj.list.forEach((obj) => {
                    if (obj.id === value) {
                      valueList.push(obj.name) // 获取值
                    }
                  })
                })
                tagObj['value'] = valueList.join(',')
              } else if (advancedSearchObj.type === 'select') {
                const valueList = []
                item.value.forEach((value, index) => {
                  advancedSearchObj.list.forEach((obj) => {
                    if (obj.value === value) {
                      valueList.push(obj.label) // 获取值
                    }
                  })
                })
                tagObj['value'] = valueList.join(',')
              } else if (advancedSearchObj.type === 'cascade') {
                const valueList = this.getCascadeData(advancedSearchObj.list, item.value)
                tagObj['value'] = valueList.join(',')
              }
              tagList.push(tagObj)
            }
          }
        })
        this.$bus.$emit('setTag', tagList)
      }
    }
  },
  methods: {
    getCascadeData(objs, value) {
      const valueList = []
      objs.forEach((obj) => {
        if (value.indexOf(obj.id) !== -1) {
          valueList.push(obj.name)
        }
        if (obj.children !== undefined) {
          valueList.push(...this.getCascadeData(obj.children, value))
        }
      })
      return valueList
    },
    querySearch(queryString, cb, list) {
      var results = queryString ? list.filter(this.createFilter(queryString)) : list
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    openDrawer() {
      this.drawer = true
    },
    // 联级选择选择服务器后台搜索
    cascadeQuerySearch(func, index, disabled, param) {
      func({ parent__isnull: 1, ...param })
        .then((response) => {
          let { data } = response
          data = this.getTreeData(data, disabled)
          this.advancedSearch[index].list = data
        })
        .catch(() => {
        })
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
    selectQuerySearch(queryString, func, index, param) {
      this.advancedSearch[index].loading = true
      func({ search: queryString, page: 1, size: 10, ...param })
        .then((response) => {
          const { data } = response
          this.advancedSearch[index].list = data
          this.advancedSearch[index].loading = false
        })
        .catch(() => {
          this.advancedSearch[index].loading = false
        })
    },
    search() {
      this.$bus.$emit('search')
      this.drawer = false
    },
    reset() {
      Object.keys(this.screenData).forEach(key => {
        this.screenData[key].condition = ''
        if (isArray(this.screenData[key].value)) {
          this.screenData[key].value = []
        } else if (isString(this.screenData[key].value)) {
          this.screenData[key].value = ''
        } else if (isNumber(this.screenData[key].value)) {
          this.screenData[key].value = undefined
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
