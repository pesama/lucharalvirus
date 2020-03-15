<template>
  <div class="address-form-field form-field">
    <div class="title" v-html="title" />
    <div class="description" v-html="description" />
    <div class="fields">
      <!-- Street -->
      <form-field
        :label="$t('components.address.form.street.label')"
        :placeholder="$t('components.address.form.street.placeholder')"
        :hint="$t('components.address.form.street.hint')"
        v-model="street" />

      <!-- Postal code -->
      <form-field
        :label="$t('components.address.form.postalCode.label')"
        :placeholder="$t('components.address.form.postalCode.placeholder')"
        :hint="$t('components.address.form.postalCode.hint')"
        v-model="postalCode" />
    </div>

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
  @Prop(Object) readonly value!: Address;

  public copy?: Address;

  get street () {
    return this.value.Street;
  }

  set street (data: string) {
    this.copy.Street = data;
    this.$emit('input', this.copy!);
  }

  get city () {
    return this.value.City;
  }

  set city (data: string) {
    this.copy.City = data;
    this.$emit('input', this.copy!);
  }

  get postalCode () {
    return this.value.PostalCode;
  }

  set postalCode (data: string) {
    this.copy.PostalCode = data;
    this.$emit('input', this.copy!);
  }

  async created () {}

  async mounted () {}

  @Watch('value', { immediate: true })
  onValueChanged (val?: Address) {
    this.copy = val;
  }
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
}

</style>
