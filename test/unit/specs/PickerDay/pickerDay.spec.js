import { shallowMount } from '@vue/test-utils'
import PickerDay from '~/components/PickerDay.vue'
import { en, mn } from '~/locale'

describe('PickerDay: DOM', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(PickerDay, {
      propsData: {
        translation: en,
        pageDate: new Date(2018, 1, 1),
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
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

  it('displays page title correctly', () => {
    expect(wrapper.vm.pageTitleDay).toEqual('Feb 2018')

    wrapper.setProps({
      translation: mn, // Mongolian has dates in ymd format
    })

    expect(wrapper.vm.pageTitleDay).toEqual('2018 2-р сар')
  })

  it('emits set-view event with `month` when the up button is clicked', () => {
    const upButton = wrapper.find('.day__month_btn')
    upButton.trigger('click')
    expect(wrapper.emitted()['set-view'][0][0]).toBe('month')
  })

  it('displays edge dates by default', () => {
    const firstCell = wrapper.findAll('.day').at(0)
    const lastCell = wrapper.findAll('.day').at(34)

    expect(firstCell.text()).toBe('28')
    expect(lastCell.text()).toBe('3')
  })

  it('does not display edge dates when show-edge-dates = false', async () => {
    await wrapper.setProps({
      showEdgeDates: false,
    })

    const firstCell = wrapper.findAll('.day').at(0)
    const lastCell = wrapper.findAll('.day').at(34)

    expect(firstCell.text()).toBe('')
    expect(lastCell.text()).toBe('')
  })

  it('should select an edge date from the previous month', async () => {
    const firstCell = wrapper.findAll('.day').at(0)

    await firstCell.trigger('click')

    expect(wrapper.emitted()['select-date'][0][0].date).toBe(28)
  })

  it('should select an edge date from the next month', async () => {
    const lastCell = wrapper.findAll('.day').at(34)

    await lastCell.trigger('click')

    expect(wrapper.emitted()['select-date'][0][0].date).toBe(3)
  })
})
