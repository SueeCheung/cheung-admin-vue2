<template>
  <div id="app">
    <router-view style="" />
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    setTimeout(() => {
      document.getElementById('app').style.display = 'block'
      document.getElementById('appLoading').style.display = 'none'
    }, 1000)
  }
}
</script>
