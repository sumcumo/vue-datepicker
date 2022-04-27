<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class inputProps extends Vue {
  @Prop({ default: false }) autofocus: boolean

  @Prop({ default: false }) bootstrapStyling: boolean

  @Prop({ default: false }) clearButton: boolean

  @Prop({ default: '' }) clearButtonIcon: string

  @Prop({ default: false }) calendarButton: boolean

  @Prop({ default: '' }) calendarButtonIcon: string

  @Prop({ default: '' }) calendarButtonIconContent: string

  @Prop({ default: false }) disabled: boolean

  @Prop({ default: 'dd MMM yyyy' }) format: string | Function

  @Prop({ default: null }) id: string

  @Prop({ default: false }) inline: boolean

  @Prop({ default: null }) inputClass: string | Object | Array<string>

  @Prop({ default: null }) maxlength: number | string

  @Prop({ default: null }) name: string

  @Prop({ default: null }) openDate: string | Date | number | null

  @Prop({ default: null }) parser: Function

  @Prop({ default: null }) pattern: string

  @Prop({ default: null }) placeholder: string

  @Prop({ default: '' }) refName: string

  @Prop({ default: false }) required: boolean

  @Prop({ default: false }) showCalendarOnButtonClick: boolean

  @Prop({ default: false }) showCalendarOnFocus: boolean

  @Prop({ default: null }) tabindex: number | string

  @Prop({ default: false }) typeable: boolean

  @Prop({ default: false }) useUtc: boolean
}
</script>
