import { shallowMount } from '@vue/test-utils'
import PickerDay from '~/components/PickerDay.vue'
import { en, mn } from '~/locale'

describe('PickerDay: DOM', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(PickerDay, {
      propsData: {
        allowedToShowView: () => true,
        translation: en,
        pageDate: new Date(2018, 1, 1),
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('knows the current date', () => {
    const today = wrapper.vm.utils.getNewDateObject()
    const todayDate = wrapper.vm.utils.getDate(today)

    wrapper.setProps({
      pageDate: new Date(),
    })

    expect(wrapper.vm.todayCell.date).toEqual(todayDate)
  })

  it('knows the selected date', () => {
    const newDate = new Date(2016, 9, 15)
    wrapper.setProps({
      selectedDate: newDate,
    })
    expect(wrapper.vm.isSelectedDate(newDate)).toEqual(true)
    expect(wrapper.vm.isSelectedDate(new Date(2017, 1, 1))).toEqual(false)
  })

  it('emits an event when selected', () => {
    wrapper.vm.selectDate({ isDisabled: false })
    expect(wrapper.emitted()['select-date']).toBeTruthy()
  })

  it('knows the current page month', () => {
    expect(wrapper.vm.pageMonth).toEqual(1)
    expect(wrapper.vm.currMonthName).toEqual('Feb')

    wrapper.setProps({
      showFullMonthName: true,
    })
    expect(wrapper.vm.currMonthName).toEqual('February')
  })

  it('displays page title correctly', async () => {
    expect(wrapper.vm.pageTitleDay).toEqual('Feb 2018')

    wrapper.setProps({
      translation: mn, // Mongolian has dates in ymd format
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.vm.pageTitleDay).toEqual('2018 2-р сар')
  })

  it('emits show year calendar event when clicked on the year', () => {
    const yearBtn = wrapper.find('.day__month_btn')
    yearBtn.trigger('click')
    expect(wrapper.emitted()['show-month-calendar']).toBeTruthy()
  })

  it('should select an edge date from the previous month', async () => {
    const firstCell = wrapper.findComponent({ ref: '0' })
    wrapper.vm.focusNav = jest.fn

    await firstCell.trigger('click')

    expect(wrapper.emitted()['select-date'][0][0].date).toBe(28)
  })

  it('should select an edge date from the next month', async () => {
    const lastCell = wrapper.findComponent({ ref: '34' })
    wrapper.vm.focusNav = jest.fn

    await lastCell.trigger('click')

    expect(wrapper.emitted()['select-date'][0][0].date).toBe(3)
  })
})
