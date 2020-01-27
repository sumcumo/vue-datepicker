import { shallowMount } from '@vue/test-utils'
import DateInput from '~/components/DateInput'
import { en } from '~/locale'

describe('DateInput unmounted', () => {
  it('check props default', () => {
    expect(typeof DateInput.props.translation.default).toEqual('function')
    expect(DateInput.props.translation.default()).toEqual({})
  })
})

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

  it('nulls date', () => {
    wrapper.setProps({
      selectedDate: null,
    })
    expect(wrapper.vm.formattedValue).toBeNull()
    expect(wrapper.find('input').element.value).toEqual('')
  })

  it('formats date', () => {
    expect(wrapper.vm.formattedValue).toEqual('24 Mar 2018')
    expect(wrapper.find('input').element.value).toEqual('24 Mar 2018')
  })

  it('delegates date formatting', () => {
    wrapper.setProps({
      selectedDate: new Date(2016, 1, 15),
      format: () => '2016/1/15',
    })
    expect(wrapper.vm.formattedValue).toEqual('2016/1/15')
    expect(wrapper.find('input').element.value).toEqual('2016/1/15')
  })

  it('emits showCalendar', () => {
    wrapper.setProps({
      showCalendarOnFocus: true,
    })
    wrapper.vm.showCalendar()
    expect(wrapper.emitted('show-calendar')).toBeFalsy()

    wrapper.setProps({
      showCalendarOnFocus: false,
    })
    wrapper.vm.showCalendar()
    expect(wrapper.emitted('show-calendar')).toBeTruthy()
  })

  it('adds bootstrap classes', () => {
    wrapper.setProps({
      bootstrapStyling: true,
    })
    expect(wrapper.find('input').element.classList).toContain('form-control')
  })

  it('appends bootstrap classes', () => {
    wrapper.setProps({
      inputClass: 'someClass',
      bootstrapStyling: true,
    })
    expect(wrapper.find('input').element.classList).toContain('form-control')
    expect(wrapper.find('input').element.classList).toContain('someClass')

    wrapper.setProps({
      inputClass: { someClass: true },
      bootstrapStyling: true,
    })
    expect(wrapper.find('input').element.classList).toContain('form-control')
    expect(wrapper.find('input').element.classList).toContain('someClass')
  })

  it('can be disabled', () => {
    wrapper.setProps({
      disabled: true,
    })
    expect(wrapper.find('input').attributes().disabled).toBeDefined()
  })

  it('accepts a function as a formatter', () => {
    wrapper.setProps({
      format: () => '!',
    })
    expect(wrapper.find('input').element.value).toEqual('!')
  })

  it('triggers closeCalendar on blur', () => {
    wrapper.find('input').trigger('blur')
    expect(wrapper.emitted('close-calendar')).toBeTruthy()
  })

  it('should open the calendar on focus', () => {
    wrapper.find('input').trigger('focus')
    expect(wrapper.emitted('show-calendar')).toBeFalsy()
    wrapper.setProps({
      showCalendarOnFocus: true,
    })
    wrapper.find('input').trigger('focus')
    expect(wrapper.emitted('show-calendar')).toBeTruthy()
  })

  it('should open the calendar only on calendar button click', () => {
    wrapper.setProps({
      calendarButton: true,
      showCalendarOnButtonClick: true,
    })
    wrapper.find('input').trigger('click')
    expect(wrapper.emitted('show-calendar')).toBeFalsy()
    wrapper.find('.vdp-datepicker__calendar-button').trigger('click')
    expect(wrapper.emitted('show-calendar')).toBeTruthy()
  })
})
