import { shallowMount } from '@vue/test-utils'
import PickerYear from '~/components/PickerYear.vue'
import { en } from '~/locale'

describe('FocusedYear: yearRange = 10 (default)', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(PickerYear, {
      propsData: {
        translation: en,
        minimumView: 'year',
        pageDate: new Date(2021, 2, 1),
        pageTimestamp: new Date(2021, 2, 1).valueOf(),
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('calculates first cell', async () => {
    const firstCell = wrapper.findComponent({ ref: '0' })
    await firstCell.trigger('focus')

    expect(wrapper.vm.nextCell.up.onOtherPage).toBe('Previous')
    expect(wrapper.vm.nextCell.up.delta).toEqual(-3)

    expect(wrapper.vm.nextCell.down.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.down.delta).toEqual(3)

    expect(wrapper.vm.nextCell.left.onOtherPage).toBe('Previous')
    expect(wrapper.vm.nextCell.left.delta).toEqual(-3)

    expect(wrapper.vm.nextCell.right.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.right.delta).toEqual(1)
  })

  it('calculates last cell on first row', async () => {
    const lastCellOnFirstRow = wrapper.findComponent({ ref: '2' })
    await lastCellOnFirstRow.trigger('focus')

    expect(wrapper.vm.nextCell.up.onOtherPage).toBe('Previous')
    expect(wrapper.vm.nextCell.up.delta).toEqual(-4)

    expect(wrapper.vm.nextCell.down.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.down.delta).toEqual(3)

    expect(wrapper.vm.nextCell.left.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.left.delta).toEqual(-1)

    expect(wrapper.vm.nextCell.right.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.right.delta).toEqual(1)
  })

  it('calculates mid-year cell', async () => {
    const midYearCell = wrapper.findComponent({ ref: '4' })
    await midYearCell.trigger('focus')

    expect(wrapper.vm.nextCell.up.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.up.delta).toEqual(-3)

    expect(wrapper.vm.nextCell.down.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.down.delta).toEqual(3)

    expect(wrapper.vm.nextCell.left.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.left.delta).toEqual(-1)

    expect(wrapper.vm.nextCell.right.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.right.delta).toEqual(1)
  })

  it('calculates last cell on penultimate row', async () => {
    const lastCellOnPenultimateRow = wrapper.findComponent({ ref: '8' })
    await lastCellOnPenultimateRow.trigger('focus')

    expect(wrapper.vm.nextCell.up.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.up.delta).toEqual(-3)

    expect(wrapper.vm.nextCell.down.onOtherPage).toBe('Next')
    expect(wrapper.vm.nextCell.down.delta).toEqual(2)

    expect(wrapper.vm.nextCell.left.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.left.delta).toEqual(-1)

    expect(wrapper.vm.nextCell.right.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.right.delta).toEqual(1)
  })

  it('calculates first cell on last row', async () => {
    const firstCellOnLastRow = wrapper.findComponent({ ref: '9' })
    await firstCellOnLastRow.trigger('focus')

    expect(wrapper.vm.nextCell.up.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.up.delta).toEqual(-3)

    expect(wrapper.vm.nextCell.down.onOtherPage).toBe('Next')
    expect(wrapper.vm.nextCell.down.delta).toEqual(0)

    expect(wrapper.vm.nextCell.left.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.left.delta).toEqual(-1)

    expect(wrapper.vm.nextCell.right.onOtherPage).toBe('Next')
    expect(wrapper.vm.nextCell.right.delta).toEqual(0)
  })
})

describe('FocusedYear (RTL): yearRange = 10 (default)', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(PickerYear, {
      propsData: {
        translation: en,
        minimumView: 'year',
        pageDate: new Date(2021, 2, 1),
        pageTimestamp: new Date(2021, 2, 1).valueOf(),
        isRtl: true,
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('calculates first cell', async () => {
    const firstCell = wrapper.findComponent({ ref: '0' })
    await firstCell.trigger('focus')

    expect(wrapper.vm.nextCell.up.onOtherPage).toBe('Previous')
    expect(wrapper.vm.nextCell.up.delta).toEqual(-3)

    expect(wrapper.vm.nextCell.down.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.down.delta).toEqual(3)

    expect(wrapper.vm.nextCell.left.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.left.delta).toEqual(1)

    expect(wrapper.vm.nextCell.right.onOtherPage).toBe('Previous')
    expect(wrapper.vm.nextCell.right.delta).toEqual(-3)
  })

  it('calculates last cell on first row', async () => {
    const lastCellOnFirstRow = wrapper.findComponent({ ref: '2' })
    await lastCellOnFirstRow.trigger('focus')

    expect(wrapper.vm.nextCell.up.onOtherPage).toBe('Previous')
    expect(wrapper.vm.nextCell.up.delta).toEqual(-4)

    expect(wrapper.vm.nextCell.down.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.down.delta).toEqual(3)

    expect(wrapper.vm.nextCell.left.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.left.delta).toEqual(1)

    expect(wrapper.vm.nextCell.right.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.right.delta).toEqual(-1)
  })

  it('calculates last cell on penultimate row', async () => {
    const lastCellOnPenultimateRow = wrapper.findComponent({ ref: '8' })
    await lastCellOnPenultimateRow.trigger('focus')

    expect(wrapper.vm.nextCell.up.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.up.delta).toEqual(-3)

    expect(wrapper.vm.nextCell.down.onOtherPage).toBe('Next')
    expect(wrapper.vm.nextCell.down.delta).toEqual(2)

    expect(wrapper.vm.nextCell.left.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.left.delta).toEqual(1)

    expect(wrapper.vm.nextCell.right.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.right.delta).toEqual(-1)
  })

  it('calculates first cell on last row', async () => {
    const firstCellOnLastRow = wrapper.findComponent({ ref: '9' })
    await firstCellOnLastRow.trigger('focus')

    expect(wrapper.vm.nextCell.up.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.up.delta).toEqual(-3)

    expect(wrapper.vm.nextCell.down.onOtherPage).toBe('Next')
    expect(wrapper.vm.nextCell.down.delta).toEqual(0)

    expect(wrapper.vm.nextCell.left.onOtherPage).toBe('Next')
    expect(wrapper.vm.nextCell.left.delta).toEqual(0)

    expect(wrapper.vm.nextCell.right.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.right.delta).toEqual(-1)
  })
})

describe('FocusedYear: yearRange = 12', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(PickerYear, {
      propsData: {
        translation: en,
        minimumView: 'year',
        pageDate: new Date(2021, 2, 1),
        pageTimestamp: new Date(2021, 2, 1).valueOf(),
        yearRange: 12,
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('calculates first cell', async () => {
    const firstCell = wrapper.findComponent({ ref: '0' })
    await firstCell.trigger('focus')

    expect(wrapper.vm.nextCell.up.onOtherPage).toBe('Previous')
    expect(wrapper.vm.nextCell.up.delta).toEqual(-3)

    expect(wrapper.vm.nextCell.down.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.down.delta).toEqual(3)

    expect(wrapper.vm.nextCell.left.onOtherPage).toBe('Previous')
    expect(wrapper.vm.nextCell.left.delta).toEqual(-1)

    expect(wrapper.vm.nextCell.right.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.right.delta).toEqual(1)
  })

  it('calculates last cell on first row', async () => {
    const lastCellOnFirstRow = wrapper.findComponent({ ref: '2' })
    await lastCellOnFirstRow.trigger('focus')

    expect(wrapper.vm.nextCell.up.onOtherPage).toBe('Previous')
    expect(wrapper.vm.nextCell.up.delta).toEqual(-1)

    expect(wrapper.vm.nextCell.down.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.down.delta).toEqual(3)

    expect(wrapper.vm.nextCell.left.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.left.delta).toEqual(-1)

    expect(wrapper.vm.nextCell.right.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.right.delta).toEqual(1)
  })

  it('calculates first cell on last row', async () => {
    const firstCellOnLastRow = wrapper.findComponent({ ref: '9' })
    await firstCellOnLastRow.trigger('focus')

    expect(wrapper.vm.nextCell.up.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.up.delta).toEqual(-3)

    expect(wrapper.vm.nextCell.down.onOtherPage).toBe('Next')
    expect(wrapper.vm.nextCell.down.delta).toEqual(0)

    expect(wrapper.vm.nextCell.left.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.left.delta).toEqual(-1)

    expect(wrapper.vm.nextCell.right.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.right.delta).toEqual(1)
  })

  it('calculates last cell', async () => {
    const lastCell = wrapper.findComponent({ ref: '11' })
    await lastCell.trigger('focus')

    expect(wrapper.vm.nextCell.up.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.up.delta).toEqual(-3)

    expect(wrapper.vm.nextCell.down.onOtherPage).toBe('Next')
    expect(wrapper.vm.nextCell.down.delta).toEqual(2)

    expect(wrapper.vm.nextCell.left.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.left.delta).toEqual(-1)

    expect(wrapper.vm.nextCell.right.onOtherPage).toBe('Next')
    expect(wrapper.vm.nextCell.right.delta).toEqual(0)
  })
})

describe('FocusedYear (RTL): yearRange = 12', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(PickerYear, {
      propsData: {
        translation: en,
        minimumView: 'year',
        pageDate: new Date(2021, 2, 1),
        pageTimestamp: new Date(2021, 2, 1).valueOf(),
        yearRange: 12,
        isRtl: true,
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('calculates first cell', async () => {
    const firstCell = wrapper.findComponent({ ref: '0' })
    await firstCell.trigger('focus')

    expect(wrapper.vm.nextCell.up.onOtherPage).toBe('Previous')
    expect(wrapper.vm.nextCell.up.delta).toEqual(-3)

    expect(wrapper.vm.nextCell.down.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.down.delta).toEqual(3)

    expect(wrapper.vm.nextCell.left.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.left.delta).toEqual(1)

    expect(wrapper.vm.nextCell.right.onOtherPage).toBe('Previous')
    expect(wrapper.vm.nextCell.right.delta).toEqual(-1)
  })

  it('calculates last cell', async () => {
    const lastCell = wrapper.findComponent({ ref: '11' })
    await lastCell.trigger('focus')

    expect(wrapper.vm.nextCell.up.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.up.delta).toEqual(-3)

    expect(wrapper.vm.nextCell.down.onOtherPage).toBe('Next')
    expect(wrapper.vm.nextCell.down.delta).toEqual(2)

    expect(wrapper.vm.nextCell.left.onOtherPage).toBe('Next')
    expect(wrapper.vm.nextCell.left.delta).toEqual(0)

    expect(wrapper.vm.nextCell.right.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.right.delta).toEqual(-1)
  })
})
