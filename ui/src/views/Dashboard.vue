<template>
  <div class="dashboard">
    Dashboard
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class Dashboard extends Vue {

  async created () {}

  async mounted () {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.dashboard {
}

</style>
