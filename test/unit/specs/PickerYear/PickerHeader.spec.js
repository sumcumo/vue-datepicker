import { shallowMount } from '@vue/test-utils'
import PickerHeader from '~/components/PickerHeader.vue'

describe('PickerHeader shallowMounted', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(PickerHeader, {
      props: {
        isRtl: false,
        isNextDisabled: false,
        isPreviousDisabled: false,
      },
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('arrows down to tabbable cell', () => {
    const prevButton = wrapper.find('button.prev')

    prevButton.trigger('keydown.down')
    expect(wrapper.emitted('setFocus')[0][0]).toEqual(['tabbableCell'])
  })

  it('arrows up to input, if typeable', async () => {
    const prevButton = wrapper.find('button.prev')

    prevButton.trigger('keydown.up')
    expect(wrapper.emitted('setFocus')).toBeUndefined()

    await wrapper.setProps({
      isTypeable: true,
    })

    prevButton.trigger('keydown.up')
    expect(wrapper.emitted('focusInput')).toBeTruthy()
  })

  it('arrows right to the `up` button from the `previous` button', async () => {
    const prevButton = wrapper.find('button.prev')
    await prevButton.trigger('keydown.right')

    expect(wrapper.emitted('setFocus')[0][0]).toEqual([
      'up',
      'next',
      'tabbableCell',
    ])
  })

  it('arrows left to the `up` button from the `previous` button when RTL', async () => {
    await wrapper.setProps({
      isRtl: true,
    })

    const prevButton = wrapper.find('button.prev')
    await prevButton.trigger('keydown.left')

    expect(wrapper.emitted('setFocus')[0][0]).toEqual([
      'up',
      'next',
      'tabbableCell',
    ])
  })

  it('arrows left to the `up` button from the `next` button', async () => {
    const nextButton = wrapper.find('button.next')
    await nextButton.trigger('keydown.left')

    expect(wrapper.emitted('setFocus')[0][0]).toEqual([
      'up',
      'prev',
      'tabbableCell',
    ])
  })

  it('arrows right to the `up` button from the `next` button when RTL', async () => {
    await wrapper.setProps({
      isRtl: true,
    })

    const nextButton = wrapper.find('button.next')
    await nextButton.trigger('keydown.right')

    expect(wrapper.emitted('setFocus')[0][0]).toEqual([
      'up',
      'prev',
      'tabbableCell',
    ])
  })

  it('arrows left to the `previous` button from the `up` button', async () => {
    const upButton = wrapper.find('button.vdp-datepicker__up')
    await upButton.trigger('keydown.left')

    expect(wrapper.emitted('setFocus')[0][0]).toEqual(['prev'])
  })

  it('arrows right to the `previous` button from the `up` button when RTL', async () => {
    await wrapper.setProps({
      isRtl: true,
    })

    const upButton = wrapper.find('button.vdp-datepicker__up')
    await upButton.trigger('keydown.right')

    expect(wrapper.emitted('setFocus')[0][0]).toEqual(['prev'])
  })

  it('arrows right to the `next` button from the `up` button', async () => {
    const upButton = wrapper.find('button.vdp-datepicker__up')
    await upButton.trigger('keydown.right')

    expect(wrapper.emitted('setFocus')[0][0]).toEqual(['next'])
  })

  it('arrows left to the `next` button from the `up` button when RTL', async () => {
    await wrapper.setProps({
      isRtl: true,
    })

    const upButton = wrapper.find('button.vdp-datepicker__up')
    await upButton.trigger('keydown.left')

    expect(wrapper.emitted('setFocus')[0][0]).toEqual(['next'])
  })

  it('decrements the page on clicking the `previous` button', async () => {
    const prevButton = wrapper.find('button.prev')
    await prevButton.trigger('click')

    expect(wrapper.emitted('pageChange')[0][0]).toEqual({
      incrementBy: -1,
      focusRefs: ['prev'],
    })
  })

  it('decrements the page on pressing the `left` arrow key on the `previous` button', async () => {
    const prevButton = wrapper.find('button.prev')
    await prevButton.trigger('keydown.left')

    expect(wrapper.emitted('pageChange')[0][0]).toEqual({
      incrementBy: -1,
      focusRefs: ['prev'],
    })
  })

  it('decrements the page on pressing the `right` arrow key on the `previous` button when RTL', async () => {
    await wrapper.setProps({
      isRtl: true,
    })

    const prevButton = wrapper.find('button.prev')
    await prevButton.trigger('keydown.right')

    expect(wrapper.emitted('pageChange')[0][0]).toEqual({
      incrementBy: -1,
      focusRefs: ['prev'],
    })
  })

  it('increments the page on clicking the `next` button', async () => {
    const nextButton = wrapper.find('button.next')
    await nextButton.trigger('click')

    expect(wrapper.emitted('pageChange')[0][0]).toEqual({
      incrementBy: 1,
      focusRefs: ['next'],
    })
  })

  it('increments the page on pressing the `right` arrow key on the `next` button', async () => {
    const nextButton = wrapper.find('button.next')
    await nextButton.trigger('keydown.right')

    expect(wrapper.emitted('pageChange')[0][0]).toEqual({
      incrementBy: 1,
      focusRefs: ['next'],
    })
  })

  it('increments the page on pressing the `left` arrow key on the `next` button when RTL', async () => {
    await wrapper.setProps({
      isRtl: true,
    })

    const nextButton = wrapper.find('button.next')
    await nextButton.trigger('keydown.left')

    expect(wrapper.emitted('pageChange')[0][0]).toEqual({
      incrementBy: 1,
      focusRefs: ['next'],
    })
  })

  it('focuses the `up` button on pressing the `right` arrow key on the `previous` button', async () => {
    const prevButton = wrapper.find('button.prev')
    await prevButton.trigger('keydown.right')

    expect(wrapper.emitted('setFocus')[0][0]).toEqual([
      'up',
      'next',
      'tabbableCell',
    ])
  })

  it('focuses the `up` button on pressing the `left` arrow key on the `previous` button when RTL', async () => {
    await wrapper.setProps({
      isRtl: true,
    })

    const prevButton = wrapper.find('button.prev')
    await prevButton.trigger('keydown.left')

    expect(wrapper.emitted('setFocus')[0][0]).toEqual([
      'up',
      'next',
      'tabbableCell',
    ])
  })

  it('focuses the `up` button on pressing the `left` arrow key on the `next` button', async () => {
    const nextButton = wrapper.find('button.next')
    await nextButton.trigger('keydown.left')

    expect(wrapper.emitted('setFocus')[0][0]).toEqual([
      'up',
      'prev',
      'tabbableCell',
    ])
  })

  it('focuses the `up` button on pressing the `right` arrow key on the `next` button when RTL', async () => {
    await wrapper.setProps({
      isRtl: true,
    })

    const nextButton = wrapper.find('button.next')
    await nextButton.trigger('keydown.right')

    expect(wrapper.emitted('setFocus')[0][0]).toEqual([
      'up',
      'prev',
      'tabbableCell',
    ])
  })
})
