<template>
  <div class="profiles-table">
    
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Profile } from '../model/Profile'

@Component
export default class ProfilesTable extends Vue {
  @Prop(Array) readonly profiles!: Profile[];

  async created () {}

  async mounted () {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.profiles-table {
}

</style>
