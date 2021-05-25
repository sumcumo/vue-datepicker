import { shallowMount } from '@vue/test-utils'
import DateInput from '~/components/DateInput.vue'
import { en } from '~/locale'

describe('DateInput unmounted', () => {
  it('check props default', () => {
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

  it('should render correct contents', () => {
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

  it('closes calendar via button and reopens via focus when `show-calendar-on-focus` is true', async () => {
    await wrapper.setProps({
      calendarButton: true,
      showCalendarOnFocus: true,
    })

    const input = wrapper.find('input')
    const calendarButton = wrapper.find('button[data-test-calendar-button]')

    await input.trigger('focus')
    expect(wrapper.emitted('open')).toBeTruthy()

    await input.trigger('blur')
    await calendarButton.trigger('focus')
    await calendarButton.trigger('click')
    expect(wrapper.emitted('close')).toBeFalsy()

    await input.trigger('focus')
    expect(wrapper.emitted('open')).toBeTruthy()
  })

  it('opens calendar on click when `show-calendar-on-focus` is true', async () => {
    await wrapper.setProps({
      showCalendarOnFocus: true,
    })

    const input = wrapper.find('input')

    expect(wrapper.vm.isOpen).toBeFalsy()
    await input.trigger('focus')
    await input.trigger('click')
    expect(wrapper.emitted('open')).toBeTruthy()
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

  it('opens the calendar on click', async () => {
    const input = wrapper.find('input')
    await input.trigger('click')

    expect(wrapper.emitted('open')).toBeTruthy()
  })

  it('opens the calendar when the space bar is pressed on the input field', async () => {
    const input = wrapper.find('input')
    await input.trigger('keydown.space')
    await input.trigger('keyup.space')

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
    await wrapper.setProps({
      calendarButton: true,
      showCalendarOnButtonClick: true,
    })

    const input = wrapper.find('input')

    await input.trigger('click')
    expect(wrapper.emitted('open')).toBeFalsy()

    await input.trigger('keyup.space')
    expect(wrapper.emitted('open')).toBeFalsy()

    wrapper.find('.vdp-datepicker__calendar-button').trigger('click')
    expect(wrapper.emitted('open')).toBeTruthy()
  })

  it('clears the calendar on pressing the escape key', async () => {
    const input = wrapper.find('input')

    await input.trigger('keydown.esc')
    expect(wrapper.emitted('clear-date')).toBeTruthy()
  })

  it('does not do anything when tab is pressed', async () => {
    // A pointless test, but it helps with coverage
    const input = wrapper.find('input')
    const spy = jest.spyOn(wrapper.vm, 'validateTypedDate')

    await input.trigger('keydown.tab')

    expect(spy).not.toHaveBeenCalled()
  })
})
