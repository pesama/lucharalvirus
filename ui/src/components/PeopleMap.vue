<template>
  <div class="people-map" ref="mapContainer">
    <div class="map" v-if="init">
      <GmapMap
        ref="peopleMap"
        :center="center"
        :zoom="14"
        map-type-id="roadmap"
        :style="mapStyle"
        :options="mapOptions"
        @click="clickMap($event)"
      >
        <GmapMarker
          v-if="google"
          :key="`v${index}`"
          v-for="(asset, index) in assets"
          :position="parseLocation(asset)"
          :clickable="true"
          :draggable="false"
          @click="assetClick(asset)"
          :icon="getMapIcon(asset)"
        />
        <GmapCircle
          v-if="google && mapActions[2].status === 'enabled'"
          :key="`a${index}`"
          v-for="(alert, index) in pois"
          :center="alert.center"
          :clickable="true"
          :draggable="false"
          :radius="alert.radius"
          :options="alert.options"
        />
      </GmapMap>
    </div>
  </div>
</template>

<script>
import { gmapApi } from 'vue2-google-maps';
import ConfigurationService from '@/services/ConfigurationService';

export default {
  name: 'ComponentCamelName',
  props: ['mapCenter', 'mapClick', 'mapItems', 'mapZoom', 'width', 'height', 'enableOverlayMenu'],
  data () {
    return {
      init: false,
      zoom: this.mapZoom || 6,
      center: {
        lat: 43.3695167, 
        lng: -5.8661674
      },
      url:'http://aws.amazon.com',
      attribution:'Amazon Web Services',
      mapOptions: {
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false
      },
      mapStyle: {
        width: `${ this.width || 1920 }px`,
        height: `${ this.height || 1080 }px`
      },
      pois: [],
      assets: this.mapItems || [],
      config: {
        mapOverlayMenuExtended: false,
        mapOverlayPanelSection: null,
        mapOverlayPanelTitle: null,
        selectedAsset: null
      }
    }
  },
  computed: {
    google: gmapApi,
  },
  async created () {
    
  },
  async mounted () {
    this.configureMap();
    this.init = true;
  },
  methods: {
    closeOverlayPanel () {
      this.config.selectedAsset = null;
      this.config.mapOverlayPanelSection = null;
      this.config.mapOverlayPanelTitle = null;
      this.fetchAssets();
    },

    configureMap () {
      this.container = this.$refs.mapContainer;
      const { offsetWidth, offsetHeight } = this.container;

      this.mapStyle = {
        width: `${this.width || offsetWidth}px`,
        height: `${this.height || offsetHeight}px`
      };
    }
  },
  watch: {
    
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