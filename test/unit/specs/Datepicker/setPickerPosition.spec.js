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
    wrapper.vm.$refs.popup.$el.getBoundingClientRect = getBoundingClientRect
    wrapper.vm.$el.getBoundingClientRect = getBoundingClientRect

    wrapper.vm.showCalendar()
    await wrapper.vm.$nextTick()

    const calendar = wrapper.vm.$refs.popup
    expect(calendar.$el.style.left).toBe('0px')
    expect(calendar.$el.style.top).toBe('10px')
  })

  it('everything out of bound', async () => {
    const getBoundingClientRect = jest.fn(() => ({
      right: 2000,
      bottom: 1000,
      height: 10,
      width: 0,
    }))

    global.getComputedStyle = jest.fn(() => ({
      marginLeft: '0',
      marginRight: '0',
      marginTop: '-10',
      marginBottom: '0',
    }))
    wrapper.vm.$refs.popup.$el.getBoundingClientRect = getBoundingClientRect
    wrapper.vm.$el.getBoundingClientRect = getBoundingClientRect

    wrapper.vm.showCalendar()
    await wrapper.vm.$nextTick()

    const calendar = wrapper.vm.$refs.popup
    expect(calendar.$el.style.left).toBe('0px')
    expect(calendar.$el.style.top).toBe('10px')
  })

  it('fixed position top right', async () => {
    const getBoundingClientRect = jest.fn(() => ({
      right: 10,
      bottom: 10,
      height: 10,
      width: 10,
    }))
    global.getComputedStyle = jest.fn(() => ({
      marginLeft: '0',
      marginRight: '0',
      marginTop: '0',
      marginBottom: '0',
    }))
    wrapper.vm.$refs.popup.$el.getBoundingClientRect = getBoundingClientRect
    wrapper.vm.$el.getBoundingClientRect = getBoundingClientRect
    wrapper.setProps({
      fixedPosition: 'top-right',
    })

    wrapper.vm.showCalendar()
    await wrapper.vm.$nextTick()

    const calendar = wrapper.vm.$refs.popup
    expect(calendar.$el.style.left).toBe('10px')
    expect(calendar.$el.style.top).toBe('0px')
  })

  it('fixed position bottom left', async () => {
    wrapper.setProps({
      fixedPosition: 'bottom-left',
    })

    wrapper.vm.showCalendar()
    await wrapper.vm.$nextTick()

    const calendar = wrapper.vm.$refs.popup
    expect(calendar.$el.style.left).toBe('0px')
    expect(calendar.$el.style.top).toBe('0px')
  })

  it('should have relative position', async () => {
    const getBoundingClientRect = jest.fn(() => ({
      left: 10,
      right: 10,
      bottom: 10,
      height: 10,
      width: 10,
      top: 10,
    }))
    global.getComputedStyle = jest.fn(() => ({
      marginLeft: '0',
      marginRight: '50',
      marginTop: '50',
      marginBottom: '0',
    }))
    wrapper.vm.$refs.popup.$el.getBoundingClientRect = getBoundingClientRect
    wrapper.vm.$el.getBoundingClientRect = getBoundingClientRect

    wrapper.vm.showCalendar()
    await wrapper.vm.$nextTick()

    const calendar = wrapper.vm.$refs.popup
    expect(calendar.$el.style.left).toBe('-9px')
    expect(calendar.$el.style.top).toBe('-60px')
  })
})
