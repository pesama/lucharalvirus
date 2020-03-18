<template>
  <div class="volunteers-dashboard">
    <people-map :map-center="center" :pois="pois" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import PeopleMap from '@/components/PeopleMap.vue';
import { VolunteerPersonaRegistration } from '../model/VolunteerPersonaRegistration';

@Component({
  components: {
    PeopleMap
  }
})
export default class VolunteersDashboard extends Vue {
  @Prop(Array) readonly profiles!: VolunteerPersonaRegistration[];
  @Prop(Array) readonly requests!: any[];

  get pois () {
    const pois = this.requests.map(r => ({
      geo: r.Address.Geolocation,
      data: r
    }));

    return pois;
  }

  get profile () {
    const profile = this.profiles.filter(p => p.Persona === 'volunteer')[0];
    return profile;
  }

  get center () {
    return (this.profile.Address as any).Geolocation;
  }

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
