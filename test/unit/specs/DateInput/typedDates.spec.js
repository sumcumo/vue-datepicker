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
    await input.trigger('keyup')
    expect(wrapper.vm.formattedValue).toEqual('12.08.2018')
  })

  it('emits the date when typed', async () => {
    const input = wrapper.find('input')
    input.setValue('2018-04-24')
    input.trigger('keyup')
    expect(wrapper.emitted()['typed-date']).toBeDefined()
    expect(wrapper.emitted()['typed-date'][0][0]).toBeInstanceOf(Date)
  })

  it('emits `close` when return is pressed', async () => {
    const input = wrapper.find('input')
    await input.trigger('keydown.enter')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('clears a typed date if it does not parse', async () => {
    const input = wrapper.find('input')
    wrapper.setData({ typedDate: 'not a date' })
    await input.trigger('blur')
    expect(wrapper.emitted()['clear-date']).toBeDefined()
  })

  it("doesn't emit the date if typeable=false", async () => {
    const wrapperNotTypeAble = shallowMount(DateInput, {
      propsData: {
        format: 'dd MMM yyyy',
        translation: en,
        typeable: false,
      },
    })
    const input = wrapperNotTypeAble.find('input')
    input.setValue('2018-04-24')
    await input.trigger('keydown')
    await input.trigger('keyup')
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
    await input.trigger('blur')

    expect(input.element.value).toEqual('24 Apr 2018')
  })
})
