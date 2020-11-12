import { mount, shallowMount } from '@vue/test-utils'
import {
  format,
  parse,
} from 'date-fns'
import DateInput from '~/components/DateInput'
import Datepicker from '~/components/Datepicker'
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

  it('does not format the date when typed', () => {
    const dateString = '2018-04-24'
    wrapper.vm.input.value = dateString
    expect(wrapper.vm.input.value).toEqual(dateString)
    wrapper.setData({
      typedDate: dateString,
    })
    wrapper.setProps({
      selectedDate: new Date(dateString),
    })
    expect(wrapper.vm.typedDate).toEqual(dateString)
    expect(wrapper.vm.formattedValue).toEqual(dateString)
  })

  it('allows international custom date format d.M.yyyy', () => {
    const dateString = '24.06.2018'
    wrapper.setProps({
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

  it('allows international custom date format dd/MM/yyyy', () => {
    const dateString = '24/06/2018'
    wrapper.setProps({
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

  it('allows international custom date format dd MM yyyy', () => {
    const dateString = '24 06 2018'
    wrapper.setProps({
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

  it('allows function format', () => {
    const dateString = '2018-08-12'
    wrapper.setProps({
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
    input.element.value = dateString
    expect(input.element.value).toEqual(dateString)
    input.trigger('keyup')
    expect(wrapper.vm.formattedValue).toEqual('12.08.2018')
  })

  it('emits the date when typed', () => {
    const input = wrapper.find('input')
    wrapper.vm.input.value = '2018-04-24'
    input.trigger('keyup')
    expect(wrapper.emitted()['typed-date']).toBeDefined()
    expect(wrapper.emitted()['typed-date'][0][0]).toBeInstanceOf(Date)
  })

  it('emits closeCalendar when return is pressed', () => {
    wrapper.find('input').trigger('keydown.enter')
    expect(wrapper.emitted('close-calendar')).toBeTruthy()
  })

  it('emits closeCalendar on blur', () => {
    wrapper.find('input').trigger('blur')
    expect(wrapper.emitted('close-calendar')).toBeTruthy()
  })

  it('clears a typed date if it does not parse', () => {
    const input = wrapper.find('input')
    wrapper.setData({ typedDate: 'not a date' })
    input.trigger('blur')
    expect(wrapper.emitted()['clear-date']).toBeDefined()
  })

  it('doesn\'t emit the date if typeable=false', () => {
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
        useUtc: true,
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('shows the correct month as you type', async () => {
    const spySetDate = jest.spyOn(wrapper.vm, 'setDate')
    const input = wrapper.find('input')

    await input.trigger('click')
    input.element.value = 'Jan'
    await input.trigger('keyup')

    expect(spySetDate).toHaveBeenCalled()
    expect(wrapper.vm.isOpen).toBeTruthy()
    expect(new Date(wrapper.vm.pageDate).getMonth()).toBe(0)

    input.element.value = 'Feb'
    await input.trigger('keyup')

    expect(new Date(wrapper.vm.pageDate).getMonth()).toBe(1)
  })

  it('formats the date on blur', () => {
    const input = wrapper.find('input')
    input.element.value = '2018-04-24'
    input.trigger('blur')
    expect(input.element.value).toEqual('24 Apr 2018')
  })
})
