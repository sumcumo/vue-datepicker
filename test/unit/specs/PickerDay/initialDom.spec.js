import { shallowMount } from '@vue/test-utils'
import PickerDay from '~/components/PickerDay.vue'
import { en } from '~/locale'

describe('PickerDay: DOM', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(PickerDay, {
      propsData: {
        translation: en,
        pageDate: new Date(2018, 1, 1),
        selectedDate: new Date(2018, 2, 24),
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders correct contents', () => {
    expect(wrapper.findAll('.cell').length).toBeGreaterThan(0)
  })
})
