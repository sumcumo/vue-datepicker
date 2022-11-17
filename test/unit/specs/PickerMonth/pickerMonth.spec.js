import { mount } from '@vue/test-utils'
import PickerMonth from '~/components/PickerMonth.vue'
import { en } from '~/locale'

describe('PickerMonth mounted', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(PickerMonth, {
      props: {
        translation: en,
        pageDate: new Date(2018, 1, 1),
        view: 'month',
      },
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('knows the selected month', async () => {
    const newDate = new Date(2016, 9, 15)
    await wrapper.setProps({
      selectedDate: newDate,
    })
    expect(wrapper.vm.isSelectedMonth(newDate)).toEqual(true)
    expect(wrapper.vm.isSelectedMonth(new Date(2017, 1, 1))).toEqual(false)
  })

  it('knows the selected month when useUtc = true', async () => {
    const newDate = new Date(2016, 9, 15)
    await wrapper.setProps({
      selectedDate: newDate,
      useUtc: true,
    })
    expect(wrapper.vm.isSelectedMonth(newDate)).toEqual(true)
    expect(wrapper.vm.isSelectedMonth(new Date(2017, 1, 1))).toEqual(false)
  })

  it('can set the next year', () => {
    wrapper.vm.changePage({ incrementBy: 1, focusRefs: ['next'] })
    expect(wrapper.emitted('pageChange')[0][0].pageDate.getFullYear()).toEqual(
      2019,
    )
  })

  it('can set the previous year', () => {
    wrapper.vm.changePage({ incrementBy: -1, focusRefs: ['prev'] })
    expect(wrapper.emitted('pageChange')[0][0].pageDate.getFullYear()).toEqual(
      2017,
    )
  })

  it('emits date on selection', () => {
    const timestamp = new Date().setHours(0, 0, 0, 0).valueOf()
    wrapper.vm.select({ timestamp })
    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')[0][0].timestamp).toEqual(timestamp)
  })

  it('emits set-view event with `year` when the up button is clicked', async () => {
    const upButton = wrapper.find('.vdp-datepicker__up')
    await upButton.trigger('click')
    expect(wrapper.emitted('setView')[0][0]).toBe('year')
  })
})
