<template>
  <div class="myPagination">
    <el-pagination
      background
      :current-page.sync="pager.currentPage"
      :page-sizes="pager.pageSizes"
      :page-size="pager.pageSize"
      :pager-count="5"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pager.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    pager: {
      type: Object,
      default() {
        return {
          currentPage: 1,
          pageSize: 10,
          total: 10,
          pageSizes: [5, 10, 50, 100]
        }
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      if (this.pager.total == null) {
        this.pager.total = null
        this.pager.pageSize = val
        return
      }
      this.pager.pageSize = val
      this.pager.currentPage = 1
      this.$emit('change', this.pager)
    },
    handleCurrentChange(val) {
      if (this.pager.total == null) {
        this.pager.total = null
        this.pager.currentPage = 1
        return
      }
      this.pager.currentPage = val
      this.$emit('change', this.pager)
    }
  }
}
</script>
