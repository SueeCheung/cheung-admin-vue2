<template>
  <div class="filterTag">
    <el-tag v-for="(item,index) in tagList" :key="index" type="info" closable @close="closeTag(item,index)">
      {{ item.label }}{{ item.condition }}{{ item.value }}
    </el-tag>
  </div>
</template>

<script>
export default {
  props: {
    screenData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      tagList: []
    }
  },
  mounted() {
    this.$bus.$on('setTag', this.setTag)
  },
  methods: {
    setTag(tagList) {
      this.tagList = tagList
    },
    closeTag(item, index) {
      this.tagList.splice(index, 1)
      this.$bus.$emit('setScreenData', item.key)
    }
  }
}
</script>

<style scoped>

</style>
