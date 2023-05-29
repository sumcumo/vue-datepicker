import { mount } from '@vue/test-utils'
import { vi } from 'vitest'
import DatePicker from '~/components/DatePicker.vue'

describe('Datepicker mounted with date', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(DatePicker, {
      props: {
        modelValue: new Date(2016, 1, 15),
      },
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('is not out of bounds', async () => {
    const getBoundingClientRect = vi.fn(() => ({
      right: 10,
      bottom: 10,
      height: 10,
    }))

    wrapper.vm.$el.getBoundingClientRect = getBoundingClientRect

    await wrapper.vm.open()

    const calendar = wrapper.vm.$refs.popup.$el.children[0]
    expect(calendar.style.left).toBe('0px')
    expect(calendar.style.top).toBe('10px')

    await wrapper.vm.close()
    await wrapper.vm.open()

    expect(calendar.style.left).toBe('0px')
    expect(calendar.style.top).toBe('10px')
  })

  it('has everything out of bounds', async () => {
    const getBoundingClientRect = vi.fn(() => ({
      right: 2000,
      bottom: 1000,
      height: 10,
      width: 0,
    }))

    global.getComputedStyle = vi.fn(() => ({
      marginLeft: '0',
      marginRight: '0',
      marginTop: '-10',
      marginBottom: '0',
    }))

    wrapper.vm.$el.getBoundingClientRect = getBoundingClientRect

    await wrapper.vm.open()

    const calendar = wrapper.vm.$refs.popup.$el.children[0]
    expect(calendar.style.left).toBe('0px')
    expect(calendar.style.top).toBe('10px')
  })

  it('has a fixed position of `top-right`', async () => {
    const getBoundingClientRect = vi.fn(() => ({
      right: 10,
      bottom: 10,
      height: 10,
      width: 10,
    }))

    global.getComputedStyle = vi.fn(() => ({
      marginLeft: '0',
      marginRight: '0',
      marginTop: '0',
      marginBottom: '0',
    }))

    wrapper.vm.$el.getBoundingClientRect = getBoundingClientRect

    await wrapper.setProps({
      fixedPosition: 'top-right',
    })

    await wrapper.vm.open()

    const calendar = wrapper.vm.$refs.popup.$el.children[0]
    expect(calendar.style.left).toBe('10px')
    expect(calendar.style.top).toBe('0px')
  })

  it('has a fixed position of `bottom-left`', async () => {
    await wrapper.setProps({
      fixedPosition: 'bottom-left',
    })

    await wrapper.vm.open()

    const calendar = wrapper.vm.$refs.popup.$el.children[0]
    expect(calendar.style.left).toBe('0px')
    expect(calendar.style.top).toBe('0px')
  })

  it('has a relative position', async () => {
    const getBoundingClientRect = vi.fn(() => ({
      left: 10,
      right: 10,
      bottom: 10,
      height: 10,
      width: 10,
      top: 10,
    }))

    global.getComputedStyle = vi.fn(() => ({
      marginLeft: '0',
      marginRight: '50',
      marginTop: '50',
      marginBottom: '0',
    }))

    wrapper.vm.$el.getBoundingClientRect = getBoundingClientRect

    await wrapper.vm.open()

    const calendar = wrapper.vm.$refs.popup.$el.children[0]
    expect(calendar.style.left).toBe('-9px')
    expect(calendar.style.top).toBe('-60px')
  })
})
