<template>
  <div class="myCardBase assetConsumablesIn">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="待处理" name="pending" />
      <el-tab-pane label="已处理" name="processed" />
    </el-tabs>
    <div class="myFlex tabTop">
      <div
        v-show="this.activeName==='pending'"
        class="myFlex"
      >
        <my-button
          :button-config="buttonConfig"
          @toExamine="toExamine"
          @reject="reject"
        />
      </div>
      <my-search
        :search-config="searchConfig"
        :search-data="searchData"
        :screen-data="screenData"
        @searchFunc="searchFunc"
      />
    </div>
    <div class="tab">
      <my-filter-tag :screen-data="searchData" />
      <my-table
        :table-config="tableConfig"
        @selectChange="selectChange"
        @setOrder="setOrder"
      >
        <template v-slot:audit_date="data">
          <span v-if="data.props.row.audit_date">
            {{ data.props.row.audit_date | timeFormatter }}
          </span>
          <span v-else>/</span>
        </template>

        <!-- <template v-slot:order_no="data">
          <div  @click="openLookOver(data.props.row)" class="lookUp">
            <span v-if="data.props.row.order_no">
              {{ data.props.row.order_no}}
            </span>
            <span v-else>/</span>
          </div>

        </template> -->

        <template v-slot:order_no="data">
          <span v-if="data.props.row.order_no">
            <el-link
              :underline="false"
              type="primary"
              class="fontSize12"
              @click="openLookOver(data.props.row)"
            >{{ data.props.row.order_no }}</el-link>
          </span>
          <span v-else>
            <el-link
              :underline="false"
              type="primary"
              class="fontSize12"
              @click="openLookOver(data.props.row)"
            >/</el-link>
          </span>
        </template>

        <template v-slot:state="data">
          <span v-if="data.props.row.state">
            <el-tag v-if="data.props.row.state==='待审核'">
              {{ data.props.row.state }}
            </el-tag>
            <el-tag v-else-if="data.props.row.state==='已审核'" type="success">
              {{ data.props.row.state }}
            </el-tag>
            <el-tag v-else-if="data.props.row.state==='已驳回'" type="warning">
              {{ data.props.row.state }}
            </el-tag>
            <el-tag v-else-if="data.props.row.state==='会签已驳回'" type="warning">
              {{ data.props.row.state }}
            </el-tag>
            <el-tag v-else-if="data.props.row.state==='或签已审核'" type="success">
              {{ data.props.row.state }}
            </el-tag>
            <el-tag v-else-if="data.props.row.state==='已取消'" type="info">
              {{ data.props.row.state }}
            </el-tag>
            <el-tag v-else-if="data.props.row.state==='待确认'">
              {{ data.props.row.state }}
            </el-tag>

            <el-tag
              v-else
              type="success"
            >{{ data.props.row.state }}</el-tag>
          </span>
          <span v-else>
            /
          </span>
        </template>

        <template v-slot:is_sign="data">
          <span v-if="data.props.row.is_sign">
            <el-tag type="success">是</el-tag>
          </span>
          <span v-else>
            <el-tag type="danger">否</el-tag>
          </span>
        </template>

        <template v-slot:sign="data">
          <span v-if="data.props.row.sign">
            <el-image
              class="imgBox"
              :src="data.props.row.sign.file"
              :preview-src-list="[data.props.row.sign.file]"
            />
          </span>
          <span v-else>
            /
          </span>
        </template>

      </my-table>
      <div>
        <my-pagination
          :pager="pager"
          @change="searchFunc"
        />
      </div>
    </div>
    <look-over-assets ref="lookOverAssets" />
    <look-over-consumables ref="lookOverConsumables" />
    <asset-inventory ref="assetInventory" />
    <financial-change-order ref="financialChangeOrder" />
    <el-dialog
      v-el-drag-dialog
      width="800px"
      :visible.sync="formVisible"
      :fullscreen="fullscreen"
      :show-close="false"
      destroy-on-close
      @close="reset"
    >
      <template slot="title">
        <span class="formDialogTitle">
          <svg-icon icon-class="addSvg" />
          入库单信息
        </span>
        <div class="formDialogOpt">
          <el-button
            v-if="!formConfig.isReView"
            type="primary"
            icon="el-icon-folder-checked"
            @click="submitForm"
          >保存
          </el-button>
          <el-link :underline="false"><i
            class="el-icon-full-screen"
            @click="fullscreen=!fullscreen"
          /></el-link>
          <el-link :underline="false"><i
            class="el-icon-close"
            @click="formVisible=false"
          /></el-link>
        </div>
      </template>
      <my-form
        ref="publicForm"
        :form-config="formConfig"
        :form-rules="formRules"
        :form-data="formData"
        :opt-func="optFunc"
        @searchFunc="searchFunc"
        @closeDialog="closeDialog"
      >

        <template
          v-if="signStatus"
          v-slot:details
        >
          <div class="emptySketchpad">
            <p class="el-form-item__label">签字栏</p>
            <el-button
              type="primary"
              @click="handleReset"
            >清空签字栏</el-button>
          </div>

          <div class="esignTest">

            <div style="border: 2px solid #E6E6E6 ;background-color: white">

              <vue-esign
                ref="esign"
                :width="800"
                :height="300"
                :is-crop="isCrop"
                :line-width="lineWidth"
                :line-color="lineColor"
                :bg-color.sync="bgColor"
              />

            </div>

          </div>
        </template>
      </my-form>

    </el-dialog>
  </div>
</template>

<script>
import { createFile } from '@/api/system/file'
import { pendingConfig } from '@/layout/components/lookOver/approvalTask'
import { currencyOpt } from '@/utils/mixin'
import lookOverAssets from '@/layout/components/lookOver/lookOverAssets/lookOver.vue'
import lookOverConsumables from '@/layout/components/lookOver/lookOverConsumables/lookOver.vue'
import assetInventory from '@/layout/components/lookOver/assetInventory/assetInventory.vue'
import financialChangeOrder from '@/layout/components/lookOver/financialChangeOrder/financialChangeOrder.vue'

export default {
  name: 'ApprovalTask',
  components: { lookOverAssets, lookOverConsumables, assetInventory, financialChangeOrder },
  mixins: [pendingConfig, currencyOpt],
  data() {
    return {
      redirect: '',
      activeName: 'pending',
      searchData: {},
      // 画布配置
      levelList: null,
      lineWidth: 6,
      lineColor: '#000000',
      bgColor: '',
      resultImg: '',
      isCrop: true,

      signStatus: true // 控制用不用签名
    }
  },
  computed: {

  },
  created() {
    this.handleClick()

    // //console.log(this.$router.history)
  },
  // beforeRouteEnter(to, from, next) {
  //     //console.log(to, from)
  //     next()
  //   },
  // beforeRouteLeave(to, from, next) {
  //     //console.log(to, from)
  //   },
  methods: {

    // 判断待处理已处理
    handleClick() {
      // Object.keys(pendingConfig).forEach(key => {
      //   this[key] = pendingConfig[key]
      // })
      if (this.activeName === 'pending') {
        this.searchData = {
          state__in: [0, 6],
          permission_user_id: this.$store.state.user.user_info.id
        }
      }
      if (this.activeName === 'processed') {
        this.searchData = {
          'state__!in': [0, 6],
          permission_user_id: this.$store.state.user.user_info.id
        }
      }
      this.getItemList()
    },
    prev() {
      this.$router.go(-1)
    },
    // 审核
    toExamine() {
      if (this.pks.length === 0) {
        this.$message({
          message: '请选择操作对象',
          type: 'warning'
        })
      } else {
        // 获取选中签名和不签名的状态
        const fang = this.selectItems.every((item) => {
          return item.is_sign
        })
        // 获取全部为不签名状态
        const fang2 = this.selectItems.some((item) => {
          return !item.is_sign
        })
        if (fang2) {
          this.signStatus = false
          this.formVisible = true
        } else {
          if (fang) {
            this.signStatus = true
            this.formVisible = true
          } else {
            this.$message({
              message: '其中包含签名审批,请单独设置',
              type: 'warning'
            })
          }
        }

        // this.formVisible=true
      }
    },
    submitForm() {
      if (this.signStatus) {
        this.$refs.esign
          .generate()
          .then((res) => {
            // let blob = this.dataURLtoBlob(res);
            // let file = this.blobToFile(blob, '.png');
            const file = this.dataURLtoFile(res, 'cs.png')
            const formData = new FormData()
            formData.append('type', 5)
            formData.append('file', file)
            createFile(formData).then((res) => {
              // //console.log(res.data.file)
              this.optFunc
                .updates(
                  { id__in: this.pks },
                  {
                    state: 1,
                    sign: res.data.id,
                    remarks: this.formData.remarks
                  }
                )
                .then(() => {
                  // 提示成功
                  this.$message({
                    message: '操作成功',
                    type: 'success'
                  })
                  this.formVisible = false
                  this.getItemList()
                  // 重置
                  // this.searchFunc()
                })
            })
          })
          .catch((err) => {
            this.$message({
              message: '请签名后提交',
              type: 'warning'
            })
            // 画布没有签字时会执行这里 'Not Signned'
          })
      } else {
        this.optFunc
          .updates(
            { id__in: this.pks },
            { state: 1, remarks: this.formData.remarks }
          )
          .then(() => {
            // 提示成功
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.formVisible = false
            this.getItemList()
            // 重置
            // this.searchFunc()
          })
      }
    },
    // 驳回
    reject() {
      if (this.pks.length === 0) {
        this.$message({
          message: '请选择操作对象',
          type: 'warning'
        })
      } else {
        this.$msgbox({
          title: '提示',
          message: '确认取消这些单据吗？',
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.optFunc.updates({ id__in: this.pks }, { state: 2 }).then(() => {
            // 提示成功
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.formVisible = false
            this.getItemList()
          })
        })

        // this.formVisible=true
      }
    },
    // 清空签字栏
    handleReset() {
      this.$refs.esign.reset()
    },
    // //将base64转换为blob
    // dataURLtoBlob: function(dataurl) {
    //     var arr = dataurl.split(','),
    //         mime = arr[0].match(/:(.*?);/)[1],
    //         bstr = atob(arr[1]),
    //         n = bstr.length,
    //         u8arr = new Uint8Array(n);
    //     while (n--) {
    //         u8arr[n] = bstr.charCodeAt(n);
    //     }
    //     return new Blob([u8arr], { type: mime });
    // },
    // //将blob转换为file
    // blobToFile: function(theBlob, fileName){
    //    theBlob.lastModifiedDate = new Date();
    //    theBlob.name = fileName;
    //    return theBlob;
    // },

    // 将base64转换为file
    dataURLtoFile: function(dataurl, filename) {
      var arr = dataurl.split(',')
      var mime = arr[0].match(/:(.*?);/)[1]
      var bstr = atob(arr[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime })
    },

    // 查看详情
    openLookOver(val) {
      const data = {}
      data.order_id = val.order_id
      data.order_component = val.order_component
      // console.log(val.order_component)
      if (val.order_component.indexOf('Consumables') != -1) {
        this.$refs.lookOverConsumables.openLookOver(data)
      }
      if (val.order_component.indexOf('PropertyLedgerFinancialChangeOrder') != -1) {
        this.$refs.financialChangeOrder.openAssetInventory(data)
        return
      }
      if (val.order_component.indexOf('Property') != -1) {
        if (val.order_component == 'PropertyCheckOrder') {
          this.$refs.assetInventory.openAssetInventory()
        } else {
          this.$refs.lookOverAssets.openLookOver(data)
        }
      }

      // this.$refs.lookOverAssets.openLookOver(1)
      // this.$refs.lookOverConsumables.openLookOver(1)
    }
  }
}
</script>
<style scoped>
/* *{
  padding: 0;
  margin: 0;
} */
.myCardBase {
  padding-top: 0 !important;
}
</style>
<style lang="scss" >
.assetConsumablesIn {
    background: #fff;

  .tabTop {
    width: 100%;
    justify-content: space-between;

    .elSelect {
      margin-right: 5px;
    }
  }
  .emptySketchpad {
    // margin: 10px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .el-tabs__header {
     line-height: 25px;
    .el-tabs__item {
      padding: 0 10px;
    }
  }
}
</style>

