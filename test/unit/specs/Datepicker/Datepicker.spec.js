import { mount, shallowMount } from '@vue/test-utils'
import { addDays } from 'date-fns'
import { he } from '~/locale'
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
    expect(defaultData.view).toEqual('')
    expect(defaultData.calendarHeight).toEqual(0)

    expect(typeof defaultProps.fixedPosition.validator).toEqual('function')
    expect(defaultProps.fixedPosition.validator('bottom')).toBeTruthy()
    expect(defaultProps.fixedPosition.validator(true)).toBeFalsy()
  })
})

describe('Datepicker mounted', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Datepicker)
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('emits blur', async () => {
    const input = wrapper.find('input')
    await input.trigger('blur')
    expect(wrapper.emitted('blur')).toBeTruthy()
  })

  it('emits focus', async () => {
    const input = wrapper.find('input')
    await input.trigger('focus')
    expect(wrapper.emitted('focus')).toBeTruthy()
  })

  it('toggles when the input field is clicked', async () => {
    const input = wrapper.find('input')
    await input.trigger('click')

    expect(wrapper.vm.isOpen).toBeTruthy()

    await input.trigger('click')
    expect(wrapper.vm.isOpen).toBeFalsy()
  })

  it('opens on focusing the input when showCalendarOnFocus = true', async () => {
    await wrapper.setProps({
      showCalendarOnFocus: true,
    })
    const input = wrapper.find('input')

    await input.trigger('focus')

    expect(wrapper.vm.isOpen).toBeTruthy()
  })

  it('toggles via the calendar button', async () => {
    await wrapper.setProps({
      calendarButton: true,
    })

    const calendarButton = wrapper.find('button[data-test-calendar-button]')
    await calendarButton.trigger('click')
    expect(wrapper.vm.isOpen).toBeTruthy()

    await calendarButton.trigger('click')
    expect(wrapper.vm.isOpen).toBeFalsy()
  })

  it('toggles via the calendar button when showCalendarOnFocus = true', async () => {
    await wrapper.setProps({
      calendarButton: true,
      showCalendarOnFocus: true,
    })

    const calendarButton = wrapper.find('button[data-test-calendar-button]')

    await calendarButton.trigger('click')
    expect(wrapper.vm.isOpen).toBeTruthy()

    await calendarButton.trigger('click')
    expect(wrapper.vm.isOpen).toBeFalsy()
  })

  it('closes via the calendar button when typeable and showCalendarOnFocus = true, despite input being focused', async () => {
    await wrapper.setProps({
      calendarButton: true,
      showCalendarOnFocus: true,
      typeable: true,
    })

    const input = wrapper.find('input')
    const calendarButton = wrapper.find('button[data-test-calendar-button]')

    await input.trigger('focus')
    expect(wrapper.vm.isOpen).toBeTruthy()

    await calendarButton.trigger('click')
    expect(wrapper.vm.isOpen).toBeFalsy()
  })

  it('selects an edge date', async () => {
    await wrapper.setProps({
      value: new Date(2020, 0, 1),
    })

    const cells = wrapper.findAll('button.cell')
    const lastCell = cells.at(cells.length - 1)

    await lastCell.trigger('click')

    expect(wrapper.vm.selectedDate).toStrictEqual(new Date(2020, 1, 1))
  })
})

describe('Datepicker mounted with slots', () => {
  let wrapper

  beforeEach(() => {
    const beforeCalendarHeader =
      '<div key="0">Example <a href="#">beforeCalendarHeader</a> slot</div>'
    const beforeCalendarHeaderDay =
      '<div key="1">Example <a href="#">beforeCalendarHeaderDay</a> slot</div>'
    const calendarFooterDay =
      '<div key="2">Example <a href="#">calendarFooterDay</a> slot</div>'
    const beforeCalendarHeaderMonth =
      '<div key="3">Example <a href="#">beforeCalendarHeaderMonth</a> slot</div>'
    const calendarFooterMonth =
      '<div key="4">Example <a href="#">calendarFooterMonth</a> slot</div>'
    const beforeCalendarHeaderYear =
      '<div key="5">Example <a href="#">beforeCalendarHeaderYear</a> slot</div>'
    const calendarFooterYear =
      '<div key="6">Example <a href="#">calendarFooterYear</a> slot</div>'
    const calendarFooter =
      '<div key="7">Example <a href="#">calendarFooter</a> slot</div>'

    wrapper = mount(Datepicker, {
      slots: {
        beforeCalendarHeader,
        beforeCalendarHeaderDay,
        calendarFooterDay,
        beforeCalendarHeaderMonth,
        calendarFooterMonth,
        beforeCalendarHeaderYear,
        calendarFooterYear,
        calendarFooter,
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('knows how many navElements there are', async () => {
    expect(wrapper.vm.navElements.length).toEqual(0)

    const input = wrapper.find('input')
    await input.trigger('click')

    expect(wrapper.vm.navElements.length).toEqual(8)
  })
})

describe('Datepicker mounted to body', () => {
  let wrapper

  beforeEach(() => {
    jest.useFakeTimers()

    wrapper = mount(Datepicker, {
      attachTo: document.body,
    })
  })

  afterEach(() => {
    jest.clearAllTimers()

    wrapper.destroy()
  })

  it("focuses today's date by default", async () => {
    const input = wrapper.find('input')
    await input.trigger('click')
    jest.advanceTimersByTime(250)
    const todayCell = wrapper.find('button.today')

    expect(todayCell.text()).toBe(new Date().getDate().toString())
    expect(document.activeElement).toStrictEqual(todayCell.element)
  })

  it('focuses the up button on increasing the view', async () => {
    const input = wrapper.find('input')
    await input.trigger('click')

    jest.advanceTimersByTime(250)
    let upButton = wrapper.find('button.vdp-datepicker__up')

    await upButton.trigger('click')
    jest.advanceTimersByTime(250)
    upButton = wrapper.find('button.vdp-datepicker__up')

    expect(document.activeElement).toBe(upButton.element)
  })

  it('focuses the tabbable-cell on decreasing the view', async () => {
    const input = wrapper.find('input')
    await input.trigger('click')
    jest.advanceTimersByTime(250)

    const upButton = wrapper.find('button.vdp-datepicker__up')

    await upButton.trigger('click')
    jest.advanceTimersByTime(250)
    const firstCell = wrapper.find('button.cell')

    await firstCell.trigger('click')
    await wrapper.vm.$nextTick()
    jest.advanceTimersByTime(250)

    const tabbableCell = wrapper.find('button.cell[data-test-tabbable-cell]')
    expect(document.activeElement).toBe(tabbableCell.element)
  })

  it('closes when the calendar loses focus', async () => {
    const input = wrapper.find('input')

    await input.trigger('click')
    jest.advanceTimersByTime(250)

    const todayCell = wrapper.find('button.today')
    expect(wrapper.vm.isOpen).toBeTruthy()
    expect(document.activeElement).toStrictEqual(todayCell.element)

    await document.activeElement.blur()
    await document.body.click()
    jest.advanceTimersByTime(250)

    expect(wrapper.vm.isOpen).toBeFalsy()
  })

  it('focuses the calendar button when closed via the calendar button', async () => {
    await wrapper.setProps({
      calendarButton: true,
    })

    const calendarButton = wrapper.find('button[data-test-calendar-button]')
    await calendarButton.trigger('click')
    jest.advanceTimersByTime(250)

    expect(wrapper.vm.isOpen).toBeTruthy()

    const openDateCell = wrapper.find('button.open')
    expect(document.activeElement).toStrictEqual(openDateCell.element)

    await calendarButton.trigger('click')
    jest.advanceTimersByTime(250)

    expect(wrapper.vm.isOpen).toBeFalsy()
    expect(document.activeElement).toBe(calendarButton.element)
  })

  it('does not arrow up from the previous button to the input field', async () => {
    const input = wrapper.find('input')

    await input.trigger('click')

    jest.advanceTimersByTime(250)

    const prevButton = wrapper.find('button.prev')
    await prevButton.trigger('focus')
    await prevButton.trigger('keydown.up')

    expect(document.activeElement).not.toBe(input.element)
  })

  it('does not focus the input on selecting a date when show-calendar-on-focus = true', async () => {
    await wrapper.setProps({
      showCalendarOnFocus: true,
    })

    const input = wrapper.find('input')

    await input.trigger('click')

    const openDate = wrapper.find('button.open')
    await openDate.trigger('click')

    expect(document.activeElement).toBe(document.body)
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
    expect(wrapper.vm.selectedDate.valueOf()).toEqual(date.valueOf())
  })

  it('clears the date', () => {
    wrapper.vm.clearDate()
    expect(wrapper.vm.selectedDate).toEqual(null)
  })

  it('sets pageTimestamp to be now', () => {
    const data = Datepicker.data()
    const d = new Date(data.pageTimestamp)
    expect(d.getFullYear()).toEqual(new Date().getFullYear())
    expect(d.getMonth()).toEqual(new Date().getMonth())
    expect(d.getDate()).toEqual(1)
  })

  it('toggles the calendar', async () => {
    expect(wrapper.vm.isOpen).toEqual(false)

    wrapper.vm.setView('month')
    expect(wrapper.vm.isOpen).toEqual(true)

    await wrapper.vm.close()
    expect(wrapper.vm.isOpen).toEqual(false)

    wrapper.vm.setView('year')
    expect(wrapper.vm.isOpen).toEqual(true)

    await wrapper.vm.close()
    expect(wrapper.vm.isOpen).toEqual(false)

    wrapper.vm.setView('day')
    expect(wrapper.vm.isOpen).toEqual(true)

    await wrapper.vm.close()
    expect(wrapper.vm.isOpen).toEqual(false)

    wrapper.vm.setView('invalid date')
    expect(wrapper.vm.isOpen).toEqual(false)
  })

  it('can select a day', () => {
    const dateTemp = new Date(2016, 9, 1)
    wrapper.vm.setView('day')
    wrapper.vm.handleSelect({ timestamp: dateTemp.valueOf() })
    expect(wrapper.vm.pageTimestamp).toEqual(dateTemp.valueOf())
    expect(wrapper.vm.selectedDate.getMonth()).toEqual(9)
    expect(wrapper.emitted('selected')).toBeTruthy()
  })

  it('can select a month', () => {
    const dateTemp = new Date(2016, 9, 9)
    wrapper.vm.setView('month')
    wrapper.vm.handleSelect({ timestamp: dateTemp.valueOf() })
    expect(wrapper.emitted('changed-month')).toBeTruthy()
    expect(wrapper.emitted('changed-month')[0][0].timestamp).toEqual(
      dateTemp.valueOf(),
    )
    expect(new Date(wrapper.vm.pageTimestamp).getMonth()).toEqual(
      dateTemp.getMonth(),
    )
    expect(wrapper.vm.picker).toEqual('PickerDay')
  })

  it('can select a year', () => {
    const dateTemp = new Date(2018, 9, 9)
    wrapper.vm.setView('year')
    wrapper.vm.handleSelect({ timestamp: dateTemp.valueOf() })
    expect(wrapper.emitted('changed-year')).toBeTruthy()
    expect(wrapper.emitted('changed-year')[0][0].timestamp).toEqual(
      dateTemp.valueOf(),
    )
    expect(new Date(wrapper.vm.pageTimestamp).getFullYear()).toEqual(
      dateTemp.getFullYear(),
    )
    expect(wrapper.vm.picker).toEqual('PickerMonth')
  })

  it('watches value', async () => {
    const spy = jest.spyOn(wrapper.vm, 'setValue')
    await wrapper.setProps({ value: '2018-04-26' })

    expect(spy).toHaveBeenCalled()
  })

  it('watches openDate', async () => {
    await wrapper.setProps({
      openDate: new Date(2018, 0, 1),
    })
    const spy = jest.spyOn(wrapper.vm, 'setPageDate')
    await wrapper.setProps({ openDate: new Date(2018, 3, 26) })

    expect(spy).toHaveBeenCalled()
  })

  it('watches initialView when open', async () => {
    const spy = jest.spyOn(wrapper.vm, 'setInitialView')
    await wrapper.vm.open()

    await wrapper.setProps({ initialView: 'month' })

    expect(spy).toHaveBeenCalled()
  })

  it('derives `picker` from the current `view`', async () => {
    await wrapper.setProps({
      initialView: 'day',
    })

    expect(wrapper.vm.picker).toBe('PickerDay')
    await wrapper.setProps({ initialView: 'month' })

    expect(wrapper.vm.picker).toBe('PickerMonth')
  })

  it('sets picker classes correctly', async () => {
    await wrapper.setProps({
      calendarClass: 'my-calendar-class',
      inline: true,
    })

    const datepicker = wrapper.find('.vdp-datepicker__calendar')

    expect(datepicker.element.className).toContain('vdp-datepicker__calendar')
    expect(datepicker.element.className).toContain('my-calendar-class')
    expect(datepicker.element.className).toContain('inline')
    expect(datepicker.element.className).not.toContain('rtl')

    await wrapper.setProps({
      appendToBody: true,
      language: he,
    })

    expect(datepicker.element.className).toContain('rtl')
  })

  it('knows the next view up / down', async () => {
    wrapper.vm.setView('day')

    expect(wrapper.vm.nextView.down).toBeUndefined()
    expect(wrapper.vm.nextView.up).toBe('month')

    wrapper.vm.setView('month')

    expect(wrapper.vm.nextView.down).toBe('day')
    expect(wrapper.vm.nextView.up).toBe('year')

    wrapper.vm.setView('year')

    expect(wrapper.vm.nextView.down).toBe('month')
    expect(wrapper.vm.nextView.up).toBe('decade')
  })

  it('emits changed-month/year/decade', async () => {
    const pageDate = new Date(2016, 2, 1)
    await wrapper.vm.setView('day')
    await wrapper.vm.handlePageChange({ pageDate })

    expect(wrapper.emitted('changed-month')).toBeTruthy()

    await wrapper.vm.setView('month')
    await wrapper.vm.handlePageChange({ pageDate })
    expect(wrapper.emitted('changed-year')).toBeTruthy()

    await wrapper.vm.setView('year')
    await wrapper.vm.handlePageChange({ pageDate })
    expect(wrapper.emitted('changed-decade')).toBeTruthy()
  })

  it('clears date on default date disabled', async () => {
    const someDate = new Date('2021-01-15')
    const wrapperTemp = shallowMount(Datepicker, {
      propsData: {
        value: someDate,
        disabledDates: {
          customPredictor(customPredictorDate) {
            if (customPredictorDate < addDays(someDate, 4)) {
              return true
            }
            return false
          },
        },
      },
    })

    expect(wrapperTemp.vm.selectedDate).toEqual(null)
    expect(wrapperTemp.emitted('input')).toBeTruthy()
  })

  it('sets the transition correctly', async () => {
    wrapper.vm.setTransitionName(1)
    expect(wrapper.vm.transitionName).toBe('slide-right')

    wrapper.vm.setTransitionName(-1)
    expect(wrapper.vm.transitionName).toBe('slide-left')

    await wrapper.setData({
      translation: { rtl: true },
    })

    wrapper.vm.setTransitionName(1)
    expect(wrapper.vm.transitionName).toBe('slide-left')

    wrapper.vm.setTransitionName(-1)
    expect(wrapper.vm.transitionName).toBe('slide-right')
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

  it('nullifies malformed value', () => {
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
        value: new Date(Date.UTC(2018, 0, 29)).valueOf(),
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
    const timezoneOffset = new Date().getTimezoneOffset() / 60

    // This is ambiguous because localzone differs from UTC by one day
    const ambiguousHour = 25 - timezoneOffset
    const ambiguousDate = new Date(2018, 3, 15, ambiguousHour)
    const ambiguousYear = ambiguousDate.getUTCFullYear()
    const ambiguousMonth = `0${ambiguousDate.getUTCMonth() + 1}`.slice(-2)
    const ambiguousDay = `0${ambiguousDate.getUTCDate()}`.slice(-2)
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
    expect(wrapper.findComponent(DateInput).vm.formattedValue).toEqual(
      UTCString,
    )
  })
})

describe('Datepicker.vue inline', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Datepicker, {
      propsData: {
        inline: true,
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('shows calendar as already open', () => {
    expect(wrapper.vm.isOpen).toEqual(true)
    expect(wrapper.vm.isInline).toEqual(true)
  })

  it('does not close the calendar when date is selected', () => {
    const date = new Date()
    wrapper.vm.handleSelect({ timestamp: date.valueOf() })
    expect(wrapper.vm.isOpen).toEqual(true)
    document.body.click()
    expect(wrapper.vm.isOpen).toEqual(true)
  })
})

describe('Datepicker.vue inline mounted to body', () => {
  let wrapper
  beforeEach(() => {
    jest.useFakeTimers()

    wrapper = mount(Datepicker, {
      attachTo: document.body,
      propsData: {
        inline: true,
      },
    })
  })

  afterEach(() => {
    jest.clearAllTimers()

    wrapper.destroy()
  })

  it('focuses the date when selected', async () => {
    const openDate = wrapper.find('button.open')
    await openDate.element.focus()
    await openDate.trigger('click')

    expect(document.activeElement).toBe(openDate.element)

    const anotherDate = wrapper.findAll('button.cell').at(10)
    await anotherDate.element.focus()
    await anotherDate.trigger('click')

    expect(document.activeElement).toBe(anotherDate.element)
  })
})

describe('Datepicker with initial-view', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Datepicker)
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('opens in `day` view', async () => {
    await wrapper.vm.open()

    expect(wrapper.vm.computedInitialView).toEqual('day')
    expect(wrapper.vm.picker).toEqual('PickerDay')
  })

  it('opens in `month` view', async () => {
    await wrapper.setProps({
      initialView: 'month',
    })
    await wrapper.vm.open()
    expect(wrapper.vm.computedInitialView).toEqual('month')
    expect(wrapper.vm.picker).toEqual('PickerMonth')
  })

  it('opens in `year` view', async () => {
    await wrapper.setProps({
      initialView: 'year',
    })
    await wrapper.vm.open()
    expect(wrapper.vm.computedInitialView).toEqual('year')
    expect(wrapper.vm.picker).toEqual('PickerYear')
  })

  it('does not open if the calendar is disabled', async () => {
    await wrapper.setProps({
      disabled: true,
    })
    await wrapper.vm.open()
    expect(wrapper.vm.isOpen).toBeFalsy()
  })
})

describe('Datepicker on body', () => {
  let wrapper

  it('appends popup to body', async () => {
    wrapper = mount(Datepicker, {
      propsData: {
        appendToBody: true,
      },
    })

    await wrapper.vm.open()

    expect(wrapper.vm.$el.querySelector('.vdp-datepicker__calendar')).toBeNull()
    expect(document.querySelector('.vdp-datepicker__calendar')).toBeDefined()

    await wrapper.vm.close()
    wrapper.destroy()
  })

  it('removes popup on body on component removal', async () => {
    wrapper = mount(Datepicker, {
      propsData: {
        appendToBody: true,
      },
    })

    await wrapper.vm.open()
    await wrapper.vm.close()

    wrapper.destroy()
    expect(document.querySelector('.vdp-datepicker__calendar')).toBeNull()
  })
})
