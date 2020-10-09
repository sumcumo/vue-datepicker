import { shallowMount } from '@vue/test-utils'
import PickerYear from '~/components/PickerYear'
import { en } from '~/locale'

describe('PickerYear', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(PickerYear, {
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

  it('knows the selected year', () => {
    const newDate = new Date(2016, 9, 15)
    wrapper.setProps({
      selectedDate: newDate,
    })
    expect(wrapper.vm.isSelectedYear(newDate)).toEqual(true)
    expect(wrapper.vm.isSelectedYear(new Date(2017, 1, 1))).toEqual(false)
  })

  it('can set the next decade', () => {
    wrapper.vm.nextDecade()
    expect(wrapper.emitted()['changed-decade']).toBeTruthy()
  })

  it('can set the previous decade', () => {
    wrapper.vm.previousDecade()
    expect(wrapper.emitted()['changed-decade']).toBeTruthy()
  })

  it('formats the decade range', () => {
    wrapper.setProps({
      pageDate: new Date(2021, 1, 1),
    })
    expect(wrapper.vm.getPageDecade).toEqual('2020 - 2029')
    wrapper.setProps({
      pageDate: new Date(2001, 1, 1),
    })
    expect(wrapper.vm.getPageDecade).toEqual('2000 - 2009')
  })

  it('emits an event when selected', () => {
    wrapper.vm.selectYear({ isDisabled: false })
    expect(wrapper.emitted()['select-year']).toBeTruthy()
  })

  it('should set custom decade range', () => {
    wrapper.setProps({
      pageDate: new Date(2021, 1, 1),
      yearPickerRange: 12,
    })
    expect(wrapper.vm.getPageDecade).toEqual('2016 - 2027')
    expect(wrapper.vm.$el.querySelectorAll('.cell.year').length)
      .toEqual(12)
  })
})
