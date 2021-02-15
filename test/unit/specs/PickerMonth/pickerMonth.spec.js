import { shallowMount } from '@vue/test-utils'
import PickerMonth from '~/components/PickerMonth.vue'
import { en } from '~/locale'

describe('PickerMonth', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(PickerMonth, {
      propsData: {
        translation: en,
        pageDate: new Date(2018, 1, 1),
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

  it('knows the selected month when useUtc = true', () => {
    const newDate = new Date(2016, 9, 15)
    wrapper.setProps({
      selectedDate: newDate,
      useUtc: true,
    })
    expect(wrapper.vm.isSelectedMonth(newDate)).toEqual(true)
    expect(wrapper.vm.isSelectedMonth(new Date(2017, 1, 1))).toEqual(false)
  })

  it('can set the next year', () => {
    wrapper.vm.nextYear()
    expect(wrapper.emitted()['changed-year'][0][0].getFullYear()).toEqual(2019)

    wrapper.setProps({
      disabledDates: {
        from: new Date(2018, 1, 1),
      },
    })

    wrapper.vm.nextYear()
    expect(wrapper.emitted()['changed-year'][0][0].getFullYear()).toEqual(2019)
  })

  it('can set the previous year', () => {
    wrapper.vm.previousYear()
    expect(wrapper.emitted()['changed-year'][0][0].getFullYear()).toEqual(2017)

    wrapper.setProps({
      disabledDates: {
        to: new Date(2018, 1, 1),
      },
    })

    wrapper.vm.previousYear()
    expect(wrapper.emitted()['changed-year'][0][0].getFullYear()).toEqual(2017)
  })

  it('emits date on selection', () => {
    const time = new Date().valueOf()
    wrapper.vm.selectMonth({ timestamp: time })
    expect(wrapper.emitted()['select-month']).toBeTruthy()
    expect(wrapper.emitted()['select-month'][0][0].timestamp).toEqual(time)
  })

  it('emits set-view event with `year` when the up button is clicked', () => {
    const upButton = wrapper.find('.month__year_btn')
    upButton.trigger('click')
    expect(wrapper.emitted()['set-view'][0][0]).toBe('year')
  })
})
