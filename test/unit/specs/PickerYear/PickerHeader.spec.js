import { shallowMount } from '@vue/test-utils'
import PickerHeader from '~/components/PickerHeader.vue'

describe('PickerHeader shallowMounted', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(PickerHeader, {
      propsData: {
        isRtl: false,
        isNextDisabled: false,
        isPreviousDisabled: false,
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('arrows down to tabbable cell', () => {
    const prevButton = wrapper.find('button.prev')

    prevButton.trigger('keydown.down')
    expect(wrapper.emitted('set-focus')[0][0]).toEqual(['tabbableCell'])
  })

  it('arrows up to input, if typeable', async () => {
    const prevButton = wrapper.find('button.prev')

    prevButton.trigger('keydown.up')
    expect(wrapper.emitted('set-focus')).toBeUndefined()

    await wrapper.setProps({
      isTypeable: true,
    })

    prevButton.trigger('keydown.up')
    expect(wrapper.emitted('focus-input')).toBeTruthy()
  })

  it('decrements the page on clicking the `previous` button', async () => {
    const prevButton = wrapper.find('button.prev')
    await prevButton.trigger('click')

    expect(wrapper.emitted('page-change')[0][0]).toEqual({
      incrementBy: -1,
      focusRefs: ['prev'],
    })
  })

  it('decrements the page on pressing the `left` arrow key on the `previous` button', async () => {
    const prevButton = wrapper.find('button.prev')
    await prevButton.trigger('keydown.left')

    expect(wrapper.emitted('page-change')[0][0]).toEqual({
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

    expect(wrapper.emitted('page-change')[0][0]).toEqual({
      incrementBy: -1,
      focusRefs: ['prev'],
    })
  })

  it('increments the page on clicking the `next` button', async () => {
    const nextButton = wrapper.find('button.next')
    await nextButton.trigger('click')

    expect(wrapper.emitted('page-change')[0][0]).toEqual({
      incrementBy: 1,
      focusRefs: ['next'],
    })
  })

  it('increments the page on pressing the `right` arrow key on the `next` button', async () => {
    const nextButton = wrapper.find('button.next')
    await nextButton.trigger('keydown.right')

    expect(wrapper.emitted('page-change')[0][0]).toEqual({
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

    expect(wrapper.emitted('page-change')[0][0]).toEqual({
      incrementBy: 1,
      focusRefs: ['next'],
    })
  })

  it('focuses the `up` button on pressing the `right` arrow key on the `previous` button', async () => {
    const prevButton = wrapper.find('button.prev')
    await prevButton.trigger('keydown.right')

    expect(wrapper.emitted('set-focus')[0][0]).toEqual([
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

    expect(wrapper.emitted('set-focus')[0][0]).toEqual([
      'up',
      'next',
      'tabbableCell',
    ])
  })

  it('focuses the `up` button on pressing the `left` arrow key on the `next` button', async () => {
    const nextButton = wrapper.find('button.next')
    await nextButton.trigger('keydown.left')

    expect(wrapper.emitted('set-focus')[0][0]).toEqual([
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

    expect(wrapper.emitted('set-focus')[0][0]).toEqual([
      'up',
      'prev',
      'tabbableCell',
    ])
  })
})
