import { shallowMount } from '@vue/test-utils'
import DateInput from '~/components/DateInput'
import { en } from '~/locale'

describe('DateInput unmounted', () => {
  it('check props default', () => {
    expect(typeof DateInput.props.translation.default).toEqual('function')
    expect(DateInput.props.translation.default()).toEqual({})
  })
})

// eslint-disable-next-line max-lines-per-function
describe('DateInput', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(DateInput, {
      propsData: {
        selectedDate: new Date(2018, 2, 24),
        format: 'dd MMM yyyy',
        translation: en,
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('should render correct contents', () => {
    expect(wrapper.findAll('input')).toHaveLength(1)
  })

  it('nulls date', async () => {
    wrapper.setProps({
      selectedDate: null,
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.formattedValue).toBeNull()
    expect(wrapper.find('input').element.value).toEqual('')
  })

  it('formats date', () => {
    expect(wrapper.vm.formattedValue).toEqual('24 Mar 2018')
    expect(wrapper.find('input').element.value).toEqual('24 Mar 2018')
  })

  it('delegates date formatting', async () => {
    wrapper.setProps({
      selectedDate: new Date(2016, 1, 15),
      format: () => '2016/1/15',
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.formattedValue).toEqual('2016/1/15')
    expect(wrapper.find('input').element.value).toEqual('2016/1/15')
  })

  it('emits showCalendar', async () => {
    wrapper.vm.showCalendar()
    expect(wrapper.emitted('show-calendar')).toBeTruthy()
  })

  it('implements the show-calendar-on-focus prop correctly', async () => {
    wrapper.setProps({
      showCalendarOnFocus: true,
    })

    wrapper.find('input').element.focus()
    expect(wrapper.emitted('show-calendar')).toBeTruthy()

    wrapper.setProps({
      showCalendarOnFocus: false,
    })

    wrapper.find('input').element.focus()
    expect(wrapper.emitted('show-calendar')).toBeTruthy()
  })

  it('adds bootstrap classes', async () => {
    wrapper.setProps({
      bootstrapStyling: true,
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('input').element.classList).toContain('form-control')
  })

  it('appends bootstrap classes', async () => {
    wrapper.setProps({
      inputClass: 'someClass',
      bootstrapStyling: true,
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('input').element.classList).toContain('form-control')
    expect(wrapper.find('input').element.classList).toContain('someClass')

    wrapper.setProps({
      inputClass: { someClass: true },
      bootstrapStyling: true,
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('input').element.classList).toContain('form-control')
    expect(wrapper.find('input').element.classList).toContain('someClass')
  })

  it('can be disabled', async () => {
    wrapper.setProps({
      disabled: true,
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('input').attributes().disabled).toBeDefined()
  })

  it('accepts a function as a formatter', async () => {
    wrapper.setProps({
      format: () => '!',
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('input').element.value).toEqual('!')
  })

  it('should open the calendar on focus', async () => {
    wrapper.find('input').trigger('focus')
    expect(wrapper.emitted('show-calendar')).toBeFalsy()
    wrapper.setProps({
      showCalendarOnFocus: true,
    })
    await wrapper.vm.$nextTick()
    wrapper.find('input').trigger('focus')
    expect(wrapper.emitted('show-calendar')).toBeTruthy()
  })

  it('should open the calendar only on calendar button click', async () => {
    wrapper.setProps({
      calendarButton: true,
      showCalendarOnButtonClick: true,
    })
    await wrapper.vm.$nextTick()
    wrapper.find('input').trigger('click')
    expect(wrapper.emitted('show-calendar')).toBeFalsy()
    wrapper.find('.vdp-datepicker__calendar-button').trigger('click')
    expect(wrapper.emitted('show-calendar')).toBeTruthy()
  })
})
