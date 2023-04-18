<template>
  <el-dialog
    :visible="visible"
    append-to-body
    :width="width+'mm'"
    :show-close="false"
  >
    <template slot="title">
      <span class="formDialogTitle">
        <svg-icon icon-class="addSvg" />
        打印预览
      </span>
      <div class="formDialogOpt">
        <el-button :loading="waitShowPrinter" type="primary" icon="el-icon-printer" @click.stop="print">打印</el-button>
        <el-button type="primary" icon="el-icon-document" @click.stop="toPdf">pdf</el-button>
        <el-link :underline="false"><i class="el-icon-close" @click="visible=false" /></el-link>
      </div>
    </template>
    <div id="preview_content" />
  </el-dialog>
</template>

<script>
export default {
  name: 'PrintPreview',
  props: {},
  data() {
    return {
      visible: false,
      spinning: true,
      waitShowPrinter: false,
      // 纸张宽 mm
      width: 0,
      // 模板
      hiprintTemplate: {},
      // 数据
      printData: {}
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    hideModal() {
      this.visible = false
    },
    show(hiprintTemplate, printData, width = '210') {
      this.visible = true
      this.spinning = true
      this.width = width
      this.hiprintTemplate = hiprintTemplate
      this.printData = printData
      setTimeout(() => {
        // eslint-disable-next-line no-undef
        $('#preview_content').html(hiprintTemplate.getHtml(printData))
        this.spinning = false
      }, 500)
    },
    print() {
      this.waitShowPrinter = true
      this.hiprintTemplate.print(this.printData, {}, {
        callback: () => {
          this.waitShowPrinter = false
        }
      })
    },
    toPdf() {
      this.hiprintTemplate.toPdf({}, '打印预览')
    }
  }
}

</script>
<style lang="less" scoped>
/deep/ .ant-modal-body {
  padding: 0px;
}

/deep/ .ant-modal-content {
  margin-bottom: 24px;
}
</style>
