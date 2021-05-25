import { shallowMount } from '@vue/test-utils'
import PickerHeader from '~/components/PickerHeader.vue'

describe('PickerHeader', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(PickerHeader, {
      propsData: {
        isRtl: false,
        isNextDisabled: false,
        isPreviousDisabled: false,
        isTypeable: false,
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('should `arrow down` to tabbable cell', () => {
    const prevButton = wrapper.find('button.prev')

    prevButton.trigger('keydown.down')
    expect(wrapper.emitted('set-focus')[0][0]).toEqual(['tabbable-cell'])
  })

  it('should `arrow up` to input, if typeable', async () => {
    const prevButton = wrapper.find('button.prev')

    prevButton.trigger('keydown.up')
    expect(wrapper.emitted('set-focus')).toBeUndefined()

    await wrapper.setProps({
      isTypeable: true,
    })

    prevButton.trigger('keydown.up')
    expect(wrapper.emitted('set-focus')[0][0]).toEqual(['input'])
  })

  it('should decrement the page when the `previous` button is clicked', async () => {
    const prevButton = wrapper.find('button.prev')
    await prevButton.trigger('click')

    expect(wrapper.emitted('page-change')[0][0]).toEqual({
      incrementBy: -1,
      focusRefs: ['prev'],
    })
  })

  it('should decrement the page - when NOT isRtl - on pressing the `left` arrow key on the `previous` button', async () => {
    const prevButton = wrapper.find('button.prev')
    await prevButton.trigger('keydown.left')

    expect(wrapper.emitted('page-change')[0][0]).toEqual({
      incrementBy: -1,
      focusRefs: ['prev'],
    })
  })

  it('should decrement the page - when isRtl - on pressing the `right` arrow key on the `previous` button', async () => {
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

  it('should increment the page when the `next` button is clicked', async () => {
    const nextButton = wrapper.find('button.next')
    await nextButton.trigger('click')

    expect(wrapper.emitted('page-change')[0][0]).toEqual({
      incrementBy: 1,
      focusRefs: ['next'],
    })
  })

  it('should increment the page - when NOT isRtl - on pressing the `right` arrow key on the `next` button', async () => {
    const nextButton = wrapper.find('button.next')
    await nextButton.trigger('keydown.right')

    expect(wrapper.emitted('page-change')[0][0]).toEqual({
      incrementBy: 1,
      focusRefs: ['next'],
    })
  })

  it('should increment the page - when isRtl - on pressing the `left` arrow key on the `next` button', async () => {
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

  it('should focus the `up` button - when NOT isRtl - on pressing the `right` arrow key on the `previous` button', async () => {
    const prevButton = wrapper.find('button.prev')
    await prevButton.trigger('keydown.right')

    expect(wrapper.emitted('set-focus')[0][0]).toEqual([
      'up',
      'next',
      'tabbable-cell',
    ])
  })

  it('should focus the `up` button - when isRtl - on pressing the `left` arrow key on the `previous` button', async () => {
    await wrapper.setProps({
      isRtl: true,
    })

    const prevButton = wrapper.find('button.prev')
    await prevButton.trigger('keydown.left')

    expect(wrapper.emitted('set-focus')[0][0]).toEqual([
      'up',
      'next',
      'tabbable-cell',
    ])
  })

  it('should focus the `up` button - when NOT isRtl - on pressing the `left` arrow key on the `next` button', async () => {
    const nextButton = wrapper.find('button.next')
    await nextButton.trigger('keydown.left')

    expect(wrapper.emitted('set-focus')[0][0]).toEqual([
      'up',
      'prev',
      'tabbable-cell',
    ])
  })

  it('should focus the `up` button - when isRtl - on pressing the `right` arrow key on the `next` button', async () => {
    await wrapper.setProps({
      isRtl: true,
    })

    const nextButton = wrapper.find('button.next')
    await nextButton.trigger('keydown.right')

    expect(wrapper.emitted('set-focus')[0][0]).toEqual([
      'up',
      'prev',
      'tabbable-cell',
    ])
  })
})
