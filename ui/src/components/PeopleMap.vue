<template>
  <div class="people-map" ref="mapContainer">
    <div class="map" :key="depKey">
      <GmapMap
        ref="peopleMap"
        :center="center"
        :zoom="zoom"
        map-type-id="roadmap"
        :style="mapStyle"
        :options="mapOptions"
        @click="clickMap($event)"
      >
        <!-- Myself -->
        <GmapMarker
          :position="center"
          :clickable="false"
          :draggable="false"
        />

        <GmapMarker 
          :key="`v${index}`"
          v-for="(asset, index) in pois"
          :position="asset.geo"
          :clickable="true"
          :draggable="false"
          @click="assetClick(asset)" />

        <!-- <GmapCircle
          v-if="google && mapActions[2].status === 'enabled'"
          :key="`a${index}`"
          v-for="(alert, index) in pois"
          :center="alert.center"
          :clickable="true"
          :draggable="false"
          :radius="alert.radius"
          :options="alert.options"
        /> -->
      </GmapMap>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { gmapApi } from 'vue2-google-maps';
import { NoCache } from '../decorators';
import { v4 as uuid } from 'uuid';

export interface POI {
  geo: {
    lat: number;
    lng: number;
  };
  data: any;
}

@Component
export default class PeopleMap extends Vue {
  @Prop() readonly mapCenter!: any;
  @Prop() readonly mapClick!: any;
  @Prop() readonly mapItems!: any;
  @Prop() readonly mapZoom!: any;
  @Prop() readonly width!: any;
  @Prop() readonly height!: any;
  @Prop() readonly enableOverlayMenu!: any;
  @Prop({ type: Array, default: () => [] }) readonly pois!: POI[];

  
  public depKey: string = uuid()

  public init: boolean = false;
  public zoom: number =  this.mapZoom || 14;
  public center = this.mapCenter || {
    lat: 43.3695167, 
    lng: -5.8661674
  };
  public mapOptions = {
    zoomControl: false,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false
  }
  public mapStyle = {
    width: `${ this.width || 1920 }px`,
    height: `${ this.height || 1080 }px`
  }
  public assets = [];
  public config = {
    mapOverlayMenuExtended: false,
    mapOverlayPanelSection: null,
    mapOverlayPanelTitle: null,
    selectedAsset: null
  };

  @NoCache
  get google () {
    return gmapApi
  }

  async created () {}

  async mounted () {
    console.log(this.pois)
    this.configureMap();
    // this.updateMap();
  }

  configureMap () {
    const container: any = this.$refs.mapContainer;
    const { offsetWidth, offsetHeight } = container;

    this.mapStyle = {
      width: `${this.width || offsetWidth}px`,
      height: `${this.height || offsetHeight}px`
    };
  }

  async updateMap () {
    const container = this.$refs.mapContainer;
    const wrapper = (this.$refs.peopleMap as any);
    const map = await wrapper.$mapPromise;
    const bounds = new this.google.maps.LatLngBounds();
    const markers = this.pois.map(asset => {
      const location = asset.geo;
      return new this.google.maps.LatLng(location.lat, location.lng);
    });
    markers.forEach(marker => bounds.extend(marker));
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    const adjustmentNE = new this.google.maps.LatLng(ne.lat() + .05, ne.lng() + .05);
    const adjustmentSW = new this.google.maps.LatLng(sw.lat() - .05, sw.lng() - .05);
    bounds.extend(adjustmentNE);
    bounds.extend(adjustmentSW);
    map.fitBounds(bounds);
  }

  @Watch('pois', { immediate: true, deep: true })
  async onPoisChanged (value: POI[]) {
    this.depKey = uuid()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

.people-map {
  position: relative;
  margin: 0;
  padding: 0;
  height: 100%;

  .map {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    height: 500px;

    /deep/ {
      .vue-map-container {
        min-height: 500px;
      }
    }
  }
}

</style>