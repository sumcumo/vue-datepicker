import { shallowMount } from '@vue/test-utils'
import { format } from 'date-fns'
import DateInput from '~/components/DateInput.vue'
import { en } from '~/locale'

describe('DateInput unmounted', () => {
  it('checks props default', () => {
    expect(typeof DateInput.props.translation.default).toEqual('function')
    expect(DateInput.props.translation.default()).toEqual({})
  })
})

describe('DateInput shallowMounted', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(DateInput)
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders correct contents', () => {
    expect(wrapper.findAll('input')).toHaveLength(1)
  })

  it('clears the date', async () => {
    const input = wrapper.find('input')

    expect(input.element.value).toEqual('')
  })

  it('emits `open` event on click', async () => {
    const input = wrapper.find('input')
    await input.trigger('click')

    expect(wrapper.emitted('open')).toBeTruthy()
  })

  it('emits `open` event when the space bar is pressed on the input field', async () => {
    const input = wrapper.find('input')

    await input.trigger('keydown.space')
    await input.trigger('keyup.space')

    expect(wrapper.emitted('open')).toBeTruthy()
  })

  it('does not emit `open` event on focus', async () => {
    const input = wrapper.find('input')

    await input.trigger('focus')

    expect(wrapper.emitted('open')).toBeFalsy()
  })
})

describe('DateInput shallowMounted with selectedDate', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(DateInput, {
      propsData: {
        selectedDate: new Date(2018, 2, 24),
        translation: en,
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('formats date', () => {
    const input = wrapper.find('input')

    expect(input.element.value).toEqual('24 Mar 2018')
  })

  it('delegates date formatting', async () => {
    await wrapper.setProps({
      selectedDate: new Date(2016, 0, 15),
      format: (date) => {
        return format(new Date(date), 'dd.MM.yyyy')
      },
    })

    const input = wrapper.find('input')

    expect(input.element.value).toEqual('15.01.2016')
  })

  it('can be disabled', async () => {
    await wrapper.setProps({
      disabled: true,
    })

    const input = wrapper.find('input')

    expect(input.attributes().disabled).toBeDefined()
  })

  it('accepts a function as a formatter', async () => {
    await wrapper.setProps({
      format: () => '!',
    })

    const input = wrapper.find('input')

    expect(input.element.value).toEqual('!')
  })

  it('emits `close` when escape is pressed and calendar is open', async () => {
    await wrapper.setProps({
      isOpen: true,
    })

    const input = wrapper.find('input')
    await input.trigger('keydown.esc')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('opens ONLY on button click when the relevant prop is set', async () => {
    await wrapper.setProps({
      calendarButton: true,
      showCalendarOnButtonClick: true,
    })

    const input = wrapper.find('input')
    await input.trigger('click')

    expect(wrapper.emitted('open')).toBeFalsy()

    const calendarButton = wrapper.find('button[data-test-calendar-button]')
    await calendarButton.trigger('click')

    expect(wrapper.emitted('open')).toBeTruthy()
  })

  it('emits `clear-date` when delete is pressed', async () => {
    const input = wrapper.find('input')

    await input.trigger('keydown.del')

    expect(wrapper.emitted('clear-date')).toBeTruthy()
  })

  it('emits `clear-date` when backspace is pressed', async () => {
    const input = wrapper.find('input')

    await input.trigger('keydown.backspace')

    expect(wrapper.emitted('clear-date')).toBeTruthy()
  })
})

describe('DateInput shallowMounted with showCalendarOnFocus', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(DateInput, {
      propsData: {
        showCalendarOnFocus: true,
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('emits `open` event on focus', async () => {
    const input = wrapper.find('input')

    await input.trigger('focus')

    expect(wrapper.emitted('open')).toBeTruthy()
  })

  it('opens calendar on click when `show-calendar-on-focus` is true', async () => {
    const input = wrapper.find('input')

    await input.trigger('focus')
    await input.trigger('click')

    expect(wrapper.emitted('open')).toBeTruthy()
  })

  it('closes calendar via button and reopens via focus', async () => {
    await wrapper.setProps({
      calendarButton: true,
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
})

describe('DateInput shallowMounted with bootstrap styling', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(DateInput, {
      propsData: {
        bootstrapStyling: true,
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('adds bootstrap classes', async () => {
    const input = wrapper.find('input')

    expect(input.element.classList).toContain('form-control')
  })

  it('appends bootstrap classes', async () => {
    await wrapper.setProps({
      inputClass: 'someClass',
    })

    const input = wrapper.find('input')

    expect(input.element.classList).toContain('form-control')
    expect(input.element.classList).toContain('someClass')

    await wrapper.setProps({
      inputClass: { someClass: true },
    })

    expect(input.element.classList).toContain('form-control')
    expect(input.element.classList).toContain('someClass')
  })
})
