import { shallowMount } from '@vue/test-utils'
import PickerDay from '~/components/PickerDay'
import { en } from '~/locale'

describe('PickerDay: Datepicker with Monday as first day of week', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(PickerDay, {
      propsData: {
        firstDayOfWeek: 1,
        translation: en,
        allowedToShowView: () => true,
        pageDate: new Date(2018, 1, 1),
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('should return Monday as a first day of week', () => {
    expect(wrapper.vm.daysOfWeek[0]).toEqual('Mon')
  })

  it('should return Sunday as a seventh day of week', () => {
    expect(wrapper.vm.daysOfWeek[6]).toEqual('Sun')
  })

  it('should have 6 days from previous month when month starts on a Sunday', () => {
    wrapper.setProps({
      pageDate: new Date(2018, 3, 1),
      pageTimestamp: new Date(2018, 9, 1).valueOf(),
    })
    for (let i = 0; i < 6; i += 1) {
      expect(wrapper.vm.cells[i].isPreviousMonth).toBeTruthy()
      expect(wrapper.vm.cells[i].isNextMonth).toBeFalsy()
    }
  })

  it('should have no days from previous month when month starts on a Monday', () => {
    wrapper.setProps({
      pageDate: new Date(2018, 9, 1),
      pageTimestamp: new Date(2018, 9, 1).valueOf(),
    })
    expect(wrapper.vm.cells[0].isPreviousMonth).toBeFalsy()
    expect(wrapper.vm.cells[0].isNextMonth).toBeFalsy()
  })
})
