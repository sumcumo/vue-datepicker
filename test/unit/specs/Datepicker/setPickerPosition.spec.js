import { mount } from '@vue/test-utils'
import Datepicker from '~/components/Datepicker.vue'

describe('Datepicker mounted with date', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Datepicker, {
      propsData: {
        value: new Date(2016, 1, 15),
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('is not out of bounds', async () => {
    const getBoundingClientRect = jest.fn(() => ({
      right: 10,
      bottom: 10,
      height: 10,
    }))
    wrapper.vm.$refs.popup.$el.getBoundingClientRect = getBoundingClientRect
    wrapper.vm.$el.getBoundingClientRect = getBoundingClientRect

    await wrapper.vm.open()

    const calendar = wrapper.vm.$refs.popup
    expect(calendar.$el.style.left).toBe('0px')
    expect(calendar.$el.style.top).toBe('10px')

    await wrapper.vm.close()
    await wrapper.vm.open()

    expect(calendar.$el.style.left).toBe('0px')
    expect(calendar.$el.style.top).toBe('10px')
  })

  it('has everything out of bounds', async () => {
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

    await wrapper.vm.open()

    const calendar = wrapper.vm.$refs.popup
    expect(calendar.$el.style.left).toBe('0px')
    expect(calendar.$el.style.top).toBe('10px')
  })

  it('has a fixed position of `top-right`', async () => {
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
    await wrapper.setProps({
      fixedPosition: 'top-right',
    })

    await wrapper.vm.open()

    const calendar = wrapper.vm.$refs.popup
    expect(calendar.$el.style.left).toBe('10px')
    expect(calendar.$el.style.top).toBe('0px')
  })

  it('has a fixed position of `bottom-left`', async () => {
    await wrapper.setProps({
      fixedPosition: 'bottom-left',
    })

    await wrapper.vm.open()

    const calendar = wrapper.vm.$refs.popup
    expect(calendar.$el.style.left).toBe('0px')
    expect(calendar.$el.style.top).toBe('0px')
  })

  it('has a relative position', async () => {
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

    await wrapper.vm.open()

    const calendar = wrapper.vm.$refs.popup
    expect(calendar.$el.style.left).toBe('-9px')
    expect(calendar.$el.style.top).toBe('-60px')
  })
})
