import { mount, shallowMount } from '@vue/test-utils'
import PickerYear from '~/components/PickerYear.vue'
import { en } from '~/locale'

describe('PickerYear: shallowMount', () => {
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

  it('knows the selected year', async () => {
    const newDate = new Date(2016, 9, 15)
    wrapper.setProps({
      selectedDate: newDate,
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isSelectedYear(newDate)).toEqual(true)
    expect(wrapper.vm.isSelectedYear(new Date(2017, 1, 1))).toEqual(false)
  })

  it('formats the decade range', async () => {
    wrapper.setProps({
      pageDate: new Date(2021, 1, 1),
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.pageTitleDecade).toEqual('2020 - 2029')
    wrapper.setProps({
      pageDate: new Date(2001, 1, 1),
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.pageTitleDecade).toEqual('2000 - 2009')
  })

  it('emits an event when selected', () => {
    wrapper.vm.selectYear({ isDisabled: false })
    expect(wrapper.emitted()['select-year']).toBeTruthy()
  })

  it('should set custom decade range', async () => {
    wrapper.setProps({
      pageDate: new Date(2021, 1, 1),
      yearRange: 12,
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.pageTitleDecade).toEqual('2016 - 2027')
    expect(wrapper.vm.$el.querySelectorAll('.cell.year').length).toEqual(12)
  })
})

describe('PickerYear: mount', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(PickerYear, {
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

  it('can set the next decade', () => {
    wrapper.vm.nextDecade()
    expect(wrapper.emitted()['changed-decade']).toBeTruthy()
  })

  it('can set the previous decade', () => {
    wrapper.vm.previousDecade()
    expect(wrapper.emitted()['changed-decade']).toBeTruthy()
  })
})
