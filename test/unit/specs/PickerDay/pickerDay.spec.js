import { mount, shallowMount } from '@vue/test-utils'
import PickerDay from '~/components/PickerDay'
import { en } from '~/locale'

describe('PickerDay: DOM', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(PickerDay, {
      propsData: {
        allowedToShowView: () => true,
        translation: en,
        pageDate: new Date(2018, 1, 1),
        selectedDate: new Date(2018, 2, 24),
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
    expect(wrapper.emitted()['set-date']).toBeTruthy()
  })

  it('knows the current page month', () => {
    expect(wrapper.vm.getPageMonth()).toEqual(1)
  })
})

describe('PickerDay mounted: DOM', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(PickerDay, {
      propsData: {
        allowedToShowView: () => true,
        translation: en,
        pageDate: new Date(2018, 1, 1),
        selectedDate: new Date(2018, 2, 24),
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('emits show month calendar event when the up button is clicked', () => {
    const yearBtn = wrapper.find('.day__month_btn')
    yearBtn.trigger('click')
    expect(wrapper.emitted()['show-month-calendar']).toBeTruthy()
  })
})
