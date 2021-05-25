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
        format: 'dd MMM yyyy',
        translation: en,
        typeable: true,
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('emits `typed-date` on blur when date is valid', async () => {
    const input = wrapper.find('input')
    input.setValue('1 Jan 2000')
    await input.trigger('keyup')
    await input.trigger('blur')
    expect(wrapper.emitted('typed-date')).toBeTruthy()
  })

  it('does not emit `typed-date` on blur when date is invalid', async () => {
    const input = wrapper.find('input')
    input.setValue('invalid date')
    await input.trigger('keyup')
    await input.trigger('blur')
    expect(wrapper.emitted('typed-date')).toBeFalsy()
  })

  it('emits close on enter when calendar is open and date is valid', async () => {
    await wrapper.setProps({
      isOpen: true,
    })
    const input = wrapper.find('input')
    input.setValue('1 Jan 2000')
    await input.trigger('keyup')
    await input.trigger('keydown.enter')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('does not emit close on enter when date is invalid', async () => {
    const input = wrapper.find('input')
    input.setValue('invalid date')
    await input.trigger('keydown.enter')

    expect(wrapper.emitted('close')).toBeFalsy()
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
    input.trigger('keyup')
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
    input.trigger('keyup')
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
    input.trigger('keyup')
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
    input.trigger('keydown.enter')
    expect(wrapper.vm.formattedValue).toEqual('12.08.2018')
  })

  it('emits the date when typed', async () => {
    const input = wrapper.find('input')
    input.setValue('2018-04-24')
    await input.trigger('keyup')
    expect(wrapper.emitted('typed-date')).toBeDefined()
    expect(wrapper.emitted('typed-date')[0][0]).toBeInstanceOf(Date)
  })

  it("doesn't emit the date if typeable=false", () => {
    const wrapperNotTypeAble = shallowMount(DateInput, {
      propsData: {
        format: 'dd MMM yyyy',
        translation: en,
        typeable: false,
      },
    })
    const input = wrapperNotTypeAble.find('input')
    wrapperNotTypeAble.vm.input.value = '2018-04-24'
    input.trigger('keydown')
    input.trigger('keyup')
    expect(wrapperNotTypeAble.emitted().typedDate).not.toBeDefined()
  })
})

describe('Datepicker mount', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Datepicker, {
      propsData: {
        format: 'dd MMM yyyy',
        translation: en,
        typeable: true,
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
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

  it('formats the date on blur', async () => {
    const input = wrapper.find('input')
    input.setValue('2018-04-24')
    await input.trigger('keyup')
    await input.trigger('blur')
    expect(input.element.value).toEqual('24 Apr 2018')
  })

  it('closes the calendar when no date is selected and escape is pressed', async () => {
    const input = wrapper.find('input')

    await input.trigger('click')
    expect(wrapper.vm.isOpen).toBeTruthy()

    await input.trigger('keydown.esc')
    expect(wrapper.vm.isOpen).toBeFalsy()
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

  it('formats a valid date when the input field is blurred and the calendar is closed', async () => {
    const input = wrapper.find('input')

    input.setValue('12jan12')
    await input.trigger('keyup')
    await input.trigger('blur')

    expect(input.element.value).toBe('12 Jan 2012')
    expect(wrapper.vm.selectedDate).toStrictEqual(new Date(2012, 0, 12))
  })

  it('formats a valid date when the input field is blurred and the calendar is open', async () => {
    const input = wrapper.find('input')

    await input.trigger('click')
    expect(wrapper.vm.isOpen).toBeTruthy()

    input.setValue('12jan12')
    await input.trigger('keyup')
    await input.trigger('blur')

    expect(input.element.value).toBe('12 Jan 2012')
    expect(wrapper.vm.selectedDate).toStrictEqual(new Date(2012, 0, 12))
  })

  it('submits a valid date on pressing the enter key', async () => {
    const input = wrapper.find('input')

    input.setValue('12jan12')
    await input.trigger('keyup')
    await input.trigger('keydown.enter')

    expect(input.element.value).toBe('12 Jan 2012')
    expect(wrapper.vm.isOpen).toBeFalsy()
    expect(wrapper.vm.selectedDate).toStrictEqual(new Date(2012, 0, 12))

    await input.trigger('click')
    expect(wrapper.vm.isOpen).toBeTruthy()

    input.setValue('13feb13')
    await input.trigger('keyup')
    await input.trigger('keydown.enter')

    expect(input.element.value).toBe('13 Feb 2013')
    expect(wrapper.vm.isOpen).toBeFalsy()
    expect(wrapper.vm.selectedDate).toStrictEqual(new Date(2013, 1, 13))
  })

  it('only submits a date on pressing the enter key when typeable', async () => {
    const input = wrapper.find('input')

    await wrapper.setProps({
      typeable: false,
    })

    input.setValue('12jan12')
    await input.trigger('keyup')
    await input.trigger('keydown.enter')

    expect(input.element.value).toBe('12jan12')
    expect(wrapper.vm.isOpen).toBeFalsy()
    expect(wrapper.vm.selectedDate).toBeNull()
  })
})

describe('Datepicker mounted to document body', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Datepicker, {
      attachTo: document.body,
      propsData: {
        format: 'dd MMM yyyy',
        translation: en,
        typeable: true,
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('opens the calendar when the space bar is pressed on the input field', async () => {
    const input = wrapper.find('input')
    await input.trigger('keydown.space')
    await input.trigger('keyup.space')

    expect(wrapper.vm.isOpen).toBeTruthy()
  })

  it('focuses the previous button on arrowing down from the input field when open', async () => {
    const input = wrapper.find('input')
    const prevButton = wrapper.find('.prev')

    await input.trigger('focus')
    await wrapper.find('input').trigger('keydown.down')

    expect(document.activeElement).toBe(prevButton.element)
  })

  it('closes the calendar on pressing escape if a date is selected', async () => {
    await wrapper.setProps({
      value: new Date(2020, 0, 1),
    })

    const input = wrapper.find('input')

    await input.trigger('click')
    expect(wrapper.vm.isOpen).toBeTruthy()

    await input.trigger('keydown.esc')
    expect(wrapper.vm.isOpen).toBeFalsy()
  })

  it('clears the date on pressing escape if a date is selected and the calendar is closed', async () => {
    await wrapper.setProps({
      value: new Date(2020, 0, 1),
    })

    const input = wrapper.find('input')
    expect(wrapper.vm.selectedDate).toStrictEqual(new Date(2020, 0, 1))

    await input.trigger('keydown.esc')
    expect(wrapper.vm.selectedDate).toBeNull()
  })

  it('clears invalid input on arrowing down from the input field', async () => {
    const input = wrapper.find('input')

    input.setValue('invalid date')
    await input.trigger('keyup')
    expect(input.element.value).toBe('invalid date')

    await input.trigger('keydown.down')
    expect(input.element.value).toBe('')
  })

  it('formats valid input arrowing down from the input field', async () => {
    const input = wrapper.find('input')

    input.setValue('12jan12')
    await input.trigger('keyup')
    expect(input.element.value).toBe('12jan12')

    await input.trigger('keydown.down')
    expect(input.element.value).toBe('12 Jan 2012')
  })

  it('submits a valid input when the input field is blurred', async () => {
    await wrapper.setProps({
      value: new Date(2019, 2, 25),
    })
    const input = wrapper.find('input')

    input.setValue('13jan2020')
    await input.trigger('keyup')
    expect(input.element.value).toBe('13jan2020')

    await input.trigger('blur')
    expect(input.element.value).toBe('13 Jan 2020')
  })

  it('submits a blank input when the input field is blurred', async () => {
    const input = wrapper.find('input')

    input.setValue('')
    await input.trigger('keyup')
    expect(input.element.value).toBe('')

    await input.trigger('keydown.enter')
    expect(input.element.value).toBe('')
  })

  it('removes leading space from input when the calendar is open and the input field is blurred', async () => {
    const input = wrapper.find('input')

    input.setValue(' ')
    await input.trigger('keyup')
    await input.trigger('blur')
    expect(input.element.value).toBe('')

    input.setValue('12 jan 12')
    await input.trigger('keyup.space')
    await input.trigger('blur')
    expect(input.element.value).toBe('12 Jan 2012')
  })
})
