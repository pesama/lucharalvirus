<template>
  <div class="volunteering-table">
    <div class="banner">
      <h3 class="title" v-html="$t('dashboard.tools.volunteer.title')" />
      <div class="description" v-html="$t('dashboard.tools.volunteer.description')" />
      <div class="data">
        Data
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class VolunteeringTable extends Vue {

  async created () {}

  async mounted () {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.volunteering-table {
}

</style>
