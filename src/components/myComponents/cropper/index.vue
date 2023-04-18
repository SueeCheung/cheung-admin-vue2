<template>
  <el-upload
    ref="upload"
    class="avatar-uploader"
    action="https://jsonplaceholder.typicode.com/posts/"
    :on-change="OnChange"
    :auto-upload="false"
    :show-file-list="false"
    :limit="1"
    :http-request="saveImage"
  >
    <el-avatar
      :size="size"
      :src="data.file === undefined ? moRen : data.file"
    />
    <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
      <el-row>
        <el-col :span="12">
          <div class="cropper-content">
            <div class="cropper" style="text-align: center">
              <vueCropper
                ref="cropper"
                :img="option.img"
                :output-size="0.8"
                :full="false"
                :original="true"
                :auto-crop-width="cropWidth || 250"
                :auto-crop-height="cropHidth || 250"
                :auto-crop="true"
                :fixed-box="true"
                :enlarge="2"
                @realTime="realTime"
              />
            </div>
          </div>
        </el-col>
        <el-col :span="10" :offset="2">
          <div
            class="show-preview"
            :style="{
              width: previews.w + 'px',
              height: previews.h + 'px',
              overflow: 'hidden',
              margin: '5px',
            }"
          >
            <div :style="previews.div">
              <img :src="previews.url" :style="previews.img">
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px" type="flex" justify="center">
        <el-col :span="4">
          <el-button
            class="btn"
            type="primary"
            icon="el-icon-refresh-left"
            @click="rotateLeft"
          />
        </el-col>
        <el-col :span="4">
          <el-button
            class="btn"
            type="primary"
            icon="el-icon-refresh-right"
            @click="rotateRight"
          />
        </el-col>
        <el-col :span="4">
          <el-button
            class="btn"
            type="primary"
            icon="el-icon-circle-check"
            @click="crop"
          >
            确定
          </el-button>
        </el-col>
        <el-col :span="4">
          <el-button
            class="btn"
            type="primary"
            icon="el-icon-circle-close"
            @click="close"
          >
            取消
          </el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </el-upload>
</template>

<script>
import { Message } from 'element-ui'
import { VueCropper } from 'vue-cropper'
import { createFile, updateFile } from '@/api/system/file'
import moRen from '@/icons/jpg/默认.jpg'

export default {
  components: {
    VueCropper
  },
  props: {
    size: {
      type: Number,
      required: true
    },
    data: {
      type: Object,
      required: true
    },
    extra: {
      type: Object,
      default: () => {
        return {}
      }
    },
    callBack: {
      type: Function,
      required: true
    },
    cropWidth: {
      type: Number,
      default: 0
    },
    cropHidth: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      dialogVisible: false,
      option: {
        img: '' // base64
      },
      moRen,
      previews: {}
    }
  },
  mounted() {
    // console.log(this.data)
  },
  methods: {
    OnChange(file, fileList) {
      if (!/\.(jpg|jpeg|png|bmp|JPG|PNG)$/.test(file.raw.name)) {
        Message('图片类型必须是jpeg,jpg,png,bmp中的一种')
        return false
      }
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        Message('上传文件大小不能超过 5MB!')
        return false
      }
      this.$nextTick(() => {
        this.option.img = URL.createObjectURL(file.raw)
        this.dialogVisible = true
      })
    },
    realTime(data) {
      this.previews = data
    },
    rotateLeft() {
      this.$refs.cropper.rotateLeft()
    },
    rotateRight() {
      this.$refs.cropper.rotateRight()
    },
    crop() {
      this.$refs.cropper.getCropBlob((data) => {
        this.img = data
        // const formData = new FormData()
        this.$refs.upload.submit()
        this.dialogVisible = false
      })
    },
    close() {
      this.dialogVisible = false
      this.$refs.upload.clearFiles()
    },
    saveImage(option) {
      const formData = new FormData()
      formData.append(
        'file',
        new File(
          [this.img],
          option.file.name,
          {
            type: option.file.type,
            lastModified: Date.now()
          },
          option.file.name
        )
      )
      Object.keys(this.extra).forEach((key) => {
        formData.append(key, this.extra[key])
      })
      let func = null
      if (this.data.id) {
        func = updateFile(this.data.id, formData)
      } else {
        func = createFile(formData)
      }
      func
        .then((response) => {
          const { data } = response
          this.$refs.upload.clearFiles()
          this.callBack(data)
        })
        .catch(() => { this.$refs.upload.clearFiles() })
    }
  }
}
</script>

<style scoped>
.cropper-content .cropper {
  width: auto;
  height: 350px;
}
</style>
