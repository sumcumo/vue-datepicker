import { mount, shallowMount } from '@vue/test-utils'
import { format, parse } from 'date-fns'
import DateInput from '~/components/DateInput.vue'
import Datepicker from '~/components/Datepicker.vue'
import { en } from '~/locale'

describe('DateInput', () => {
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
    const dateString = '2018-04-24'
    wrapper.vm.input.value = dateString
    expect(wrapper.vm.input.value).toEqual(dateString)
    await wrapper.setData({
      typedDate: dateString,
    })
    await wrapper.setProps({
      selectedDate: new Date(dateString),
    })
    expect(wrapper.vm.typedDate).toEqual(dateString)
    expect(wrapper.vm.formattedValue).toEqual(dateString)
  })

  it('allows international custom date format d.M.yyyy', async () => {
    const dateString = '24.06.2018'
    await wrapper.setProps({
      selectedDate: new Date(dateString),
      typeable: true,
      format: 'd.M.yyyy',
    })
    const input = wrapper.find('input')
    wrapper.vm.input.value = dateString
    expect(wrapper.vm.input.value).toEqual(dateString)
    await input.trigger('keyup')
    expect(wrapper.vm.formattedValue).toEqual(dateString)
  })

  it('allows international custom date format dd/MM/yyyy', async () => {
    const dateString = '24/06/2018'
    await wrapper.setProps({
      selectedDate: new Date(dateString),
      typeable: true,
      format: 'dd/MM/yyyy',
    })
    const input = wrapper.find('input')
    wrapper.vm.input.value = dateString
    expect(wrapper.vm.input.value).toEqual(dateString)
    await input.trigger('keyup')
    expect(wrapper.vm.formattedValue).toEqual(dateString)
  })

  it('allows international custom date format dd MM yyyy', async () => {
    const dateString = '24 06 2018'
    await wrapper.setProps({
      selectedDate: new Date(dateString),
      typeable: true,
      format: 'dd MM yyyy',
    })
    const input = wrapper.find('input')
    wrapper.vm.input.value = dateString
    expect(wrapper.vm.input.value).toEqual(dateString)
    await input.trigger('keyup')
    expect(wrapper.vm.formattedValue).toEqual(dateString)
  })

  it('allows function format', async () => {
    const dateString = '2018-08-12'
    await wrapper.setProps({
      selectedDate: new Date(dateString),
      typeable: true,
      format(date) {
        return format(new Date(date), 'dd.MM.yyyy')
      },
      parser(date) {
        return parse(date, 'dd.MM.yyyy', new Date())
      },
    })
    const input = wrapper.find('input')
    input.setValue(dateString)
    expect(input.element.value).toEqual(dateString)
    input.trigger('keyup')
    expect(wrapper.vm.formattedValue).toEqual('12.08.2018')
  })

  it('emits the date when typed', async () => {
    const input = wrapper.find('input')
    input.setValue('2018-04-24')
    await input.trigger('keyup')
    expect(wrapper.emitted('typed-date')).toBeDefined()
    expect(wrapper.emitted('typed-date')[0][0]).toBeInstanceOf(Date)
  })

  it('emits `close` when the calendar is open and return is pressed', async () => {
    await wrapper.setProps({
      isOpen: true,
    })

    const input = wrapper.find('input')
    await input.trigger('keydown.enter')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it("doesn't emit the date if typeable=false", async () => {
    const wrapperNotTypeAble = shallowMount(DateInput, {
      propsData: {
        translation: en,
        typeable: false,
      },
    })
    const input = wrapperNotTypeAble.find('input')
    input.setValue('2018-04-24')
    await input.trigger('keyup')
    await input.trigger('keydown.enter')
    expect(wrapperNotTypeAble.emitted('typedDate')).not.toBeDefined()
  })
})

describe('Datepicker mount', () => {
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

  it('sets the date on typedDate event', () => {
    const today = new Date()
    wrapper.vm.handleTypedDate(today)
    expect(wrapper.vm.selectedDate).toEqual(today)
  })

  it('shows the correct month as you type', async () => {
    const spySelectDate = jest.spyOn(wrapper.vm, 'selectDate')
    const input = wrapper.find('input')

    await input.trigger('click')
    input.setValue('Jan')
    await input.trigger('keyup')

    expect(spySelectDate).toHaveBeenCalled()
    expect(wrapper.vm.isOpen).toBeTruthy()
    expect(new Date(wrapper.vm.pageDate).getMonth()).toBe(0)

    input.setValue('Feb')
    await input.trigger('keyup')

    expect(new Date(wrapper.vm.pageDate).getMonth()).toBe(1)
  })

  it('formats a valid date when the input field is blurred', async () => {
    const input = wrapper.find('input')
    input.setValue('2018-04-24')
    await input.trigger('keyup')
    await input.trigger('blur')

    expect(input.element.value).toEqual('24 Apr 2018')
  })

  it('clears an invalid date when the input field is blurred', async () => {
    const input = wrapper.find('input')

    await input.trigger('click')
    expect(wrapper.vm.isOpen).toBeTruthy()

    input.setValue('invalid date')
    await input.trigger('keyup')
    await input.trigger('blur')

    expect(input.element.value).toBe('')
    expect(wrapper.vm.selectedDate).toBeNull()
  })

  it('closes via the calendar button when showCalendarOnFocus = true, despite input being focused', async () => {
    await wrapper.setProps({
      calendarButton: true,
      showCalendarOnFocus: true,
    })

    const input = wrapper.find('input')
    const calendarButton = wrapper.find('button[data-test-calendar-button]')

    await input.trigger('focus')
    expect(wrapper.vm.isOpen).toBeTruthy()

    await input.trigger('blur')
    await calendarButton.trigger('click')
    expect(wrapper.vm.isOpen).toBeFalsy()
  })

  it('resets the date correctly', async () => {
    const input = wrapper.find('input')
    await input.trigger('click')
    input.setValue('1 Jan 2000')
    await input.trigger('keyup')
    await input.trigger('keydown.enter')
    expect(wrapper.vm.selectedDate).toEqual(new Date(2000, 0, 1))

    await wrapper.setProps({
      value: new Date(2016, 1, 15),
    })

    expect(wrapper.vm.selectedDate).toEqual(new Date(2016, 1, 15))
  })
})
