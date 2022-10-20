import { mount, shallowMount } from '@vue/test-utils'
import { format, parse } from 'date-fns'
import DateInput from '~/components/DateInput.vue'
import Datepicker from '~/components/Datepicker.vue'
import { en } from '~/locale'

describe('DateInput shallowMounted', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(DateInput, {
      propsData: {
        translation: en,
        typeable: true,
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('does not format the date when typed', async () => {
    const input = wrapper.find('input')
    const dateString = '2018-04-24'

    input.setValue(dateString)
    await input.trigger('keyup')

    expect(input.element.value).toEqual(dateString)
  })

  it('allows international custom date format dd.MM.yyyy', async () => {
    await wrapper.setProps({
      format: 'dd.MM.yyyy',
    })

    const input = wrapper.find('input')
    const dateString = '04.06.2018'

    input.setValue(dateString)
    await input.trigger('keydown.enter')

    expect(input.element.value).toEqual(dateString)
  })

  it('allows international custom date format d.M.yyyy', async () => {
    await wrapper.setProps({
      format: 'd.M.yyyy',
    })

    const input = wrapper.find('input')
    const dateString = '4.6.2018'

    input.setValue(dateString)
    await input.trigger('keydown.enter')

    expect(input.element.value).toEqual(dateString)
  })

  it('allows international custom date format dd/MM/yyyy', async () => {
    await wrapper.setProps({
      format: 'dd/MM/yyyy',
    })

    const input = wrapper.find('input')
    const dateString = '24/06/2018'

    input.setValue(dateString)
    await input.trigger('keydown.enter')

    expect(input.element.value).toEqual(dateString)
  })

  it('allows international custom date format dd MM yyyy', async () => {
    await wrapper.setProps({
      format: 'dd MM yyyy',
    })

    const input = wrapper.find('input')
    const dateString = '24 06 2018'

    input.setValue(dateString)
    await input.trigger('keydown.enter')

    expect(input.element.value).toEqual(dateString)
  })

  it('emits the date when typed', async () => {
    const input = wrapper.find('input')
    const dateString = '2018-04-24'

    input.setValue(dateString)
    await input.trigger('keyup')

    expect(wrapper.emitted('typed-date')).toBeDefined()
    expect(wrapper.emitted('typed-date')[0][0]).toStrictEqual(
      new Date(dateString),
    )
  })

  it('emits `select-typed-date` when enter is pressed', async () => {
    const input = wrapper.find('input')

    await input.trigger('keydown.enter')

    expect(wrapper.emitted('select-typed-date')).toBeTruthy()
  })

  it('parses a typed date using a function passed in via a prop', async () => {
    await wrapper.setProps({
      format: (date) => {
        return format(date, 'dd/mm/yyyy')
      },
      parser: (date) => {
        return parse(date, 'yyyy/mm/dd', new Date())
      },
    })

    const input = wrapper.find('input')

    input.setValue('2022/01/05')
    await input.trigger('blur')

    expect(input.element.value).toBe('05/01/2022')
  })

  it("doesn't emit the date if typeable=false", async () => {
    await wrapper.setProps({
      typeable: false,
    })

    const input = wrapper.find('input')

    input.setValue('2018-04-24')
    await input.trigger('keydown.enter')

    expect(wrapper.emitted('typed-date')).not.toBeDefined()
  })
})

describe('Datepicker mounted', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Datepicker, {
      propsData: {
        typeable: true,
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('sets the date and closes the calendar', () => {
    const today = new Date()

    wrapper.vm.open()
    wrapper.vm.selectTypedDate(today)

    expect(wrapper.vm.selectedDate).toEqual(today)
    expect(wrapper.vm.isOpen).toBeFalsy()
  })

  it('emits `selected` when a valid date is typed and the `enter` key is pressed', async () => {
    const input = wrapper.find('input')

    input.setValue('Jan')
    await input.trigger('keyup')

    expect(wrapper.emitted('selected')).toBeUndefined()

    await input.trigger('keydown.enter')

    expect(wrapper.emitted('selected')).toBeDefined()
    expect(wrapper.emitted('selected')[0][0]).toBeInstanceOf(Date)
  })

  it('does not emit `selected` when an invalid date is typed and the `enter` key is pressed', async () => {
    const input = wrapper.find('input')

    input.setValue('invalid date')
    await input.trigger('keydown.enter')

    expect(wrapper.emitted('selected')).toBeUndefined()
  })

  it('shows the correct month as you type', async () => {
    const input = wrapper.find('input')

    await wrapper.vm.open()

    input.setValue('Jan')
    await input.trigger('keyup')

    expect(wrapper.vm.isOpen).toBeTruthy()
    expect(new Date(wrapper.vm.pageDate).getMonth()).toBe(0)

    input.setValue('Feb')
    await input.trigger('keyup')

    expect(new Date(wrapper.vm.pageDate).getMonth()).toBe(1)
  })

  it('formats a valid date when the input field is blurred', async () => {
    const input = wrapper.find('input')

    input.setValue('2018-04-24')
    await input.trigger('blur')

    expect(input.element.value).toEqual('24 Apr 2018')
  })

  it('clears an invalid date when the input field is blurred', async () => {
    const input = wrapper.find('input')

    input.setValue('invalid date')
    await input.trigger('blur')

    expect(input.element.value).toBe('')
    expect(wrapper.vm.selectedDate).toBeNull()
  })

  it('resets the date correctly', async () => {
    const input = wrapper.find('input')

    input.setValue('1 Jan 2000')
    await input.trigger('keydown.enter')

    expect(wrapper.vm.selectedDate).toEqual(new Date(2000, 0, 1))

    await wrapper.setProps({
      value: new Date(2016, 1, 15),
    })

    expect(wrapper.vm.selectedDate).toEqual(new Date(2016, 1, 15))
  })

  it('closes the calendar when escape is pressed', async () => {
    const input = wrapper.find('input')

    await input.trigger('click')
    expect(wrapper.vm.isOpen).toBeTruthy()

    await input.trigger('keydown.esc')
    expect(wrapper.vm.isOpen).toBeFalsy()
  })

  it('opens the calendar when the space bar is pressed on the input field', async () => {
    const input = wrapper.find('input')

    await input.trigger('keydown.space')
    await input.trigger('keyup.space')

    expect(wrapper.vm.isOpen).toBeTruthy()
  })
})

describe('Datepicker mounted with showCalendarOnFocus', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Datepicker, {
      propsData: {
        typeable: true,
        showCalendarOnFocus: true,
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('toggles on clicking the input', async () => {
    const input = wrapper.find('input')

    await input.trigger('click')
    expect(wrapper.vm.isOpen).toBeTruthy()

    await input.trigger('click')
    expect(wrapper.vm.isOpen).toBeFalsy()
  })

  it('closes via the calendar button, despite input being focused', async () => {
    await wrapper.setProps({
      calendarButton: true,
    })

    const input = wrapper.find('input')
    const calendarButton = wrapper.find('button[data-test-calendar-button]')

    // See https://github.com/vuejs/vue-test-utils/issues/1932
    // await input.trigger('focus')
    await input.element.dispatchEvent(new Event('focus'))
    expect(wrapper.vm.isOpen).toBeTruthy()

    await calendarButton.trigger('click')
    expect(wrapper.vm.isOpen).toBeFalsy()
  })
})
