<template>
  <div class="volunteers-dashboard">
    <people-map />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import PeopleMap from '@/components/PeopleMap.vue';

@Component({
  components: {
    PeopleMap
  }
})
export default class VolunteersDashboard extends Vue {

  async created () {}

  async mounted () {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.volunteers-dashboard {
  min-height: 500px;
}

</style>
