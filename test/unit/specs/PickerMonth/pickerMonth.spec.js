import { shallowMount } from '@vue/test-utils'
import PickerMonth from '~/components/PickerMonth.vue'
import { en } from '~/locale'

describe('PickerMonth', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(PickerMonth, {
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

  it('knows the current month', () => {
    const today = wrapper.vm.utils.getNewDateObject()
    const firstOfMonth = new Date(wrapper.vm.utils.setDate(today, 1))
    const currentMonth = wrapper.vm.utils.getMonth(today)

    wrapper.setProps({
      pageDate: firstOfMonth,
    })

    expect(wrapper.vm.todayCell.id).toEqual(currentMonth)
  })

  it('knows the selected month', () => {
    const newDate = new Date(2016, 9, 15)
    wrapper.setProps({
      selectedDate: newDate,
    })
    expect(wrapper.vm.isSelectedMonth(newDate)).toEqual(true)
    expect(wrapper.vm.isSelectedMonth(new Date(2017, 1, 1))).toEqual(false)
  })

  it('can set the next year', () => {
    wrapper.vm.focusNav = jest.fn
    wrapper.vm.nextYear()

    expect(wrapper.emitted()['changed-year']).toHaveLength(1)
    expect(wrapper.emitted()['changed-year'][0][0].getFullYear()).toEqual(2019)

    wrapper.setProps({
      useUtc: true,
      disabledDates: {
        from: new Date(2018, 2, 1),
      },
    })

    wrapper.vm.nextYear()
    expect(wrapper.emitted()['changed-year']).toHaveLength(1)
  })

  it('can set the previous year', () => {
    wrapper.vm.focusNav = jest.fn
    wrapper.vm.previousYear()

    expect(wrapper.emitted()['changed-year']).toHaveLength(1)
    expect(wrapper.emitted()['changed-year'][0][0].getFullYear()).toEqual(2017)

    wrapper.setProps({
      useUtc: true,
      disabledDates: {
        to: new Date(2018, 1, 1),
      },
    })

    wrapper.vm.previousYear()
    expect(wrapper.emitted()['changed-year']).toHaveLength(1)
  })

  it('emits date on selection', () => {
    const time = new Date().valueOf()
    wrapper.vm.selectMonth({ timestamp: time })
    expect(wrapper.emitted()['select-month']).toBeTruthy()
    expect(wrapper.emitted()['select-month'][0][0].timestamp).toEqual(time)
  })

  it('emits show year calendar event when clicked on the year', () => {
    const yearBtn = wrapper.find('.month__year_btn')
    yearBtn.trigger('click')
    expect(wrapper.emitted()['show-year-calendar']).toBeTruthy()
  })
})
