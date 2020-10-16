import { mount } from '@vue/test-utils'
import Datepicker from '~/components/Datepicker.vue'

describe('Datepicker mounted', () => {
  let wrapper
  let date
  beforeEach(() => {
    date = new Date(2016, 1, 15)
    wrapper = mount(Datepicker, {
      propsData: {
        format: 'yyyy-MM-dd',
        value: date,
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('no out of bound', async () => {
    const getBoundingClientRect = jest.fn(() => ({
      right: 10,
      bottom: 10,
      height: 10,
    }))
    wrapper.vm.showCalendar()
    await wrapper.vm.$nextTick()
    wrapper.vm.$refs.datepicker.getBoundingClientRect = getBoundingClientRect
    wrapper.vm.$refs.datepicker.parentElement.getBoundingClientRect = getBoundingClientRect
    const calendar = wrapper.vm.$refs.datepicker
    expect(calendar.style.bottom).toBe('')
    expect(calendar.style.right).toBe('')
  })

  it('everything out of bound', async () => {
    const getBoundingClientRect = jest.fn(() => ({
      right: 2000,
      bottom: 1000,
      height: 10,
    }))
    wrapper.vm.showCalendar()
    wrapper.vm.$refs.datepicker.getBoundingClientRect = getBoundingClientRect
    wrapper.vm.$refs.datepicker.parentElement.getBoundingClientRect = getBoundingClientRect
    await wrapper.vm.$nextTick()
    const calendar = wrapper.vm.$refs.datepicker
    expect(calendar.style.right).toBe('0px')
    expect(calendar.style.bottom).toBe('10px')
  })

  it('fixed position top right', async () => {
    const getBoundingClientRect = jest.fn(() => ({
      right: 10,
      bottom: 10,
      height: 10,
    }))
    wrapper.setProps({
      fixedPosition: 'top-right',
    })
    wrapper.vm.showCalendar()
    wrapper.vm.$refs.datepicker.parentElement.getBoundingClientRect = getBoundingClientRect
    await wrapper.vm.$nextTick()
    const calendar = wrapper.vm.$refs.datepicker
    expect(calendar.style.right).toBe('0px')
    expect(calendar.style.bottom).toBe('10px')
  })

  it('fixed position bottom left', async () => {
    wrapper.setProps({
      fixedPosition: 'bottom-left',
    })
    wrapper.vm.showCalendar()
    await wrapper.vm.$nextTick()
    const calendar = wrapper.vm.$refs.datepicker
    expect(calendar.style.right).toBe('')
    expect(calendar.style.bottom).toBe('')
  })

  it('without picker', async () => {
    wrapper.setData({
      currentPicker: '',
    })
    wrapper.vm.setPickerPosition()
    await wrapper.vm.$nextTick()

    wrapper.vm.$refs = {
      datepicker: {
        style: {},
      },
    }

    wrapper.vm.setPickerPosition()
    await wrapper.vm.$nextTick()
    const calendar = wrapper.vm.$refs.datepicker
    expect(calendar.style.right).toBe('unset')
    expect(calendar.style.bottom).toBe('unset')
  })
})
