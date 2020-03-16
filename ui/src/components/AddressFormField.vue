<template>
  <div class="address-form-field form-field">
    <div class="title" v-html="title" />
    <place-autocomplete-field 
      v-model="textInput"  
      name="address" 
      api-key="AIzaSyCIh4fDoXFneNegg49mDgiSZvJC9-cs_B0"
      v-place-autofill.country="'Spain'"
      v-on:autocomplete-select="select" />
    <div class="description" v-html="description" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import FormField from './FormField.vue';
import { Address } from '../model/CommonFields';

@Component({
  components: {
    FormField
  }
})
export default class AddressFormField extends Vue {
  @Prop(String) readonly title!: string;
  @Prop(String) readonly description!: string;
  @Prop() readonly value!: any;

  public textInput: string = typeof(this.value) === 'string' ? this.value : '';
  
  get formValue () {
    return this.value;
  }

  set formValue (value: any) {
    this.$emit('input', value);
  }

  select (place: any, response: any) {
    const addressComponents = response.address_components
      .map(i => i.types.map(t => ({ [t]: i })))
      .flat()
      .reduce((t, i) => ({ ...t, ...i }), {});

    const parsedAddress = {
      FormattedText: response.formatted_address,
      Street: addressComponents.route,
      Number: addressComponents.street_number,
      PostalCode: addressComponents.postal_code,
      Geolocation: {
        lat: response.geometry.location.lat(),
        lng: response.geometry.location.lng()
      }
    };

    // TODO Verify address components to match accuracy
    debugger;
    this.formValue = parsedAddress;
  }

  async created () {}

  async mounted () {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '@/assets/branding';

.address-form-field {
  .title {
    font-weight: bold;
  }

  .description {
    font-size: .9em;
    color: $color-muted;
  }

  /deep/ {
    .form-group {
      label {
        display: none;
      }

      input {
        -webkit-appearance: none;
        background-color: #FFF;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #DCDFE6;
        box-sizing: border-box;
        color: #606266;
        display: inline-block;
        font-size: inherit;
        height: 40px;
        line-height: 40px;
        outline: 0;
        padding: 0 15px;
        transition: border-color .2s cubic-bezier(.645,.045,.355,1);
        width: 100%;
      }
    }
  }
}

</style>
