import { mount } from '@vue/test-utils'
import PickerMonth from '~/components/PickerMonth.vue'
import { en } from '~/locale'

describe('PickerMonth', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(PickerMonth, {
      propsData: {
        translation: en,
        pageDate: new Date(2018, 1, 1),
        view: 'month',
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
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

  it('can set the next year', async () => {
    wrapper.vm.changePage(1)
    expect(wrapper.emitted('page-change')[0][0].getFullYear()).toEqual(2019)
  })

  it('can set the previous year', async () => {
    wrapper.vm.changePage(-1)
    expect(wrapper.emitted('page-change')[0][0].getFullYear()).toEqual(2017)
  })

  it('emits date on selection', () => {
    const time = new Date().valueOf()
    wrapper.vm.select({ timestamp: time })
    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')[0][0].timestamp).toEqual(time)
  })

  it('emits set-view event with `year` when the up button is clicked', async () => {
    const upButton = wrapper.find('.month__year_btn')
    await upButton.trigger('click')
    expect(wrapper.emitted('set-view')[0][0]).toBe('year')
  })
})
