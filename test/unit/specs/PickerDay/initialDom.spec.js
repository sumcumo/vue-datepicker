import { mount } from '@vue/test-utils'
import PickerDay from '~/components/PickerDay.vue'
import { en } from '~/locale'

describe('PickerDay mounted', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(PickerDay, {
      props: {
        translation: en,
        pageDate: new Date(2018, 1, 1),
      },
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('renders correct contents', () => {
    expect(wrapper.vm.cells.length).toBeGreaterThan(0)
  })
})
