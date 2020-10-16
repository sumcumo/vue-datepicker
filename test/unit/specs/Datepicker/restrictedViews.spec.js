import { mount } from '@vue/test-utils'
import Datepicker from '~/components/Datepicker'

describe('Datepicker with restricted views', () => {
  let wrapper
  it('should default initialView to minimumView', () => {
    wrapper = mount(Datepicker, {
      propsData: {
        minimumView: 'month',
        maximumView: 'month',
      },
    })
    expect(wrapper.vm.computedInitialView).toEqual('month')
  })

  it('should save and close when selecting on minimum-view "month"', () => {
    wrapper = mount(Datepicker, {
      propsData: {
        minimumView: 'month',
        maximumView: 'year',
      },
    })
    const date = new Date(2016, 9, 12)
    wrapper.vm.selectYear({ timestamp: date.valueOf() })
    expect(wrapper.vm.isOpen).toEqual(true)
    wrapper.vm.selectMonth({ timestamp: date.valueOf() })
    expect(date.getFullYear()).toEqual(wrapper.vm.selectedDate.getFullYear())
    expect(date.getMonth()).toEqual(wrapper.vm.selectedDate.getMonth())
    expect(wrapper.vm.isOpen).toEqual(false)
  })

  it('should save and close when selecting on minimum-view "year"', () => {
    wrapper = mount(Datepicker, {
      propsData: {
        minimumView: 'year',
        maximumView: 'year',
      },
    })
    const date = new Date(2016, 9, 12)
    wrapper.vm.selectYear({ timestamp: date.valueOf() })
    expect(wrapper.vm.isOpen).toEqual(false)
    expect(date.getFullYear()).toEqual(wrapper.vm.selectedDate.getFullYear())
  })

  it('should only allow views in min-max range', async () => {
    wrapper = mount(Datepicker, {
      propsData: {
        minimumView: 'day',
        maximumView: 'month',
      },
    })
    wrapper.vm.showCalendar()

    expect(wrapper.vm.allowedToShowView('year')).toEqual(false)
    expect(wrapper.vm.allowedToShowView('day')).toEqual(true)
    expect(wrapper.vm.allowedToShowView('month')).toEqual(true)
    expect(wrapper.vm.currentPicker).toBe('PickerDay')
    let upButton = wrapper.find('.day__month_btn')
    await upButton.trigger('click')
    expect(wrapper.vm.currentPicker).toBe('PickerMonth')
    upButton = wrapper.find('.month__year_btn')
    expect(upButton.element.tabIndex).toBe(-1)

    wrapper.destroy()

    wrapper = mount(Datepicker, {
      propsData: {
        minimumView: 'month',
        maximumView: 'month',
      },
    })
    wrapper.vm.showCalendar()

    expect(wrapper.vm.allowedToShowView('day')).toEqual(false)
    expect(wrapper.vm.allowedToShowView('year')).toEqual(false)
    expect(wrapper.vm.allowedToShowView('month')).toEqual(true)
    expect(wrapper.vm.currentPicker).toBe('PickerMonth')

    wrapper = mount(Datepicker, {
      propsData: {
        minimumView: 'day',
        maximumView: 'year',
      },
    })
    expect(wrapper.vm.allowedToShowView('day')).toEqual(true)
    expect(wrapper.vm.allowedToShowView('year')).toEqual(true)
    expect(wrapper.vm.allowedToShowView('month')).toEqual(true)
  })

  it('should throw an error on disallowed initial views', () => {
    wrapper = mount(Datepicker, {
      propsData: {
        minimumView: 'day',
        maximumView: 'month',
        initialView: 'year',
      },
    })

    expect(() => {
      wrapper.vm.setInitialView()
    }).toThrow()
  })

  it('should not render unused views', async () => {
    wrapper = mount(Datepicker, {
      propsData: {
        minimumView: 'day',
        maximumView: 'day',
      },
    })
    wrapper.vm.showCalendar()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.$el.querySelectorAll('.vdp-datepicker__calendar').length).toEqual(1)
    expect(wrapper.vm.$el.querySelectorAll('.vdp-datepicker__calendar .cell.day').length)
      .toBeGreaterThan(0)
    expect(wrapper.vm.$el.querySelectorAll('.vdp-datepicker__calendar .cell.month').length)
      .toEqual(0)
    expect(wrapper.vm.$el.querySelectorAll('.vdp-datepicker__calendar .cell.year').length)
      .toEqual(0)

    expect(wrapper.vm.currentPicker).toBe('PickerDay')

    wrapper = mount(Datepicker, {
      propsData: {
        minimumView: 'month',
        maximumView: 'year',
      },
    })
    wrapper.vm.showCalendar()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.$el.querySelectorAll('.vdp-datepicker__calendar').length).toEqual(1)
    expect(wrapper.vm.$el.querySelectorAll('.vdp-datepicker__calendar .cell.day').length)
      .toEqual(0)
    expect(wrapper.vm.$el.querySelectorAll('.vdp-datepicker__calendar .cell.month').length)
      .toBeGreaterThan(0)
    expect(wrapper.vm.$el.querySelectorAll('.vdp-datepicker__calendar .cell.year').length)
      .toEqual(0)
  })
})
