import { mount, shallowMount } from '@vue/test-utils'
import { addDays } from 'date-fns'
import { vi } from 'vitest'
import { he } from '~/locale'
import DateInput from '~/components/DateInput.vue'
import DatePicker from '~/components/DatePicker.vue'

describe('Datepicker unmounted', () => {
  it('has a mounted hook', () => {
    expect(typeof DatePicker.mounted).toEqual('function')
  })

  it('sets the correct default data', () => {
    expect(typeof DatePicker.data).toEqual('function')
    const defaultData = DatePicker.data()
    const defaultProps = DatePicker.props
    expect(defaultData.selectedDate).toEqual(null)
    expect(defaultData.view).toEqual('')
    expect(defaultData.calendarHeight).toEqual(0)

    expect(typeof defaultProps.fixedPosition.validator).toEqual('function')
    expect(defaultProps.fixedPosition.validator('bottom')).toBeTruthy()
    expect(defaultProps.fixedPosition.validator(true)).toBeFalsy()
  })
})

describe('Datepicker shallowMounted', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(DatePicker)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('sets the date from method', () => {
    const date = new Date(2016, 9, 15)

    wrapper.vm.setValue(date)
    expect(wrapper.vm.selectedDate).toEqual(date)

    wrapper.vm.setValue()
    expect(wrapper.vm.selectedDate).toEqual(null)
  })

  it('sets the date from a date value', async () => {
    const date = new Date(2016, 1, 15)

    await wrapper.setProps({
      modelValue: date,
    })

    expect(wrapper.vm.selectedDate).toEqual(date)
  })

  it('sets the date from a string value', async () => {
    const date = new Date('2016-02-20')

    await wrapper.setProps({
      useUtc: true,
      modelValue: '2016-02-20',
    })

    expect(wrapper.vm.selectedDate).toEqual(date)
  })

  it('nullifies a malformed string value', async () => {
    await wrapper.setProps({
      modelValue: 'today',
    })

    expect(wrapper.vm.selectedDate).toBeNull()
  })

  it('sets the date from a unix timestamp', async () => {
    const date = new Date(2018, 0, 29)

    await wrapper.setProps({
      modelValue: date.valueOf(),
    })

    expect(wrapper.vm.selectedDate).toEqual(date)
  })

  it('clears the date', async () => {
    await wrapper.setProps({
      modelValue: new Date(2016, 1, 15),
    })

    wrapper.vm.clearDate()
    expect(wrapper.vm.selectedDate).toEqual(null)
    expect(wrapper.emitted('cleared')).toHaveLength(1)

    wrapper.vm.clearDate()
    expect(wrapper.emitted('cleared')).toHaveLength(1)
  })

  it('sets pageTimestamp to be midnight on first day of current month', () => {
    const { pageTimestamp } = wrapper.vm
    const firstDayOfMonth = new Date(new Date().setDate(1))
    const firstDayOfMonthAtMidnight = firstDayOfMonth.setHours(0, 0, 0, 0)

    expect(pageTimestamp).toEqual(firstDayOfMonthAtMidnight)
  })

  it('toggles the calendar', async () => {
    expect(wrapper.vm.isOpen).toEqual(false)

    wrapper.vm.setView('day')
    expect(wrapper.vm.isOpen).toEqual(true)

    await wrapper.vm.close()
    expect(wrapper.vm.isOpen).toEqual(false)

    wrapper.vm.setView('month')
    expect(wrapper.vm.isOpen).toEqual(true)

    await wrapper.vm.close()
    expect(wrapper.vm.isOpen).toEqual(false)

    wrapper.vm.setView('year')
    expect(wrapper.vm.isOpen).toEqual(true)

    await wrapper.vm.close()
    expect(wrapper.vm.isOpen).toEqual(false)

    wrapper.vm.setView('invalid view')
    expect(wrapper.vm.isOpen).toEqual(false)
  })

  it('watches modelValue', async () => {
    const spy = vi.spyOn(wrapper.vm, 'setValue')

    await wrapper.setProps({
      modelValue: new Date(2018, 3, 26),
    })

    expect(spy).toHaveBeenCalled()
  })

  it('watches openDate', async () => {
    const spy = vi.spyOn(wrapper.vm, 'setPageDate')

    await wrapper.setProps({
      openDate: new Date(2018, 3, 26),
    })

    expect(spy).toHaveBeenCalled()
  })

  it('clears the date when it is disabled', async () => {
    const someDate = new Date(2021, 0, 15)

    await wrapper.setProps({
      modelValue: someDate,
      disabledDates: {
        to: addDays(someDate, 1),
      },
    })

    expect(wrapper.vm.selectedDate).toBeNull()
  })

  it('clears the date when it becomes disabled', async () => {
    const someDate = new Date(2021, 0, 15)

    await wrapper.setProps({
      modelValue: someDate,
    })

    expect(wrapper.vm.selectedDate).toBe(someDate)

    await wrapper.setProps({
      disabledDates: {
        to: addDays(someDate, 1),
      },
    })
  })
})

describe('Datepicker mounted', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(DatePicker)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('can select a day', () => {
    const date = new Date(2016, 9, 1)

    wrapper.vm.setView('day')
    wrapper.vm.handleSelect({ timestamp: date.valueOf() })

    expect(wrapper.vm.selectedDate).toEqual(date)
    expect(wrapper.emitted('selected')).toBeTruthy()
  })

  it('can select a month', () => {
    const date = new Date(2016, 9, 9)

    wrapper.vm.setView('month')
    wrapper.vm.handleSelect({ timestamp: date.valueOf() })

    expect(wrapper.emitted('changedMonth')[0][0].timestamp).toEqual(
      date.valueOf(),
    )
    expect(wrapper.vm.pageDate.getMonth()).toEqual(date.getMonth())
  })

  it('can select a year', () => {
    const date = new Date(2018, 9, 9)

    wrapper.vm.setView('year')
    wrapper.vm.handleSelect({ timestamp: date.valueOf() })

    expect(wrapper.emitted('changedYear')[0][0].timestamp).toEqual(
      date.valueOf(),
    )
    expect(wrapper.vm.pageDate.getFullYear()).toEqual(date.getFullYear())
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

  it('emits focus', async () => {
    const input = wrapper.find('input')
    await input.trigger('focusin')

    expect(wrapper.emitted('focus')).toBeTruthy()
  })

  it('emits blur', async () => {
    const input = wrapper.find('input')
    await input.trigger('focusin')
    await input.trigger('focusout')

    expect(wrapper.emitted('blur')).toBeTruthy()
  })

  it('emits changed', async () => {
    await wrapper.vm.open()

    const dayCell = wrapper.findAll('button')[10]

    await dayCell.trigger('click')
    expect(wrapper.emitted('changed')).toHaveLength(1)

    await wrapper.vm.open()
    await dayCell.trigger('click')
    expect(wrapper.emitted('changed')).toHaveLength(1)

    await wrapper.vm.open()

    const differentDayCell = wrapper.findAll('button')[11]
    await differentDayCell.trigger('click')
    expect(wrapper.emitted('changed')).toHaveLength(2)
  })

  it('toggles when the input field is clicked', async () => {
    const input = wrapper.find('input')

    await input.trigger('click')
    expect(wrapper.vm.isOpen).toBeTruthy()

    await input.trigger('click')
    expect(wrapper.vm.isOpen).toBeFalsy()
  })

  it('selects an edge date', async () => {
    await wrapper.setProps({
      modelValue: new Date(2020, 0, 1),
    })

    const cells = wrapper.findAll('button.cell')
    const lastCell = cells[cells.length - 1]

    await lastCell.trigger('click')

    expect(wrapper.vm.selectedDate).toStrictEqual(new Date(2020, 1, 1))
  })

  it('derives `picker` from the current `view`', () => {
    wrapper.vm.setView('day')
    expect(wrapper.vm.picker).toBe('PickerDay')

    wrapper.vm.setView('month')
    expect(wrapper.vm.picker).toBe('PickerMonth')

    wrapper.vm.setView('year')
    expect(wrapper.vm.picker).toBe('PickerYear')
  })

  it('watches initialView when open', async () => {
    const spy = vi.spyOn(wrapper.vm, 'setInitialView')

    await wrapper.vm.open()
    await wrapper.setProps({
      initialView: 'month',
    })

    expect(spy).toHaveBeenCalled()
  })

  it('sets picker classes correctly', async () => {
    await wrapper.setProps({
      calendarClass: 'my-calendar-class',
      inline: true,
    })

    let datepicker = wrapper.find('.vdp-datepicker__calendar')

    expect(datepicker.element.className).toContain('vdp-datepicker__calendar')
    expect(datepicker.element.className).toContain('my-calendar-class')
    expect(datepicker.element.className).toContain('inline')
    expect(datepicker.element.className).not.toContain('rtl')

    await wrapper.setProps({
      appendToBody: true,
      language: he,
    })

    datepicker = wrapper.find('.vdp-datepicker__calendar')
    expect(datepicker.element.className).toContain('rtl')
  })

  it('sets the transition correctly', async () => {
    wrapper.vm.setTransitionName(1)
    expect(wrapper.vm.transitionName).toBe('slide-right')

    wrapper.vm.setTransitionName(-1)
    expect(wrapper.vm.transitionName).toBe('slide-left')

    await wrapper.setProps({
      language: he,
    })

    wrapper.vm.setTransitionName(1)
    expect(wrapper.vm.transitionName).toBe('slide-left')

    wrapper.vm.setTransitionName(-1)
    expect(wrapper.vm.transitionName).toBe('slide-right')
  })

  it('knows the next view up / down', () => {
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

  it('emits changedMonth/Year/Decade', () => {
    const pageDate = new Date(2016, 2, 1)

    wrapper.vm.setView('day')
    wrapper.vm.handlePageChange({ pageDate })

    expect(wrapper.emitted('changedMonth')).toBeTruthy()

    wrapper.vm.setView('month')
    wrapper.vm.handlePageChange({ pageDate })
    expect(wrapper.emitted('changedYear')).toBeTruthy()

    wrapper.vm.setView('year')
    wrapper.vm.handlePageChange({ pageDate })
    expect(wrapper.emitted('changedDecade')).toBeTruthy()
  })
})

describe('Datepicker mounted with showCalendarOnFocus', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(DatePicker, {
      props: {
        showCalendarOnFocus: true,
      },
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('opens on focusing the input', async () => {
    const input = wrapper.find('input')

    await input.trigger('focus')

    expect(wrapper.vm.isOpen).toBeTruthy()
  })

  it('toggles on clicking the input', async () => {
    const input = wrapper.find('input')

    await input.trigger('click')
    expect(wrapper.vm.isOpen).toBeTruthy()

    await input.trigger('click')
    expect(wrapper.vm.isOpen).toBeFalsy()
  })

  it('does not focus the input on selecting a date', async () => {
    const input = wrapper.find('input')

    await input.trigger('click')

    const openDate = wrapper.find('button.open')
    await openDate.trigger('click')

    expect(document.activeElement).toBe(document.body)
  })
})

describe('Datepicker mounted with calendar button', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(DatePicker, {
      props: {
        calendarButton: true,
      },
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('toggles via the calendar button', async () => {
    const calendarButton = wrapper.find('button[data-test-calendar-button]')

    await calendarButton.trigger('click')
    expect(wrapper.vm.isOpen).toBeTruthy()

    await calendarButton.trigger('click')
    expect(wrapper.vm.isOpen).toBeFalsy()
  })

  it('toggles via the calendar button when showCalendarOnFocus = true', async () => {
    await wrapper.setProps({
      showCalendarOnFocus: true,
    })

    const calendarButton = wrapper.find('button[data-test-calendar-button]')

    await calendarButton.trigger('click')
    expect(wrapper.vm.isOpen).toBeTruthy()

    await calendarButton.trigger('click')
    expect(wrapper.vm.isOpen).toBeFalsy()
  })
})

describe('Datepicker mounted with slots', () => {
  let wrapper

  beforeEach(() => {
    const beforeCalendarHeader =
      'One tabbable element in the <a href="#" tabindex="0">beforeCalendarHeader</a> slot'
    const beforeCalendarHeaderDay =
      'One tabbable element in the <a href="#" tabindex="0">beforeCalendarHeaderDay</a> slot'
    const calendarFooterDay =
      'One tabbable element in the <a href="#" tabindex="0">calendarFooterDay</a> slot'
    const beforeCalendarHeaderMonth =
      '<div>Two <a href="#" tabindex="0">tabbable elements</a> in the <a href="#" tabindex="0">beforeCalendarHeaderMonth</a> slot</div>'
    const calendarFooterMonth =
      '<p>Two <button>tabbable elements</button></p> <p>in the <input placeholder="calendarFooterMonth"> slot</p>'
    const beforeCalendarHeaderYear =
      'One tabbable element in the <select><option>beforeCalendarHeaderYear</option></select> slot'
    const calendarFooterYear =
      'One tabbable element in the <textarea>calendarFooterYear</textarea> slot'
    const calendarFooter =
      'One tabbable element in the <div tabindex="0">calendarFooter</div> slot'

    wrapper = mount(DatePicker, {
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
    wrapper.unmount()
  })

  it('knows how many navElements there are', async () => {
    expect(wrapper.vm.navElements.length).toEqual(0)

    await wrapper.vm.open()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.navElements.length).toEqual(8)

    let upButton = wrapper.find('button.vdp-datepicker__up')
    await upButton.trigger('click')

    expect(wrapper.vm.navElements.length).toEqual(10)

    upButton = wrapper.find('button.vdp-datepicker__up')
    await upButton.trigger('click')

    expect(wrapper.vm.navElements.length).toEqual(7)
  })
})

describe('Datepicker mounted and attached to body', () => {
  let wrapper

  beforeEach(() => {
    vi.useFakeTimers()

    wrapper = mount(DatePicker, {
      attachTo: document.body,
    })
  })

  afterEach(() => {
    vi.clearAllTimers()

    wrapper.unmount()
  })

  it("focuses today's date when append-to-body is true", async () => {
    await wrapper.setProps({
      appendToBody: true,
    })

    const input = wrapper.find('input')
    await input.trigger('focusin')
    await input.trigger('click')
    vi.advanceTimersByTime(250)
    const todayCell = wrapper.find('button.today')

    expect(todayCell.text()).toBe(new Date().getDate().toString())
    expect(document.activeElement).toStrictEqual(todayCell.element)
  })

  it('does not arrow up from the previous button to the input field', async () => {
    const input = wrapper.find('input')

    await input.trigger('click')

    vi.advanceTimersByTime(250)

    const prevButton = wrapper.find('button.prev')
    await prevButton.trigger('focus')
    await prevButton.trigger('keydown.up')

    expect(document.activeElement).not.toBe(input.element)
  })

  it('tabs away from a closed calendar', async () => {
    const input = wrapper.find('input')

    await input.trigger('keydown.tab')

    expect(document.activeElement).toBe(document.body)
  })
})

describe('Datepicker mounted and attached to body with openDate', () => {
  let wrapper

  beforeEach(() => {
    vi.useFakeTimers()

    wrapper = mount(DatePicker, {
      attachTo: document.body,
      props: {
        openDate: new Date(2020, 0, 1),
      },
    })
  })

  afterEach(() => {
    vi.clearAllTimers()
    wrapper.unmount()
  })

  it('opens the calendar on pressing the `down` arrow when the input is focused', async () => {
    const input = wrapper.find('input')

    await input.trigger('focus')
    await input.trigger('keydown.down')
    vi.advanceTimersByTime(250)

    const openDateCell = wrapper.find('button.open')
    expect(document.activeElement).toBe(openDateCell.element)
  })

  it('arrows right on cell', async () => {
    await wrapper.vm.open()
    vi.advanceTimersByTime(250)

    const firstOfMonth = wrapper.findAll('button.cell')[3]
    const secondOfMonth = wrapper.findAll('button.cell')[4]

    firstOfMonth.element.focus()
    await firstOfMonth.trigger('keydown.right')

    expect(document.activeElement).toBe(secondOfMonth.element)
  })

  it('arrows left on cell', async () => {
    await wrapper.vm.open()
    vi.advanceTimersByTime(250)

    const secondOfMonth = wrapper.findAll('button.cell')[4]
    const firstOfMonth = wrapper.findAll('button.cell')[3]

    secondOfMonth.element.focus()
    await firstOfMonth.trigger('keydown.left')

    expect(document.activeElement).toBe(firstOfMonth.element)
  })

  it('arrows up on cell', async () => {
    await wrapper.vm.open()
    vi.advanceTimersByTime(250)

    const lastOfMonth = wrapper.findAll('button.cell')[33]
    lastOfMonth.element.focus()
    await lastOfMonth.trigger('keydown.up')

    const cellUp = wrapper.findAll('button.cell')[26]
    expect(document.activeElement).toBe(cellUp.element)
  })

  it('arrows down on cell', async () => {
    await wrapper.vm.open()
    vi.advanceTimersByTime(250)

    const firstOfMonth = wrapper.findAll('button.cell')[3]
    firstOfMonth.element.focus()
    await firstOfMonth.trigger('keydown.down')

    const cellDown = wrapper.findAll('button.cell')[10]
    expect(document.activeElement).toBe(cellDown.element)
  })

  it('cannot arrow to a disabled page', async () => {
    await wrapper.setProps({
      disabledDates: {
        to: new Date(2020, 0, 1),
        from: new Date(2020, 0, 31),
      },
    })

    await wrapper.vm.open()
    vi.advanceTimersByTime(250)

    const firstOfMonth = wrapper.findAll('button.cell')[3]
    firstOfMonth.element.focus()
    await firstOfMonth.trigger('keydown.up')
    expect(document.activeElement).toBe(firstOfMonth.element)

    const lastOfMonth = wrapper.findAll('button.cell')[33]
    lastOfMonth.element.focus()
    await lastOfMonth.trigger('keydown.down')
    expect(document.activeElement).toBe(lastOfMonth.element)
  })

  it('arrows left on cell to previous page', async () => {
    await wrapper.vm.open()
    vi.advanceTimersByTime(250)

    const firstOfMonth = wrapper.findAll('button.cell')[3]

    firstOfMonth.element.focus()
    await firstOfMonth.trigger('keydown.left')
    vi.advanceTimersByTime(250)

    const lastOfPreviousMonth = wrapper.findAll('button.cell')[30]
    expect(document.activeElement).toBe(lastOfPreviousMonth.element)
  })

  it('arrows right on cell to next page', async () => {
    await wrapper.vm.open()
    vi.advanceTimersByTime(250)

    const lastOfMonth = wrapper.findAll('button.cell')[33]

    lastOfMonth.element.focus()
    await lastOfMonth.trigger('keydown.right')
    vi.advanceTimersByTime(250)

    const firstOfNextMonth = wrapper.findAll('button.cell')[6]
    expect(document.activeElement).toBe(firstOfNextMonth.element)
  })

  it('arrows up on cell to previous page', async () => {
    await wrapper.vm.open()
    vi.advanceTimersByTime(250)

    const firstOfMonth = wrapper.findAll('button.cell')[3]

    firstOfMonth.element.focus()
    await firstOfMonth.trigger('keydown.up')

    const cellUp = wrapper.findAll('button.cell')[24]

    vi.advanceTimersByTime(250)

    expect(document.activeElement).toBe(cellUp.element)
  })

  it('arrows down on cell to next page', async () => {
    await wrapper.vm.open()
    vi.advanceTimersByTime(250)

    const lastOfMonth = wrapper.findAll('button.cell')[33]

    lastOfMonth.element.focus()
    await lastOfMonth.trigger('keydown.down')

    const cellDown = wrapper.findAll('button.cell')[12]
    vi.advanceTimersByTime(250)
    expect(document.activeElement).toBe(cellDown.element)
  })

  it('arrows up on cell to muted cell on previous page', async () => {
    await wrapper.vm.open()
    vi.advanceTimersByTime(250)

    const cellBelowMuted = wrapper.findAll('button.cell')[9]

    cellBelowMuted.element.focus()
    await cellBelowMuted.trigger('keydown.up')

    vi.advanceTimersByTime(250)
    const cellUp = wrapper.findAll('button.cell')[30]
    expect(document.activeElement).toBe(cellUp.element)
  })

  it('arrows down on cell to muted cell on next page', async () => {
    await wrapper.vm.open()
    vi.advanceTimersByTime(250)

    const cellAboveMuted = wrapper.findAll('button.cell')[27]

    cellAboveMuted.element.focus()
    await cellAboveMuted.trigger('keydown.down')

    vi.advanceTimersByTime(250)
    const cellDown = wrapper.findAll('button.cell')[6]
    expect(document.activeElement).toBe(cellDown.element)
  })

  it('arrows up on cell, bypassing a muted cell on the previous page', async () => {
    await wrapper.vm.open()
    vi.advanceTimersByTime(250)

    const firstOfMonth = wrapper.findAll('button.cell')[3]

    firstOfMonth.element.focus()
    await firstOfMonth.trigger('keydown.up')

    const cellUp = wrapper.findAll('button.cell')[24]
    vi.advanceTimersByTime(250)
    expect(document.activeElement).toBe(cellUp.element)
  })

  it('arrows down on cell, bypassing a muted cell on the next page', async () => {
    await wrapper.vm.open()
    vi.advanceTimersByTime(250)

    const lastOfMonth = wrapper.findAll('button.cell')[33]

    lastOfMonth.element.focus()
    await lastOfMonth.trigger('keydown.down')

    const cellDown = wrapper.findAll('button.cell')[12]
    vi.advanceTimersByTime(250)
    expect(document.activeElement).toBe(cellDown.element)
  })

  it('arrows up on cell, bypassing a disabled cell on the previous page', async () => {
    await wrapper.setProps({
      disabledDates: {
        dates: [new Date(2019, 11, 25)],
      },
    })

    await wrapper.vm.open()
    vi.advanceTimersByTime(250)

    const firstOfMonth = wrapper.findAll('button.cell')[3]

    firstOfMonth.element.focus()
    await firstOfMonth.trigger('keydown.up')

    const cellUp = wrapper.findAll('button.cell')[17]
    vi.advanceTimersByTime(250)
    expect(document.activeElement).toBe(cellUp.element)
  })

  it('arrows down on cell, bypassing a disabled cell on the next page', async () => {
    await wrapper.setProps({
      disabledDates: {
        dates: [new Date(2020, 1, 5)],
      },
    })

    await wrapper.vm.open()
    vi.advanceTimersByTime(250)

    const lastOfMonth = wrapper.findAll('button.cell')[33]

    lastOfMonth.element.focus()
    await lastOfMonth.trigger('keydown.down')

    const cellDown = wrapper.findAll('button.cell')[12]
    vi.advanceTimersByTime(250)
    expect(document.activeElement).toBe(cellDown.element)
  })

  it('arrows left on cell, bypassing a disabled cell on the previous page', async () => {
    await wrapper.setProps({
      disabledDates: {
        dates: [new Date(2019, 11, 31)],
      },
    })

    await wrapper.vm.open()
    vi.advanceTimersByTime(250)

    const firstOfMonth = wrapper.findAll('button.cell')[3]

    firstOfMonth.element.focus()
    await firstOfMonth.trigger('keydown.left')

    const cellLeft = wrapper.findAll('button.cell')[29]
    vi.advanceTimersByTime(250)
    expect(document.activeElement).toBe(cellLeft.element)
  })

  it('arrows right on cell, bypassing a disabled cell on the next page', async () => {
    await wrapper.setProps({
      disabledDates: {
        dates: [new Date(2020, 1, 1)],
      },
    })

    await wrapper.vm.open()
    vi.advanceTimersByTime(250)

    const lastOfMonth = wrapper.findAll('button.cell')[33]

    lastOfMonth.element.focus()
    await lastOfMonth.trigger('keydown.right')

    const cellRight = wrapper.findAll('button.cell')[7]
    vi.advanceTimersByTime(250)
    expect(document.activeElement).toBe(cellRight.element)
  })

  it('arrows left on first cell (with no dates from previous month) to the previous page', async () => {
    await wrapper.setProps({
      modelValue: new Date(2020, 2, 1),
    })

    await wrapper.vm.open()
    vi.advanceTimersByTime(250)

    const firstOfMonth = wrapper.findAll('button.cell')[0]

    firstOfMonth.element.focus()
    await firstOfMonth.trigger('keydown.left')

    const cellLeft = wrapper.findAll('button.cell')[34]
    vi.advanceTimersByTime(250)
    expect(document.activeElement).toBe(cellLeft.element)
  })

  it('arrows right on last cell (with no dates from next month) to the next page', async () => {
    await wrapper.setProps({
      modelValue: new Date(2020, 1, 29),
    })

    await wrapper.vm.open()
    vi.advanceTimersByTime(250)

    const lastOfMonth = wrapper.findAll('button.cell')[34]

    lastOfMonth.element.focus()
    await lastOfMonth.trigger('keydown.right')

    const cellRight = wrapper.findAll('button.cell')[0]
    vi.advanceTimersByTime(250)
    expect(document.activeElement).toBe(cellRight.element)
  })

  it('arrows up on first cell (with no dates from previous month) to the previous page', async () => {
    await wrapper.setProps({
      modelValue: new Date(2020, 2, 1),
    })

    await wrapper.vm.open()
    vi.advanceTimersByTime(250)

    const firstOfMonth = wrapper.findAll('button.cell')[0]

    firstOfMonth.element.focus()
    await firstOfMonth.trigger('keydown.up')

    const cellUp = wrapper.findAll('button.cell')[28]
    vi.advanceTimersByTime(250)
    expect(document.activeElement).toBe(cellUp.element)
  })

  it('arrows down on last cell (with no dates from next month) to the next page', async () => {
    await wrapper.setProps({
      modelValue: new Date(2020, 1, 29),
    })

    await wrapper.vm.open()
    vi.advanceTimersByTime(250)

    const lastOfMonth = wrapper.findAll('button.cell')[34]

    lastOfMonth.element.focus()
    await lastOfMonth.trigger('keydown.down')

    const cellDown = wrapper.findAll('button.cell')[6]
    vi.advanceTimersByTime(250)
    expect(document.activeElement).toBe(cellDown.element)
  })

  it('arrows up on cell, bypassing a disabled cell, to reach the previous page', async () => {
    await wrapper.setProps({
      modelValue: new Date(2020, 1, 8),
      disabledDates: {
        dates: [new Date(2020, 1, 1)],
      },
    })

    await wrapper.vm.open()
    vi.advanceTimersByTime(250)

    const startCell = wrapper.findAll('button.cell')[13]

    startCell.element.focus()
    await startCell.trigger('keydown.up')

    const cellUp = wrapper.findAll('button.cell')[27]
    vi.advanceTimersByTime(250)
    expect(document.activeElement).toBe(cellUp.element)
  })

  it('arrows down on cell, bypassing a disabled cell, to reach the next page', async () => {
    await wrapper.setProps({
      modelValue: new Date(2020, 1, 22),
      disabledDates: {
        dates: [new Date(2020, 1, 29)],
      },
    })

    await wrapper.vm.open()
    vi.advanceTimersByTime(250)

    const startCell = wrapper.findAll('button.cell')[27]

    startCell.element.focus()
    await startCell.trigger('keydown.down')

    const cellDown = wrapper.findAll('button.cell')[6]
    vi.advanceTimersByTime(250)
    expect(document.activeElement).toBe(cellDown.element)
  })

  it('opens with focus on the first available date when the open date and all previous dates are disabled', async () => {
    const openDate = new Date(2021, 6, 15)
    const oneDayAfterOpenDate = new Date(2021, 6, 16)

    await wrapper.setProps({
      disabledDates: {
        to: oneDayAfterOpenDate,
      },
      openDate,
    })

    const input = wrapper.find('input')

    await input.trigger('focusin')
    await input.trigger('click')
    vi.advanceTimersByTime(250)

    const firstAvailableDate = wrapper.find('button.cell:not(.muted):enabled')

    expect(document.activeElement).toBe(firstAvailableDate.element)
  })

  it('opens with focus on the first available date when the open date and all future dates are disabled', async () => {
    const openDate = new Date(2021, 6, 15)
    const oneDayBeforeOpenDate = new Date(2021, 6, 14)

    await wrapper.setProps({
      disabledDates: {
        from: oneDayBeforeOpenDate,
      },
      openDate,
    })

    const input = wrapper.find('input')

    await input.trigger('focusin')
    await input.trigger('click')
    vi.advanceTimersByTime(250)

    const firstAvailableDate = wrapper.find('button.cell:not(.muted):enabled')

    expect(document.activeElement).toBe(firstAvailableDate.element)
  })

  it('opens with focus on the `next` button when all dates this month and in the past are disabled', async () => {
    const openDate = new Date(2021, 8, 13)
    const oneMonthAfterOpenDate = new Date(2021, 9, 13)

    await wrapper.setProps({
      disabledDates: {
        to: oneMonthAfterOpenDate,
      },
      openDate,
    })

    const input = wrapper.find('input')

    await input.trigger('click')
    vi.advanceTimersByTime(250)

    const nextButton = wrapper.find('button.next')
    expect(document.activeElement).toBe(nextButton.element)
  })

  it('opens with focus on the `previous` button when all dates this month and in the future are disabled', async () => {
    const openDate = new Date(2021, 8, 13)
    const oneMonthBeforeOpenDate = new Date(2021, 7, 13)

    await wrapper.setProps({
      disabledDates: {
        from: oneMonthBeforeOpenDate,
      },
      openDate,
    })

    const input = wrapper.find('input')

    await input.trigger('click')
    vi.advanceTimersByTime(250)

    const prevButton = wrapper.find('button.prev')
    expect(document.activeElement).toBe(prevButton.element)
  })
})

describe('Datepicker mounted using UTC', () => {
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
    wrapper = mount(DatePicker, {
      props: {
        format: 'yyyy MM dd',
        modelValue: ambiguousDate,
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

describe('Datepicker mounted inline', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(DatePicker, {
      props: {
        inline: true,
      },
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('shows calendar as already open', () => {
    expect(wrapper.vm.isOpen).toEqual(true)
    expect(wrapper.vm.isInline).toEqual(true)
  })

  it('does not close the calendar when date is selected', () => {
    const timestamp = new Date().setHours(0, 0, 0, 0)
    wrapper.vm.handleSelect({ timestamp })
    expect(wrapper.vm.isOpen).toEqual(true)
    document.body.click()
    expect(wrapper.vm.isOpen).toEqual(true)
  })
})

describe('Datepicker mounted inline and attached to body', () => {
  let wrapper
  beforeEach(() => {
    vi.useFakeTimers()

    wrapper = mount(DatePicker, {
      attachTo: document.body,
      props: {
        inline: true,
      },
    })
  })

  afterEach(() => {
    vi.clearAllTimers()

    wrapper.unmount()
  })

  it('focuses the date when selected', async () => {
    const openDate = wrapper.find('button.open')
    await openDate.element.focus()
    await openDate.trigger('click')

    expect(document.activeElement).toBe(openDate.element)

    const anotherDate = wrapper.findAll('button.cell')[10]
    await anotherDate.element.focus()
    await anotherDate.trigger('click')

    expect(document.activeElement).toBe(anotherDate.element)
  })
})

describe('Datepicker mounted and appended to body', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(DatePicker, {
      props: {
        appendToBody: true,
      },
    })
  })

  it('appends popup to body', async () => {
    await wrapper.vm.open()

    expect(wrapper.vm.$el.querySelector('.vdp-datepicker__calendar')).toBeNull()
    expect(document.querySelector('.vdp-datepicker__calendar')).toBeDefined()

    await wrapper.vm.close()
    wrapper.unmount()
  })

  it('removes popup appended to body on component removal', async () => {
    await wrapper.vm.open()
    await wrapper.vm.close()

    wrapper.unmount()
    expect(document.querySelector('.vdp-datepicker__calendar')).toBeNull()
  })
})
