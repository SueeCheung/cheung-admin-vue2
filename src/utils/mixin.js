import { isArray, isString, isNumber, isObject } from '@/utils/validate'
import { hiprint } from 'vue-plugin-hiprint'

// 普通的表格页面
export const currencyOpt = {
  data() {
    return {
      listData: [],
      formVisible: false,
      fullscreen: false,
      pager: {
        currentPage: 1,
        pageSize: 10,
        total: 10,
        pageSizes: [5, 10, 50, 100]
      },
      pks: [],
      selectItems: null,
      tableConfig: {},
      screenData: {},
      sumObj: {},
      exportLoading: false
    }
  },
  methods: {
    searchFunc(e) {
      if (e) {
        if (e.search !== '' && e.search !== undefined) {
          this.pager.currentPage = 1
        }
      }
      this.getItemList()
    },
    printItem() {
      if (this.pks.length === 0 || (this.pks.length > 1)) {
        this.$message({
          message: '请选择一个对象',
          type: 'warning'
        })
      } else {
        const hiprintTemplate = new hiprint.PrintTemplate({ template: this.printConfig })
        this.optFunc.print(this.pks[0]).then(response => {
          hiprintTemplate.print(response.data, {}, {
            callback: () => {
              // console.log('callback')
            }
          })
        })
      }
    },
    setOrder(order) {
      this.searchData.ordering = order
      this.searchFunc()
    },
    getItemList() {
      this.tableConfig.loading = true
      const filter = {}
      // 循环拼接筛选条件
      Object.keys(this.screenData).forEach(key => {
        if (this.screenData[key].condition !== '') {
          if (this.screenData[key].value !== '' || (isArray(this.screenData[key].value) && this.screenData[key].value.length > 0)) {
            filter[key + this.screenData[key].condition] = this.screenData[key].value
          }
        }
      })
      this.optFunc.list({
        ...this.searchData,
        ...filter,
        page: this.pager.currentPage,
        size: this.pager.pageSize
      })
        .then((response) => {
          // 测试版本
          const { data, count, page, size, sum_obj } = response
          this.pager.page = Number(page)
          this.pager.pageSize = size
          this.pager.total = count
          this.tableConfig.data = data
          this.listData = data
          this.sumObj = sum_obj
        })
        .catch(() => {
        })
      this.tableConfig.loading = false
    },
    addItem() {
      // this.formConfig.isUpdate = false
      // this.formConfig.isReView = false
      this.formConfig.formType = 'create'
      this.formVisible = true
      this.formConfig.itemData.groupList.forEach((ele) => {
        ele.groupForm.forEach((element) => {
          if (element.remoteFunc !== undefined || element.type === 'file') {
            element.list = []
          } else if (element.type === 'slot') {
            element.data = {}
          }
        })
      })
    },
    updateItem() {
      if (this.pks.length === 0 || (this.pks.length > 1)) {
        this.$message({
          message: '请选择一个对象',
          type: 'warning'
        })
      } else {
        // this.formConfig.isUpdate = true
        // this.formConfig.isReView = false
        this.formConfig.formType = 'update'
        this.getItemInfo(this.pks[0])
      }
    },
    reviewItem(id) {
      // this.formConfig.isUpdate = false
      // this.formConfig.isReView = true
      this.formConfig.formType = 'review'
      this.getItemInfo(id)
    },
    closeDialog() {
      this.formVisible = false
    },
    exportItems() {
      const filter = {}
      // 循环拼接筛选条件
      this.exportLoading = true
      Object.keys(this.screenData).forEach(key => {
        if (this.screenData[key].condition !== '') {
          if (this.screenData[key].value !== '' || (isArray(this.screenData[key].value) && this.screenData[key].value.length > 0)) {
            filter[key + this.screenData[key].condition] = this.screenData[key].value
          }
        }
      })
      this.optFunc.export({
        ...this.searchData,
        ...filter,
        page: this.pager.currentPage,
        size: this.pager.pageSize
      })
        .then((response) => {
          // 测试版本
          this.exportLoading = false
          window.open(response.data.path)
        })
    },
    getItemInfo(id) {
      this.formVisible = true
      this.optFunc.info(id)
        .then((response) => {
          const { data } = response
          this.formData = data
          this.formConfig.itemData.groupList.forEach((ele) => {
            ele.groupForm.forEach((element) => {
              if (element.remoteFunc !== undefined || element.type === 'file') {
                if (isArray(data[element.prop])) {
                  element.list = data[element.prop]
                  data[element.prop] = []
                  element.list.forEach(item => {
                    data[element.prop].push(item.id)
                  })
                } else if (isObject(data[element.prop])) {
                  if (data[element.prop].id !== undefined) {
                    element.list = [data[element.prop]]
                    data[element.prop] = data[element.prop].id
                  } else {
                    element.list = []
                    data[element.prop] = null
                  }
                }
              } else if (element.type === 'slot') {
                element.data = data[element.prop]
                if (!isArray(data[element.prop])) {
                  if (data[element.prop].id !== undefined) {
                    data[element.prop] = data[element.prop].id
                  } else {
                    data[element.prop] = null
                  }
                }
              } else if (element.type === 'transfer') {
                if (isArray(data[element.prop])) {
                  const data_list = JSON.parse(JSON.stringify(data[element.prop]))
                  data[element.prop] = []
                  data_list.forEach(item => {
                    data[element.prop].push(item.id)
                  })
                }
              }
            })
          })
        })
        .catch(() => {
        })
    },
    deleteItems() {
      if (this.pks.length === 0) {
        this.$message({
          message: '请至少选择一个对象',
          type: 'warning'
        })
      } else {
        this.$msgbox({
          title: '提示',
          message: '确认删除这些数据吗？',
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.optFunc.delete({ id__in: this.pks })
            .then(() => {
              this.$message({
                message: '数据删除成功',
                type: 'success',
                customClass: 'customClass'
              })
              this.searchFunc()
            })
            .catch(() => {
            })
        })
      }
    },
    reset() {
      this.$refs.publicForm.$refs.myForm.resetFields()
      if (this.$refs.publicForm.$refs.tree) {
        this.$refs.publicForm.$refs.tree[0].setCheckedKeys([])
      }
      this.formConfig.itemData.groupList.forEach((ele) => {
        ele.groupForm.forEach((element) => {
          // if (element.type === 'file') {
          if (isArray(this.formData[element.prop])) {
            this.formData[element.prop] = []
            element.list = []
          } else {
            this.formData[element.prop] = ''
            element.list = []
          }
          // }
        })
      })
    },
    submitForm() {
      this.$refs.publicForm.submitForm()
    },
    setScreenData(prop) {
      Object.keys(this.screenData).forEach(key => {
        if (key === prop) {
          this.screenData[key].condition = ''
          if (isArray(this.screenData[key].value)) {
            this.screenData[key].value = []
          } else if (isString(this.screenData[key].value)) {
            this.screenData[key].value = ''
          } else if (isNumber(this.screenData[key].value)) {
            this.screenData[key].value = undefined
          }
        }
      })
      this.getItemList()
    },
    selectChange(pks, selectItems) {
      this.pks = pks
      this.selectItems = selectItems
    }
  },
  watch: {
    exportLoading: {
      handler(newVal, val) {
        this.buttonConfig.forEach(button => {
          if (button.label.indexOf('导出') !== -1) {
            button.icon = newVal ? 'el-icon-loading' : 'el-icon-download'
          }
        })
      }
    }
  },
  mounted() {
    this.$bus.$on('search', () => {
      this.pager.currentPage = 1
      this.searchFunc()
    })
    this.$bus.$on('setScreenData', this.setScreenData)
    // const query = this.$route.query
    // if (query) {
    //   for (var key in query) {
    //     this.searchData[key] = query[key]
    //   }
    // }
    this.searchFunc()
  }
}

// tree加form页面
export const treeAndFormOpt = {
  data() {
    return {
      formVisible: false,
      fullscreen: false,
      clickItem: {},
      updateFormConfig: {},
      listData: [],
      screenData: {},
      currentNodeKey: 0,
      defaultExpandedKeys: [],
      filterText: ''
    }
  },
  created() {
    const query = this.$route.query
    if (query) {
      for (var key in query) {
        this.searchData[key] = query[key]
      }
    }
    this.searchFunc()
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    searchFunc(e) {
      if (e) {
        if (e.search !== '' && e.search !== undefined) {
          this.pager.currentPage = 1
        }
      }
      this.getItemList()
    },
    submitForm() {
      this.$refs.publicForm.submitForm()
    },
    updateSubmitForm() {
      this.$refs.updateForm.submitForm()
    },
    closeDialog() {
      this.formVisible = false
    },
    nodeClick(item, node, el, isFirst = false) {
      if (this.currentNodeKey === item.id && !isFirst) {
        console.log(111)
        return
      }
      this.clickItem = item
      this.currentNodeKey = item.id
      this.getItemInfo(item.id)
    },
    // nodeDrop(draggingNode, dropNode, type){
    // },
    deleteItems() {
      const pks = this.$refs.tree.getCheckedKeys()
      if (pks.length === 0) {
        this.$message({
          message: '请至少选择一个对象',
          type: 'warning'
        })
      } else {
        this.$msgbox({
          title: '提示',
          message: '确认删除这些数据吗？',
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.optFunc.delete({ id__in: pks })
            .then(() => {
              this.$message({
                message: '数据删除成功',
                type: 'success',
                customClass: 'customClass'
              })
              this.searchFunc()
            })
            .catch(() => {
            })
        })
      }
    },
    getItemList() {
      const filter = {}
      // 循环拼接筛选条件
      Object.keys(this.screenData).forEach(key => {
        if (this.screenData[key].condition !== '') {
          if (this.screenData[key].value !== '' || (isArray(this.screenData[key].value) && this.screenData[key].value.length > 0)) {
            filter[key + this.screenData[key].condition] = this.screenData[key].value
          }
        }
      })
      this.optFunc.list({
        ...this.searchData,
        ...filter
      })
        .then((response) => {
          const { data } = response
          this.listData = data
          if (this.currentNodeKey === 0) {
            this.currentNodeKey = this.listData[0].id
            this.defaultExpandedKeys = [this.listData[0].id]
            this.nodeClick(this.listData[0], null, null, true)
            this.$nextTick(() => {
              this.$refs.tree.setCurrentKey(this.currentNodeKey)
            })
          } else {
            this.defaultExpandedKeys = [this.currentNodeKey]
            this.$nextTick(() => {
              this.$refs.tree.setCurrentKey(this.currentNodeKey)
            })
          }
        })
        .catch(() => {
        })
    },
    getItemInfo(id) {
      this.optFunc.info(id)
        .then((response) => {
          const { data } = response
          this.updateFormData = data
          this.clickItem = JSON.parse(JSON.stringify(data))
          this.updateFormConfig.itemData.groupList.forEach((ele) => {
            ele.groupForm.forEach((element) => {
              if (element.remoteFunc !== undefined || element.type === 'file') {
                if (isArray(data[element.prop])) {
                  element.list = data[element.prop]
                  data[element.prop] = []
                  element.list.forEach(item => {
                    data[element.prop].push(item.id)
                  })
                } else if (isObject(data[element.prop])) {
                  if (data[element.prop].id !== undefined) {
                    element.list = [data[element.prop]]
                    data[element.prop] = data[element.prop].id
                  } else {
                    element.list = []
                    data[element.prop] = null
                  }
                }
              } else if (element.type === 'slot') {
                element.data = data[element.prop]
                if (!isArray(data[element.prop])) {
                  if (data[element.prop].id !== undefined) {
                    data[element.prop] = data[element.prop].id
                  } else {
                    data[element.prop] = null
                  }
                }
              } else if (element.type === 'transfer') {
                if (isArray(data[element.prop])) {
                  const data_list = JSON.parse(JSON.stringify(data[element.prop]))
                  data[element.prop] = []
                  data_list.forEach(item => {
                    data[element.prop].push(item.id)
                  })
                }
              }
            })
          })
        })
        .catch(() => {
        })
    },
    addItem() {
      // this.formConfig.isUpdate = false
      this.formConfig.formType = 'create'
      this.formVisible = true

      this.formConfig.itemData.groupList.forEach((ele) => {
        ele.groupForm.forEach((element) => {
          if (element.prop === 'parent') {
            if (isArray(this.clickItem[element.prop])) {
              element.list = this.clickItem[element.prop]
              this.formData[element.prop] = []
              element.list.forEach(item => {
                this.formData[element.prop].push(item.id)
              })
            } else {
              if (this.clickItem[element.prop]) {
                element.list = [this.clickItem[element.prop]]
                this.formData[element.prop] = this.clickItem[element.prop].id
              }
            }
          }
        })
      })
    },
    addSonItem() {
      this.formConfig.formType = 'create'
      // this.formConfig.isUpdate = false
      this.formVisible = true

      this.formConfig.itemData.groupList.forEach((ele) => {
        ele.groupForm.forEach((element) => {
          if (element.prop === 'parent') {
            element.list = [{ id: this.clickItem.id, name: this.clickItem.name }]
            if (isArray(this.formData[element.prop])) {
              this.formData[element.prop] = []
              element.list.forEach(item => {
                this.formData[element.prop].push(item.id)
              })
            } else {
              this.formData[element.prop] = this.clickItem.id
            }
          }
        })
      })
    },
    reset() {
      this.$refs.publicForm.$refs.myForm.resetFields()
    }
  }
}

// tree加表格页面
export const treeAndTable = {
  extends: currencyOpt,
  data() {
    return {
      treeData: [],
      currentNodeKey: '',
      defaultExpandedKeys: [],
      filterText: ''
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    getTreeList() {
      this.treeFunc({ parent__isnull: 1, ordering: 'no' })
        .then((response) => {
          const { data } = response
          this.treeData = data
          this.defaultExpandedKeys = [this.treeData[0].id]
          this.nodeClick(this.treeData[0])
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(this.currentNodeKey)
          })
        })
    },
    nodeClick(item, node) {
      this.currentNodeKey = item.id
    }
  },
  created() {
    this.getTreeList()
  }
}
