<template>
  <div class="address-form-field form-field">
    <div class="title" v-html="title" />
    <place-autocomplete-field 
      v-model="formValue"  
      name="address" 
      api-key="AIzaSyAhSv9zWvisiTXRPRw6K8AE0DCmrRMpQcU"
      v-place-autofill.country="'Spain'" />
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
  @Prop(String) readonly value!: string;
  
  get formValue () {
    return this.value;
  }

  set formValue (value: any) {
    this.$emit('input', value);
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
