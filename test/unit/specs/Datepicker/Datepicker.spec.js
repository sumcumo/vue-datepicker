import {
  mount,
  shallowMount,
} from '@vue/test-utils'
import DateInput from '~/components/DateInput.vue'
import Datepicker from '~/components/Datepicker.vue'

describe('Datepicker unmounted', () => {
  it('has a mounted hook', () => {
    expect(typeof Datepicker.mounted).toEqual('function')
  })

  it('sets the correct default data', () => {
    expect(typeof Datepicker.data).toEqual('function')
    const defaultData = Datepicker.data()
    const defaultProps = Datepicker.props
    expect(defaultData.selectedDate).toEqual(null)
    expect(defaultData.currentPicker).toEqual('')
    expect(defaultData.calendarHeight).toEqual(0)

    expect(typeof defaultProps.fixedPosition.validator).toEqual('function')
    expect(defaultProps.fixedPosition.validator('bottom')).toBeTruthy()
    expect(defaultProps.fixedPosition.validator(true)).toBeFalsy()
  })
})
describe('Datepicker mounted', () => {
  let wrapper
  let date
  beforeEach(() => {
    date = new Date(2016, 1, 15)
    wrapper = mount(Datepicker, {
      propsData: {
        format: 'yyyy-MM-dd',
        value: date,
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('should emit blur', () => {
    const input = wrapper.find('input')
    input.trigger('blur')
    expect(wrapper.emitted().blur).toBeTruthy()
  })

  it('should emit focus', () => {
    const input = wrapper.find('input')
    input.trigger('focus')
    expect(wrapper.emitted().focus).toBeTruthy()
  })
})

describe('Datepicker shallowMounted', () => {
  let wrapper
  let date
  beforeEach(() => {
    date = new Date(2016, 1, 15)
    wrapper = shallowMount(Datepicker, {
      propsData: {
        format: 'yyyy-MM-dd',
        value: date,
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('correctly sets the value when created', () => {
    expect(wrapper.vm.value).toEqual(date)
  })

  it('correctly sets the value from method', () => {
    const newDate = new Date(2016, 9, 15)
    expect(typeof wrapper.vm.setValue).toEqual('function')
    wrapper.vm.setValue(newDate)
    expect(wrapper.vm.selectedDate).toEqual(newDate)
    const now = new Date()
    wrapper.vm.setValue()
    expect(wrapper.vm.selectedDate).toEqual(null)
    const pageDate = new Date(wrapper.vm.pageDate)
    expect(pageDate.getFullYear()).toEqual(now.getFullYear())
    expect(pageDate.getMonth()).toEqual(now.getMonth())
    expect(pageDate.getDate()).toEqual(1)
  })

  it('sets the date', () => {
    const dateTemp = new Date(2016, 9, 9)
    const wrapperTemp = shallowMount(Datepicker, {
      propsData: {
        format: 'yyyy-MM-dd',
      },
    })
    wrapperTemp.vm.setDate(dateTemp.getTime())
    expect(wrapperTemp.vm.selectedDate.getTime()).toEqual(dateTemp.getTime())
  })

  it('clears the date', () => {
    const dateTemp = new Date(2016, 9, 9)
    const wrapperTemp = shallowMount(Datepicker)
    wrapperTemp.vm.setDate(dateTemp.getTime())
    wrapperTemp.vm.clearDate()
    expect(wrapperTemp.vm.selectedDate).toEqual(null)
  })

  it('should set pageTimestamp to be now', () => {
    const data = Datepicker.data()
    const d = new Date(data.pageTimestamp)
    expect(d.getFullYear()).toEqual(new Date().getFullYear())
    expect(d.getMonth()).toEqual(new Date().getMonth())
    expect(d.getDate()).toEqual(1)
  })

  it('should open and close the calendar', () => {
    wrapper.vm.close()
    expect(wrapper.vm.isOpen).toEqual(false)

    wrapper.vm.showSpecificCalendar('Month')
    expect(wrapper.vm.isOpen).toEqual(true)

    wrapper.vm.close()
    expect(wrapper.vm.isOpen).toEqual(false)

    wrapper.vm.showSpecificCalendar('Year')
    expect(wrapper.vm.isOpen).toEqual(true)

    wrapper.vm.close()
    expect(wrapper.vm.isOpen).toEqual(false)

    wrapper.vm.showSpecificCalendar('Day')
    expect(wrapper.vm.isOpen).toEqual(true)
    // calendar is already open so acts as a toggle
    wrapper.vm.showCalendar()
    expect(wrapper.vm.isOpen).toEqual(false)
  })

  it('should emit selectedDisabled on a disabled timestamp', () => {
    const dateTemp = new Date(2016, 9, 1)
    wrapper.vm.selectDisabledDate({ timestamp: dateTemp.getTime() })
    expect(wrapper.emitted()['selected-disabled']).toBeTruthy()
  })

  it('can select a day', () => {
    const dateTemp = new Date(2016, 9, 1)
    wrapper.vm.selectDate({ timestamp: dateTemp.getTime() })
    expect(wrapper.vm.pageTimestamp).toEqual(dateTemp.getTime())
    expect(wrapper.vm.selectedDate.getMonth()).toEqual(9)
    expect(wrapper.vm.currentPicker).toEqual('')
    expect(wrapper.emitted().selected).toBeTruthy()
  })

  it('can select a month', () => {
    const dateTemp = new Date(2016, 9, 9)
    wrapper.vm.selectMonth({ timestamp: dateTemp.getTime() })
    expect(wrapper.emitted()['changed-month']).toBeTruthy()
    expect(wrapper.emitted()['changed-month'][0][0].timestamp).toEqual(dateTemp.getTime())
    expect(new Date(wrapper.vm.pageTimestamp).getMonth()).toEqual(dateTemp.getMonth())
    expect(wrapper.vm.currentPicker).toEqual('PickerDay')
  })

  it('can select a year', () => {
    const dateTemp = new Date(2018, 9, 9)
    wrapper.vm.selectYear({ timestamp: dateTemp.getTime() })
    expect(wrapper.emitted()['changed-year']).toBeTruthy()
    expect(wrapper.emitted()['changed-year'][0][0].timestamp).toEqual(dateTemp.getTime())
    expect(new Date(wrapper.vm.pageTimestamp).getFullYear()).toEqual(dateTemp.getFullYear())
    expect(wrapper.vm.currentPicker).toEqual('PickerMonth')
  })

  it('resets the default page date', () => {
    const wrapperTemp = shallowMount(Datepicker)
    const today = new Date()
    expect(wrapperTemp.vm.pageDate.getFullYear()).toEqual(today.getFullYear())
    expect(wrapperTemp.vm.pageDate.getMonth()).toEqual(today.getMonth())
    expect(wrapperTemp.vm.pageDate.getDate()).toEqual(1)
    wrapperTemp.vm.resetDefaultPageDate()
    expect(wrapperTemp.vm.pageDate.getFullYear()).toEqual(today.getFullYear())
    expect(wrapperTemp.vm.pageDate.getMonth()).toEqual(today.getMonth())
    expect(wrapperTemp.vm.pageDate.getDate()).toEqual(1)
  })

  it('does not set the default page date if a date is selected', () => {
    const wrapperTemp = shallowMount(Datepicker)
    const today = new Date()
    const pastDate = new Date(2018, 3, 20)
    expect(wrapperTemp.vm.pageDate.getFullYear()).toEqual(today.getFullYear())
    expect(wrapperTemp.vm.pageDate.getMonth()).toEqual(today.getMonth())
    expect(wrapperTemp.vm.pageDate.getDate()).toEqual(1)
    wrapperTemp.vm.setDate(pastDate.getTime())
    wrapperTemp.vm.resetDefaultPageDate()
    expect(wrapperTemp.vm.pageDate.getFullYear()).toEqual(pastDate.getFullYear())
    expect(wrapperTemp.vm.pageDate.getMonth()).toEqual(pastDate.getMonth())
    expect(wrapperTemp.vm.pageDate.getDate()).toEqual(1)
  })

  it('sets the date on typedDate event', () => {
    const wrapperTemp = shallowMount(Datepicker)
    const today = new Date()
    wrapperTemp.vm.setTypedDate(today)
    expect(wrapperTemp.vm.selectedDate).toEqual(today)
  })

  it('watches value', async () => {
    const wrapperTemp = shallowMount(Datepicker, {
      propsData: {
        value: '2018-01-01',
      },
    })
    const spy = jest.spyOn(wrapperTemp.vm, 'setValue')
    wrapperTemp.setProps({ value: '2018-04-26' })
    await wrapperTemp.vm.$nextTick()
    expect(spy).toHaveBeenCalled()
  })

  it('watches openDate', async () => {
    const wrapperTemp = shallowMount(Datepicker, {
      propsData: {
        openDate: new Date(2018, 0, 1),
      },
    })
    const spy = jest.spyOn(wrapperTemp.vm, 'setPageDate')
    wrapperTemp.setProps({ openDate: new Date(2018, 3, 26) })
    await wrapperTemp.vm.$nextTick()
    expect(spy).toHaveBeenCalled()
  })

  it('watches initialView', async () => {
    const wrapperTemp = shallowMount(Datepicker, {
      propsData: {
        initialView: 'day',
      },
    })
    const spy = jest.spyOn(wrapperTemp.vm, 'setInitialView')
    wrapperTemp.setProps({ initialView: 'month' })
    await wrapperTemp.vm.$nextTick()
    expect(spy).toHaveBeenCalled()
  })

  it('should emit changedMonth on a month change received from PickerDay', () => {
    const dateTemp = new Date(2016, 9, 1)
    wrapper.vm.handleChangedMonthFromDayPicker({ timestamp: dateTemp.getTime() })
    expect(wrapper.emitted()['changed-month']).toBeTruthy()
  })
})

describe('Datepicker.vue set by string', () => {
  let wrapper
  it('can parse a string date', () => {
    wrapper = shallowMount(Datepicker, {
      propsData: {
        format: 'yyyy MM dd',
        value: '2016-02-20',
      },
    })
    const date = new Date('2016-02-20')
    expect(wrapper.vm.selectedDate.getFullYear()).toEqual(date.getFullYear())
    expect(wrapper.vm.selectedDate.getMonth()).toEqual(date.getMonth())
    expect(wrapper.vm.selectedDate.getDate()).toEqual(date.getDate())
  })

  it('should nullify malformed value', () => {
    wrapper = shallowMount(Datepicker, {
      propsData: {
        value: 'today',
      },
    })
    expect(wrapper.vm.selectedDate).toBeNull()
  })
})

describe('Datepicker.vue set by timestamp', () => {
  let wrapper
  it('can parse unix timestamp', () => {
    wrapper = shallowMount(Datepicker, {
      propsData: {
        format: 'yyyy MM dd',
        value: new Date(Date.UTC(2018, 0, 29)).getTime(),
      },
    })
    expect(wrapper.vm.selectedDate.getUTCFullYear()).toEqual(2018)
    expect(wrapper.vm.selectedDate.getUTCMonth()).toEqual(0)
    expect(wrapper.vm.selectedDate.getUTCDate()).toEqual(29)
  })
})

describe('Datepicker.vue using UTC', () => {
  let wrapper
  it('correctly sets the value using UTC', async () => {
    const timezoneOffset = ((new Date()).getTimezoneOffset() / 60)

    // this is ambiguous because localzone differs by one day than UTC
    const ambiguousHour = 25 - timezoneOffset
    const ambiguousDate = new Date(2018, 3, 15, ambiguousHour)
    const ambiguousYear = ambiguousDate.getUTCFullYear()
    const ambiguousMonth = (`0${ambiguousDate.getUTCMonth() + 1}`).slice(-2)
    const ambiguousDay = (`0${ambiguousDate.getUTCDate()}`).slice(-2)
    const UTCString = `${ambiguousYear} ${ambiguousMonth} ${ambiguousDay}`

    // It's important to use the `mount` helper here
    wrapper = mount(Datepicker, {
      propsData: {
        format: 'yyyy MM dd',
        value: ambiguousDate,
        useUtc: true, // This should fail if `useUtc=false`
      },
    })
    // It's important to assert the input rendered output
    await wrapper.vm.$nextTick()
    return expect(wrapper.find(DateInput).vm.formattedValue).toEqual(UTCString)
  })
})

describe('Datepicker.vue inline', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(Datepicker, {
      propsData: {
        inline: true,
      },
    })
  })

  it('should not showCalendar as already open', () => {
    expect(wrapper.vm.showCalendar()).toEqual(false)
    expect(wrapper.vm.isInline).toEqual(true)
  })

  it('should not close the calendar when date is selected', () => {
    const date = new Date()
    wrapper.vm.selectDate({ timestamp: date.getTime() })
    expect(wrapper.vm.isOpen).toEqual(true)
    document.body.click()
    expect(wrapper.vm.isOpen).toEqual(true)
  })
})

describe('Datepicker with initial-view', () => {
  let wrapper
  it('should open in Day view', () => {
    wrapper = shallowMount(Datepicker)
    wrapper.vm.showCalendar()
    expect(wrapper.vm.computedInitialView).toEqual('day')
    expect(wrapper.vm.currentPicker).toEqual('PickerDay')
  })

  it('should open in Month view', () => {
    wrapper = shallowMount(Datepicker, {
      propsData: {
        initialView: 'month',
      },
    })
    wrapper.vm.showCalendar()
    expect(wrapper.vm.computedInitialView).toEqual('month')
    expect(wrapper.vm.currentPicker).toEqual('PickerMonth')
  })

  it('should open in Year view', () => {
    wrapper = shallowMount(Datepicker, {
      propsData: {
        initialView: 'year',
      },
    })
    wrapper.vm.showCalendar()
    expect(wrapper.vm.computedInitialView).toEqual('year')
    expect(wrapper.vm.currentPicker).toEqual('PickerYear')
  })
})
