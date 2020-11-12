import { mount, shallowMount } from '@vue/test-utils'
import PickerMonth from '~/components/PickerMonth'
import { en } from '~/locale'

describe('PickerMonth: shallowMount', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(PickerMonth, {
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

  it('knows the selected month', () => {
    const newDate = new Date(2016, 9, 15)
    wrapper.setProps({
      selectedDate: newDate,
    })
    expect(wrapper.vm.isSelectedMonth(newDate)).toEqual(true)
    expect(wrapper.vm.isSelectedMonth(new Date(2017, 1, 1))).toEqual(false)
  })

  it('emits date on selection', () => {
    const time = new Date().valueOf()
    wrapper.vm.selectMonth({ timestamp: time })
    expect(wrapper.emitted()['select-month']).toBeTruthy()
    expect(wrapper.emitted()['select-month'][0][0].timestamp).toEqual(time)
  })
})

describe('PickerMonth: mount', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(PickerMonth, {
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

  it('emits show-year-calendar event when the year is clicked', () => {
    wrapper.find('.month__year_btn').trigger('click')
    expect(wrapper.emitted()['show-year-calendar']).toBeTruthy()
  })

  it('can set the next year', () => {
    wrapper.vm.nextYear()
    expect(wrapper.emitted()['changed-year'][0][0].getFullYear()).toEqual(2019)
  })

  it('can set the previous year', () => {
    wrapper.vm.previousYear()
    expect(wrapper.emitted()['changed-year'][0][0].getFullYear()).toEqual(2017)
  })
})
