<template>
  <div>
    <div class="chartHeard">
      <div class="chartTitle">
        <span class="svg-container">
          <svg-icon icon-class="pie" />
        </span>
        <span>
          {{ title }}
        </span>
      </div>
      <div v-if="searchConfig!==null" class="chartSearch">
        <template v-for="(item,index) in searchConfig">
          <!-- 下拉远程选择 -->
          <el-select
            v-if="item.type==='selectRemote'"
            :key="index"
            ref="selectRemote"
            v-model="searchData[item.prop]"
            size="mini"
            :placeholder="item.placeholder || '请选择'"
            filterable
            :multiple="item.multiple"
            autocomplete="on"
            :remote="item.remote"
            prefix-icon="el-icon-search"
            :remote-method="
              (query) => {
                selectQuerySearch(query, item.remoteFunc,index,item.param?item.param:{});
              }
            "
            clearable
            :value-key="item.prop"
            :value="searchData[item.prop]"
            @focus="
              selectQuerySearch('', item.remoteFunc,index,item.param?item.param:{})
            "
            @clear="search"
            @change="search"
          >
            <el-option
              v-for="(item2, index2) in item.list"
              :key="index2"
              :label="item2.name"
              :value="item2.id"
              :disabled="item2.disabled"
            />
          </el-select>
          <!--  下拉选择 -->
          <el-select
            v-if="item.type === 'select'"
            :key="index"
            v-model.trim="searchData[item.prop]"
            size="mini"
            filterable
            :placeholder="item.placeholder || '请选择'"
            :value="searchData[item.prop]"
            @change="search"
            @clear="search"
          >
            <el-option
              v-for="(item1, index1) in item.list"
              :key="index1"
              :label="item1.label"
              :value="item1.value"
            />
          </el-select>
          <!-- 联级搜索 -->
          <el-cascader
            v-if="item.type === 'cascade'"
            :key="index"
            v-model="searchData[item.prop]"
            size="mini"
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
              cascadeQuerySearch(item.remoteFunc, index,item.disabled?item.disabled:false,item.param?item.param:{})
            "
            @clear="search"
            @change="search"
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
            @clear="search"
            @change="search"
          />
        </template>
      </div>
    </div>
    <div :class="className" :style="{height:height,width:width}" />
  </div>
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '500px'
    },
    title: {
      type: String,
      required: true
    },
    searchConfig: {
      type: Array,
      default: null
    },
    searchData: {
      type: Object,
      default: null
    },
    funcObj: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      chart: null,
      source: []
    }
  },
  watch: {
    // 观察option的变化
    source: {
      deep: true, // 对象内部属性的监听，关键。
      handler(newVal, oldVal) {
        if (this.chart) {
          if (newVal) {
            this.setOption(newVal)
          } else {
            this.setOption(oldVal)
          }
        } else {
          this.chartInit()
        }
      }
    }
  },
  mounted() {
    this.search()
    this.$nextTick(() => {
      this.chartInit()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    chartInit() {
      this.chart = echarts.init(this.$el.lastChild, 'macarons')
      this.chart.on('updateAxisPointer', (event) => {
        const xAxisInfo = event.axesInfo[0]
        if (xAxisInfo) {
          const dimension = xAxisInfo.value + 1
          this.chart.setOption({
            series: {
              id: 'pie',
              label: {
                formatter: '{b}: {@[' + dimension + ']} ({d}%)'
              },
              encode: {
                value: dimension,
                tooltip: dimension
              }
            }
          })
        }
      })
    },
    setOption(source) {
      const option = {
        legend: {},
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#ffffff'
        },
        dataset: {
          source
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: { type: 'category',
          boundaryGap: false
        },
        yAxis: { gridIndex: 0 },
        grid: { right: '50%', left: '5%', bottom: '5%' },
        series: [
          {
            type: 'pie',
            id: 'pie',
            radius: '50%',
            center: ['80%', '50%'],
            emphasis: {
              focus: 'self'
            },
            label: {
              formatter: '{b}: {@2012} ({d}%)'
            },
            encode: {
              itemName: 'product',
              value: source[0][1],
              tooltip: source[0][1]
            }
          }
        ]
      }
      for (var i = 0; i < source.length - 1; i++) {
        option.series.unshift({
          type: 'line',
          smooth: true,
          seriesLayoutBy: 'row',
          emphasis: { focus: 'series' }
        }
        )
      }
      this.chart.setOption(option)
    },
    // 联级选择选择服务器后台搜索
    cascadeQuerySearch(func, index, disabled, param) {
      func({ parent__isnull: 1, ...param })
        .then((response) => {
          let { data } = response
          data = this.getTreeData(data, disabled)
          this.searchConfig[index].list = data
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
      func({ search: queryString, page: 1, size: 10, ...param })
        .then((response) => {
          const { data } = response
          this.searchConfig[index].list = data
        })
    },
    search() {
      this.funcObj.func(this.funcObj.chart_type, this.searchData).then(response => {
        const { data } = response
        this.source = data
      })
    }
  }
}
</script>
