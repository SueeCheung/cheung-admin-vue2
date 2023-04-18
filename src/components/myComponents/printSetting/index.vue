<template>
  <el-card>
    <div style="margin-bottom: 10px;" class="formDesign">
      <el-select class="margin-right10 height30" v-model="mode" size="mini" placeholder="请选择" @change="changeMode">
        <el-option
          v-for="(item,index) in modeList"
          :key="index"
          :label="item.name"
          :value="index"
        />
      </el-select>
      <el-button-group class="margin-right10">
        <template v-for="(value,type) in paperTypes">
          <el-button :key="type" :type="curPaperType === type ? 'primary' : ''" @click="setPaper(type,value)">
            {{ type }}
          </el-button>
        </template>
        <el-popover
          placement="top-start"
          title="设置纸张宽高(mm)"
          width="300"
          trigger="hover"
        >
          <div>
            <el-col :span="11">
              <el-input
                v-model="paperWidth"
                type="number"
                size="mini"
                style=" width: 100px; text-align: center"
                placeholder="宽(mm)"
              />
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-input
                v-model="paperHeight"
                type="number"
                size="mini"
                style="width: 100px; text-align: center; border-left: 0"
                placeholder="高(mm)"
              />
            </el-col>
            <el-button type="primary" size="mini" style="margin-top: 10px" @click="otherPaper">确定</el-button>
          </div>
          <el-button slot="reference" :type="curPaperType === 'other' ? 'primary' : ''">自定义纸张</el-button>
        </el-popover>
      </el-button-group>
      <el-button type="" icon="el-icon-zoom-out" @click="changeScale(false)" />
      <span>{{ (scaleValue * 100).toFixed(0) + '%' }}</span>
      <el-button type="" icon="el-icon-zoom-in" @click="changeScale(true)" />
      <el-button type="primary" icon="eye" @click="preView">
        预览
      </el-button>
      <el-button class="margin-right10" type="primary" icon="save" @click="save">
        保存
      </el-button>
      <el-popconfirm
        title="是否确认清空?"
        ok-type="danger"
        ok-text="确定清空"
        @confirm="clearPaper"
      >
        <el-button slot="reference" type="danger">清空
          <el-icon class="el-icon-refresh-left" />
        </el-button>
      </el-popconfirm>
    </div>
    <el-row :gutter="8">
      <el-col :span="4">
        <el-card style="height: 100vh">
          <el-row>
            <el-col :span="24" class="rect-printElement-types hiprintEpContainer" />
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="15">
        <el-card class="card-design">
          <div id="hiprint-printTemplate" class="hiprint-printTemplate" />
        </el-card>
      </el-col>
      <el-col :span="5" class="params_setting_container">
        <el-card>
          <el-row class="hinnn-layout-sider">
            <div id="PrintElementOptionSetting" />
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <!-- 预览 -->
    <print-preview ref="preView" />
  </el-card>
</template>

<script>
import { hiprint } from 'vue-plugin-hiprint'
import providers from './providers'
import panel from './panel'
import printData from './print-data'
import printPreview from './preview'

let hiprintTemplate
export default {
  name: 'PrintDesign',
  components: { printPreview },
  props: {
    template: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      curPaper: {
        type: 'A4',
        width: 210,
        height: 296.6
      },
      paperTypes: {
        'A3': {
          width: 420,
          height: 296.6
        },
        'A4': {
          width: 210,
          height: 296.6
        },
        'A5': {
          width: 210,
          height: 147.6
        },
        'B3': {
          width: 500,
          height: 352.6
        },
        'B4': {
          width: 250,
          height: 352.6
        },
        'B5': {
          width: 250,
          height: 175.6
        }
      },
      scaleValue: 1,
      scaleMax: 5,
      scaleMin: 0.5,
      // 自定义纸张
      paperPopVisible: false,
      paperWidth: '220',
      paperHeight: '80',
      mode: 0,
      modeList: []
    }
  },
  computed: {
    curPaperType() {
      let type = 'other'
      const types = this.paperTypes
      for (const key in types) {
        const item = types[key]
        const { width, height } = this.curPaper
        if (item.width === width && item.height === height) {
          type = key
        }
      }
      return type
    }
  },
  watch: {
    template: {
      deep: true,
      handler(newVal, val) {
        this.changeTemplate()
      }
    }
  },
  mounted() {
    this.init()
  },
  destroyed() {
    $('.hiprintEpContainer').empty()
  },
  methods: {
    init() {
      this.modeList = providers.map((e) => {
        return { type: e.type, name: e.name, value: e.value }
      })
      this.changeMode()
    },
    changeTemplate() {
      $('#hiprint-printTemplate').empty()
      hiprintTemplate = new hiprint.PrintTemplate({
        template: this.template,
        settingContainer: '#PrintElementOptionSetting',
        paginationContainer: '.hiprint-printPagination'
      })
      hiprintTemplate.design('#hiprint-printTemplate')
      // 获取当前放大比例, 当zoom时传true 才会有
      this.scaleValue = hiprintTemplate.editingPanel.scale || 1
    },
    changeMode() {
      const { mode } = this
      const provider = providers[mode]
      hiprint.init({
        providers: [provider.f]
      })
      $('.hiprintEpContainer').empty()
      hiprint.PrintElementTypeManager.build('.hiprintEpContainer', provider.value)
      $('#hiprint-printTemplate').empty()
      hiprintTemplate = new hiprint.PrintTemplate({
        template: this.template,
        settingContainer: '#PrintElementOptionSetting',
        paginationContainer: '.hiprint-printPagination'
      })
      hiprintTemplate.design('#hiprint-printTemplate')
      // 获取当前放大比例, 当zoom时传true 才会有
      this.scaleValue = hiprintTemplate.editingPanel.scale || 1
    },
    /**
     * 设置纸张大小
     * @param type [A3, A4, A5, B3, B4, B5, other]
     * @param value {width,height} mm
     */
    setPaper(type, value) {
      try {
        if (Object.keys(this.paperTypes).includes(type)) {
          this.curPaper = { type: type, width: value.width, height: value.height }
          hiprintTemplate.setPaper(value.width, value.height)
        } else {
          this.curPaper = { type: 'other', width: value.width, height: value.height }
          hiprintTemplate.setPaper(value.width, value.height)
        }
      } catch (error) {
        this.$message.error(`操作失败: ${error}`)
      }
    },
    otherPaper() {
      const value = {}
      value.width = this.paperWidth
      value.height = this.paperHeight
      this.paperPopVisible = false
      this.setPaper('other', value)
    },
    changeScale(big) {
      let scaleValue = this.scaleValue
      if (big) {
        scaleValue += 0.1
        if (scaleValue > this.scaleMax) scaleValue = 5
      } else {
        scaleValue -= 0.1
        if (scaleValue < this.scaleMin) scaleValue = 0.5
      }
      if (hiprintTemplate) {
        // scaleValue: 放大缩小值, false: 不保存(不传也一样), 如果传 true, 打印时也会放大
        hiprintTemplate.zoom(scaleValue)
        this.scaleValue = scaleValue
      }
    },
    preView() {
      this.$refs.preView.show(hiprintTemplate, { name: '笔记本电脑', company: '智尚科技', no: '12345678' })
    },
    save() {
      this.$emit('save', hiprintTemplate.getJson())
    },
    clearPaper() {
      try {
        hiprintTemplate.clear()
      } catch (error) {
        this.$message.error(`操作失败: ${error}`)
      }
    }
  }
}
</script>
<style>
  .formDesign{
    display: flex;
    align-items: center;
  }
  .margin-right10{
    margin-right: 10px;
  }
  .margin-right10 .el-input--mini .el-input__inner{
    height: 30px !important;
    line-height: 30px !important;
  }
</style>

<style lang="less" scoped>
// build 拖拽
/deep/ .hiprint-printElement-type > li > ul > li > a {
  padding: 4px 4px;
  color: #1296db;
  line-height: 1;
  height: auto;
  text-overflow: ellipsis;
}

// 默认图片
/deep/ .hiprint-printElement-image-content {
  img {
    content: url("~@/icons/jpg/logo.jpg");
  }
}

// 设计容器
.card-design {
  overflow: hidden;
  overflow-x: auto;
  overflow-y: auto;
}

</style>
<style>
.hicontextmenu {
  z-index: 2001 !important;
}
</style>
