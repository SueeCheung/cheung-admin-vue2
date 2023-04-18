<template>
  <el-dialog
    v-el-drag-dialog
    width="600px"
    :visible.sync="formVisible"
    :fullscreen="fullscreen"
    :show-close="false"
    destroy-on-close
  >
    <template slot="title">
      <span class="formDialogTitle"> <svg-icon icon-class="addSvg" /> 批量上传 </span>
      <div class="formDialogOpt">
        <el-button type="primary" icon="el-icon-folder-checked" @click="submitForm">保存</el-button>
        <!--        <el-link :underline="false"><i class="el-icon-full-screen" @click="fullscreen=!fullscreen" /></el-link>-->
        <el-link :underline="false"><i class="el-icon-close" @click="formVisible=false" /></el-link>
      </div>
    </template>
    <div class="uploadBox">
      <div class="tipText">
        <span>请选择要导入的数据文件</span>
        <el-link :underline="false" type="primary" @click="downloadFile">下载导入模板</el-link>
      </div>
      <el-upload
        class="upload-demo"
        action="#"
        accept=".xlsx"
        :http-request="uploadFun"
        :on-exceed="(files, fileList)=>{handleExceed(files, fileList,1)}"
        :before-upload="beforeUpload"
        :limit="1"
        drag
        multiple
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">只能上传.xlsx文件格式</div>
      </el-upload>

    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    optFunc: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      formVisible: false,
      fullscreen: false,
      dialogImageUrl: '',
      dialogVisible: false,
      formData: null
    }
  },
  methods: {
    handleRemove(file, fileList) {
      // console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    uploadFun(option) {
      const file = option.file
      const formData = new FormData()
      formData.append('file', file)
      this.formData = formData
    },
    handleExceed(files, fileList, limit) {
      this.$message.warning(`当前限制选择 ${String(limit)} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    openBatchImportFrom() {
      this.formVisible = true
    },
    submitForm() {
      if (this.formData) {
        this.optFunc.upload(this.formData).then(response => {
          this.formVisible = false
          this.$emit('searchFunc')
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        }).catch(error => {
          error.forEach((item, index) => {
            Object.keys(item).forEach(key => {
              setTimeout(() => {
                this.$message({
                  message: `第${index + 2}行，${key}:${item[key]}`,
                  type: 'error',
                  duration: 5 * 1000
                })
              }, 10)
            })
          })
        })
      }
    },
    downloadFile() {
      this.optFunc.download({ permission_user_id: this.$store.state.user.user_info.id }).then(response => {
        const { message } = response
        if (message === 'success') {
          window.open(response.data.path)
        } else {
          this.$message({
            message: message,
            type: 'warning',
            duration: 1000
          })
        }
      })
    },
    beforeUpload(file, fileList) {
      var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      const extension = testmsg === 'xlsx'
      var bool = false
      bool = extension
      if (!extension) {
        this.$message({
          message: '只能上传xlsx格式文件',
          type: 'warning'
        })
      }
      return bool
    }
  }
}
</script>
<style>
.tipText {
  display: flex;
  align-content: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.uploadBox .el-upload-dragger {
  width: 560px !important;
}
</style>
