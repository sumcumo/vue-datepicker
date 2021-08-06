import { mount } from '@vue/test-utils'
import PickerCells from '~/components/PickerCells.vue'

describe('PickerCells', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(PickerCells, {
      propsData: {
        cells: [],
        view: 'day',
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it("does not highlight today's date when show-edge-dates = false", async () => {
    const cell = {
      date: 1,
      isToday: true,
      isPreviousMonth: false,
      isNextMonth: true,
    }

    await wrapper.setProps({
      showEdgeDates: true,
    })

    let cellClasses = wrapper.vm.cellClasses(cell)
    expect(cellClasses[2].today).toBeTruthy()

    await wrapper.setProps({
      showEdgeDates: false,
    })

    cellClasses = wrapper.vm.cellClasses(cell)

    expect(cellClasses[2].today).toBeFalsy()
  })
})
