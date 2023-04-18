<template>
  <span v-if="dataList.length===1">
    {{ dataList[0].name }}
  </span>
  <div v-else @mouseenter="mouse" @mouseleave="mouse">
    <el-tooltip placement="top-start" class="mySeeMore">
      <div slot="content" ref="mySeeMore">
        <div v-for="(item) in dataList" :key="item.id">
          <div>{{ item.name }}</div>
        </div>
      </div>
      <el-collapse ref="seeMore" v-model="activeNames">
        <el-collapse-item :title="dataList[0].name" :name="nameIndex" />

      </el-collapse>
    </el-tooltip>

  </div>
</template>
<script>
export default {
  props: {
    dataList: {
      type: Array,
      required: true
    },
    nameIndex: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      activeNames: ''
    }
  },
  mounted() {
    const mySeeMore = this.$refs.seeMore ? this.$refs.seeMore.$el : ''
  },
  methods: {
    mouse() { // 移进显示
      $(this.$refs.seeMore.$el.getElementsByClassName('el-collapse-item__header')).trigger('click')
    }
  }
}
</script>
<style>
/* .is-dark{
  background: #F5F7FA !important;
  color: #606266 !important;
  transform: translate(-14px, -17px);
}
.el-tooltip__popper{
  padding: 0px 10px 10px !important;
} */
</style>

