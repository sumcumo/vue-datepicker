import { shallowMount } from '@vue/test-utils'
import DateInput from '~/components/DateInput.vue'
import { en } from '~/locale'

describe('DateInput unmounted', () => {
  it('checks props default', () => {
    expect(typeof DateInput.props.translation.default).toEqual('function')
    expect(DateInput.props.translation.default()).toEqual({})
  })
})

describe('DateInput', () => {
  let wrapper
  const createWrapper = () => {
    return shallowMount(DateInput, {
      propsData: {
        selectedDate: new Date(2018, 2, 24),
        format: 'dd MMM yyyy',
        translation: en,
      },
    })
  }
  beforeEach(() => {
    wrapper = createWrapper()
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders correct contents', () => {
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

  it('opens calendar on focus when `show-calendar-on-focus` is true', async () => {
    wrapper.setProps({
      showCalendarOnFocus: true,
    })
    expect(wrapper.vm.isOpen).toBeFalsy()
    wrapper.find('input').trigger('focus')
    expect(wrapper.emitted('open')).toBeTruthy()
  })

  it('does not open calendar on focus, if show-calendar-on-focus prop is false', async () => {
    wrapper.setProps({
      showCalendarOnFocus: false,
    })
    expect(wrapper.vm.isOpen).toBeFalsy()

    wrapper.find('input').trigger('focus')
    expect(wrapper.emitted('open')).toBeFalsy()
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

  it('emits close on blur', async () => {
    const input = wrapper.find('input')
    await input.trigger('blur')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('emits close when escape is pressed', () => {
    const input = wrapper.find('input')
    input.trigger('keydown.escape')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('opens the calendar on click', async () => {
    wrapper.find('input').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('open')).toBeTruthy()
  })

  it('opens the calendar on focus', async () => {
    wrapper.find('input').trigger('focus')
    expect(wrapper.emitted('open')).toBeFalsy()
    wrapper.setProps({
      showCalendarOnFocus: true,
    })
    await wrapper.vm.$nextTick()
    wrapper.find('input').trigger('focus')
    expect(wrapper.emitted('open')).toBeTruthy()
  })

  it('opens ONLY on button click when the relevant prop is set', async () => {
    wrapper.setProps({
      calendarButton: true,
      showCalendarOnButtonClick: true,
    })
    await wrapper.vm.$nextTick()
    wrapper.find('input').trigger('click')
    expect(wrapper.emitted('open')).toBeFalsy()
    wrapper.find('.vdp-datepicker__calendar-button').trigger('click')
    expect(wrapper.emitted('open')).toBeTruthy()
  })
})
