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
    await wrapper.setProps({
      selectedDate: null,
    })

    expect(wrapper.vm.formattedValue).toBeNull()
    expect(wrapper.find('input').element.value).toEqual('')
  })

  it('formats date', () => {
    expect(wrapper.vm.formattedValue).toEqual('24 Mar 2018')
    expect(wrapper.find('input').element.value).toEqual('24 Mar 2018')
  })

  it('delegates date formatting', async () => {
    await wrapper.setProps({
      selectedDate: new Date(2016, 1, 15),
      format: () => '2016/1/15',
    })

    expect(wrapper.vm.formattedValue).toEqual('2016/1/15')
    expect(wrapper.find('input').element.value).toEqual('2016/1/15')
  })

  it('opens calendar on focus when `show-calendar-on-focus` is true', async () => {
    await wrapper.setProps({
      showCalendarOnFocus: true,
    })

    const input = wrapper.find('input')

    expect(wrapper.vm.isOpen).toBeFalsy()

    await input.trigger('focus')

    expect(wrapper.emitted('open')).toBeTruthy()
  })

  it('does not open calendar on focus, if show-calendar-on-focus prop is false', async () => {
    const input = wrapper.find('input')
    await wrapper.setProps({
      showCalendarOnFocus: false,
    })

    expect(wrapper.vm.isOpen).toBeFalsy()

    await input.trigger('focus')

    expect(wrapper.emitted('open')).toBeFalsy()
  })

  it('adds bootstrap classes', async () => {
    await wrapper.setProps({
      bootstrapStyling: true,
    })

    expect(wrapper.find('input').element.classList).toContain('form-control')
  })

  it('appends bootstrap classes', async () => {
    await wrapper.setProps({
      inputClass: 'someClass',
      bootstrapStyling: true,
    })

    expect(wrapper.find('input').element.classList).toContain('form-control')
    expect(wrapper.find('input').element.classList).toContain('someClass')

    await wrapper.setProps({
      inputClass: { someClass: true },
      bootstrapStyling: true,
    })

    expect(wrapper.find('input').element.classList).toContain('form-control')
    expect(wrapper.find('input').element.classList).toContain('someClass')
  })

  it('can be disabled', async () => {
    await wrapper.setProps({
      disabled: true,
    })

    expect(wrapper.find('input').attributes().disabled).toBeDefined()
  })

  it('accepts a function as a formatter', async () => {
    await wrapper.setProps({
      format: () => '!',
    })

    expect(wrapper.find('input').element.value).toEqual('!')
  })

  it('emits close when escape is pressed', async () => {
    const input = wrapper.find('input')
    await input.trigger('keydown.escape')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('opens the calendar on click', async () => {
    const input = wrapper.find('input')
    await input.trigger('click')

    expect(wrapper.emitted('open')).toBeTruthy()
  })

  it('opens the calendar on focus', async () => {
    const input = wrapper.find('input')
    await input.trigger('focus')

    expect(wrapper.emitted('open')).toBeFalsy()

    await wrapper.setProps({
      showCalendarOnFocus: true,
    })
    await input.trigger('focus')

    expect(wrapper.emitted('open')).toBeTruthy()
  })

  it('opens ONLY on button click when the relevant prop is set', async () => {
    const input = wrapper.find('input')
    await wrapper.setProps({
      calendarButton: true,
      showCalendarOnButtonClick: true,
    })
    await input.trigger('click')

    expect(wrapper.emitted('open')).toBeFalsy()

    const calendarButton = wrapper.find('button[data-test-calendar-button]')
    await calendarButton.trigger('click')

    expect(wrapper.emitted('open')).toBeTruthy()
  })
})
