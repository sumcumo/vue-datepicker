import { shallowMount } from '@vue/test-utils'
import PickerDay from '~/components/PickerDay.vue'
import { en } from '~/locale'

describe('FocusedDate: typeable or disabled', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(PickerDay, {
      propsData: {
        translation: en,
        pageDate: new Date(2021, 2, 1),
        pageTimestamp: new Date(2021, 2, 1).valueOf(),
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('does not focus cells when calendar is typeable', async () => {
    wrapper.setProps({
      typeable: true,
    })

    const firstCell = wrapper.findComponent({ ref: '0' })
    await firstCell.trigger('focus')
    await firstCell.trigger('keydown.right')

    expect(wrapper.vm.focusedCell.id).toEqual(0)
  })

  it('does not focus disabled cells', async () => {
    wrapper.setProps({
      disabledDates: {
        dates: [new Date(2021, 2, 2)],
      },
    })
    const firstCell = wrapper.findComponent({ ref: '0' })
    await firstCell.trigger('focus')
    await firstCell.trigger('keydown.right')

    expect(wrapper.vm.focusedCell.id).toEqual(0)
  })
})

describe('FocusedDate:', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(PickerDay, {
      propsData: {
        translation: en,
        pageDate: new Date(2021, 2, 1),
        pageTimestamp: new Date(2021, 2, 1).valueOf(),
      },
      attachTo: document.body,
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('calculates first cell', async () => {
    const firstCell = wrapper.findComponent({ ref: '0' })
    await firstCell.trigger('focus')

    expect(wrapper.vm.nextCell.up.onOtherPage).toBe('Previous')
    expect(wrapper.vm.nextCell.up.delta).toEqual(-14)

    expect(wrapper.vm.nextCell.down.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.down.delta).toEqual(7)

    expect(wrapper.vm.nextCell.left.onOtherPage).toBe('Previous')
    expect(wrapper.vm.nextCell.left.delta).toEqual(-8)

    expect(wrapper.vm.nextCell.right.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.right.delta).toEqual(1)

    wrapper.vm.focusNav = jest.fn

    // N.B. The tests below simulate someone actually pressing the arrow keys
    // to change the focus (activeElement) whereas most of the other tests in
    // this file (see above) simply test whether the `nextCell` object is set
    // correctly. Not sure which is best? Perhaps both are valid?

    // key up
    await firstCell.trigger('keydown.up')
    const cellUp = wrapper.findComponent({ ref: '21' })
    expect(cellUp.element).toBe(document.activeElement)

    const firstCellOnLastRow = wrapper.findComponent({ ref: '28' })
    await firstCellOnLastRow.trigger('focus')
    await firstCellOnLastRow.trigger('keydown.down')

    // key down
    await firstCell.trigger('focus')
    await firstCell.trigger('keydown.down')
    const cellDown = wrapper.findComponent({ ref: '7' })
    expect(cellDown.element).toBe(document.activeElement)

    // key left
    await firstCell.trigger('focus')
    await firstCell.trigger('keydown.left')
    const cellLeft = wrapper.findComponent({ ref: '27' }).element
    expect(cellLeft).toBe(document.activeElement)

    await firstCellOnLastRow.trigger('focus')
    await firstCellOnLastRow.trigger('keydown.down')

    // key right
    await firstCell.trigger('focus')
    await firstCell.trigger('keydown.right')
    const cellRight = wrapper.findComponent({ ref: '1' }).element
    expect(cellRight).toBe(document.activeElement)
  })

  it('calculates last cell on first row', async () => {
    const latCellOnFirstRow = wrapper.findComponent({ ref: '6' })
    await latCellOnFirstRow.trigger('focus')

    expect(wrapper.vm.nextCell.up.onOtherPage).toBe('Previous')
    expect(wrapper.vm.nextCell.up.delta).toEqual(-8)

    expect(wrapper.vm.nextCell.down.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.down.delta).toEqual(7)

    expect(wrapper.vm.nextCell.left.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.left.delta).toEqual(-1)

    expect(wrapper.vm.nextCell.right.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.right.delta).toEqual(1)
  })

  it('calculates 1st of month cell', async () => {
    const firstOfMonthCell = wrapper.findComponent({ ref: '5' })
    await firstOfMonthCell.trigger('focus')

    expect(wrapper.vm.nextCell.up.onOtherPage).toBe('Previous')
    expect(wrapper.vm.nextCell.up.delta).toEqual(-9)

    expect(wrapper.vm.nextCell.down.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.down.delta).toEqual(7)

    expect(wrapper.vm.nextCell.left.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.left.delta).toEqual(-1)

    expect(wrapper.vm.nextCell.right.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.right.delta).toEqual(1)
  })

  it('calculates mid-month cell', async () => {
    const midMonthCell = wrapper.findComponent({ ref: '17' })
    await midMonthCell.trigger('focus')

    expect(wrapper.vm.nextCell.up.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.up.delta).toEqual(-7)

    expect(wrapper.vm.nextCell.down.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.down.delta).toEqual(7)

    expect(wrapper.vm.nextCell.left.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.left.delta).toEqual(-1)

    expect(wrapper.vm.nextCell.right.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.right.delta).toEqual(1)
  })

  it('calculates last of month cell', async () => {
    const lastOfMonthCell = wrapper.findComponent({ ref: '31' })
    await lastOfMonthCell.trigger('focus')

    expect(wrapper.vm.nextCell.up.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.up.delta).toEqual(-7)

    expect(wrapper.vm.nextCell.down.onOtherPage).toBe('Next')
    expect(wrapper.vm.nextCell.down.delta).toEqual(10)

    expect(wrapper.vm.nextCell.left.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.left.delta).toEqual(-1)

    expect(wrapper.vm.nextCell.right.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.right.delta).toEqual(1)
  })

  it('calculates first cell on last row', async () => {
    const firstCellOnLastRow = wrapper.findComponent({ ref: '28' })
    await firstCellOnLastRow.trigger('focus')

    expect(wrapper.vm.nextCell.up.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.up.delta).toEqual(-7)

    expect(wrapper.vm.nextCell.down.onOtherPage).toBe('Next')
    expect(wrapper.vm.nextCell.down.delta).toEqual(7)

    expect(wrapper.vm.nextCell.left.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.left.delta).toEqual(-1)

    expect(wrapper.vm.nextCell.right.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.right.delta).toEqual(1)
  })

  it('calculates last cell', async () => {
    const lastCell = wrapper.findComponent({ ref: '34' })
    await lastCell.trigger('focus')

    expect(wrapper.vm.nextCell.up.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.up.delta).toEqual(-7)

    expect(wrapper.vm.nextCell.down.onOtherPage).toBe('Next')
    expect(wrapper.vm.nextCell.down.delta).toEqual(13)

    expect(wrapper.vm.nextCell.left.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.left.delta).toEqual(-1)

    expect(wrapper.vm.nextCell.right.onOtherPage).toBe('Next')
    expect(wrapper.vm.nextCell.right.delta).toEqual(7)

    wrapper.vm.focusNav = jest.fn

    // key up
    await lastCell.trigger('keydown.up')
    const cellUp = wrapper.findComponent({ ref: '27' })
    expect(cellUp.element).toBe(document.activeElement)

    // key down
    await lastCell.trigger('focus')
    await lastCell.trigger('keydown.down')
    const cellDown = wrapper.findComponent({ ref: '13' })
    expect(cellDown.element).toBe(document.activeElement)

    const lastCellOnFirstRow = wrapper.findComponent({ ref: '6' })
    await lastCellOnFirstRow.trigger('focus')
    await lastCellOnFirstRow.trigger('keydown.up')

    // key left
    await lastCell.trigger('focus')
    await lastCell.trigger('keydown.left')
    const cellLeft = wrapper.findComponent({ ref: '33' }).element
    expect(cellLeft).toBe(document.activeElement)

    // key right
    await lastCell.trigger('focus')
    await lastCell.trigger('keydown.right')
    const cellRight = wrapper.findComponent({ ref: '7' }).element
    expect(cellRight).toBe(document.activeElement)
  })
})

describe('FocusedDate: (RTL)', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(PickerDay, {
      propsData: {
        translation: en,
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
    expect(wrapper.vm.nextCell.up.delta).toEqual(-14)

    expect(wrapper.vm.nextCell.down.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.down.delta).toEqual(7)

    expect(wrapper.vm.nextCell.left.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.left.delta).toEqual(1)

    expect(wrapper.vm.nextCell.right.onOtherPage).toBe('Previous')
    expect(wrapper.vm.nextCell.right.delta).toEqual(-8)
  })

  it('calculates last cell', async () => {
    const lastCell = wrapper.findComponent({ ref: '34' })
    await lastCell.trigger('focus')

    expect(wrapper.vm.nextCell.up.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.up.delta).toEqual(-7)

    expect(wrapper.vm.nextCell.down.onOtherPage).toBe('Next')
    expect(wrapper.vm.nextCell.down.delta).toEqual(13)

    expect(wrapper.vm.nextCell.left.onOtherPage).toBe('Next')
    expect(wrapper.vm.nextCell.left.delta).toEqual(7)

    expect(wrapper.vm.nextCell.right.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.right.delta).toEqual(-1)
  })
})

describe('FocusedDate: no `previous-month` dates', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(PickerDay, {
      propsData: {
        translation: en,
        pageDate: new Date(2021, 7, 1),
        pageTimestamp: new Date(2021, 7, 1).valueOf(),
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
    expect(wrapper.vm.nextCell.up.delta).toEqual(-7)

    expect(wrapper.vm.nextCell.down.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.down.delta).toEqual(7)

    expect(wrapper.vm.nextCell.left.onOtherPage).toBe('Previous')
    expect(wrapper.vm.nextCell.left.delta).toEqual(-1)

    expect(wrapper.vm.nextCell.right.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.right.delta).toEqual(1)
  })
})

describe('FocusedDate: no `next-month` dates', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(PickerDay, {
      propsData: {
        translation: en,
        pageDate: new Date(2021, 6, 1),
        pageTimestamp: new Date(2021, 6, 1).valueOf(),
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('calculates last cell', async () => {
    const lastCell = wrapper.findComponent({ ref: '34' })
    await lastCell.trigger('focus')

    expect(wrapper.vm.nextCell.up.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.up.delta).toEqual(-7)

    expect(wrapper.vm.nextCell.down.onOtherPage).toBe('Next')
    expect(wrapper.vm.nextCell.down.delta).toEqual(6)

    expect(wrapper.vm.nextCell.left.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.left.delta).toEqual(-1)

    expect(wrapper.vm.nextCell.right.onOtherPage).toBe('Next')
    expect(wrapper.vm.nextCell.right.delta).toEqual(0)
  })
})

describe('FocusedDate: no edge dates', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(PickerDay, {
      propsData: {
        translation: en,
        pageDate: new Date(2021, 2, 1),
        pageTimestamp: new Date(2021, 2, 1).valueOf(),
        showEdgeDates: false,
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('calculates first of month cell', async () => {
    const firstOfMonthCell = wrapper.findComponent({ ref: '1' })
    await firstOfMonthCell.trigger('focus')

    expect(wrapper.vm.nextCell.up.onOtherPage).toBe('Previous')
    expect(wrapper.vm.nextCell.up.delta).toEqual(-13)

    expect(wrapper.vm.nextCell.down.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.down.delta).toEqual(7)

    expect(wrapper.vm.nextCell.left.onOtherPage).toBe('Previous')
    expect(wrapper.vm.nextCell.left.delta).toEqual(-7)

    expect(wrapper.vm.nextCell.right.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.right.delta).toEqual(1)
  })

  it('calculates last cell on first row', async () => {
    const lastCellOnFirstRow = wrapper.findComponent({ ref: '6' })
    await lastCellOnFirstRow.trigger('focus')

    expect(wrapper.vm.nextCell.up.onOtherPage).toBe('Previous')
    expect(wrapper.vm.nextCell.up.delta).toEqual(-8)

    expect(wrapper.vm.nextCell.down.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.down.delta).toEqual(7)

    expect(wrapper.vm.nextCell.left.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.left.delta).toEqual(-1)

    expect(wrapper.vm.nextCell.right.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.right.delta).toEqual(1)
  })

  it('calculates first cell on second row', async () => {
    const firstCellOnSecondRow = wrapper.findComponent({ ref: '7' })
    await firstCellOnSecondRow.trigger('focus')

    expect(wrapper.vm.nextCell.up.onOtherPage).toBe('Previous')
    expect(wrapper.vm.nextCell.up.delta).toEqual(-7)

    expect(wrapper.vm.nextCell.down.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.down.delta).toEqual(7)

    expect(wrapper.vm.nextCell.left.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.left.delta).toEqual(-1)

    expect(wrapper.vm.nextCell.right.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.right.delta).toEqual(1)
  })

  it('calculates cell in the middle of the month', async () => {
    const midMonthCell = wrapper.findComponent({ ref: '17' })
    await midMonthCell.trigger('focus')

    expect(wrapper.vm.nextCell.up.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.up.delta).toEqual(-7)

    expect(wrapper.vm.nextCell.down.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.down.delta).toEqual(7)

    expect(wrapper.vm.nextCell.left.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.left.delta).toEqual(-1)

    expect(wrapper.vm.nextCell.right.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.right.delta).toEqual(1)
  })

  it('calculates last cell on penultimate row', async () => {
    const lastCellOnPenultimateRow = wrapper.findComponent({ ref: '27' })
    await lastCellOnPenultimateRow.trigger('focus')

    expect(wrapper.vm.nextCell.up.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.up.delta).toEqual(-7)

    expect(wrapper.vm.nextCell.down.onOtherPage).toBe('Next')
    expect(wrapper.vm.nextCell.down.delta).toEqual(6)

    expect(wrapper.vm.nextCell.left.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.left.delta).toEqual(-1)

    expect(wrapper.vm.nextCell.right.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.right.delta).toEqual(1)
  })

  it('calculates first cell on last row', async () => {
    const firstCellOnLastRow = wrapper.findComponent({ ref: '28' })
    await firstCellOnLastRow.trigger('focus')

    expect(wrapper.vm.nextCell.up.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.up.delta).toEqual(-7)

    expect(wrapper.vm.nextCell.down.onOtherPage).toBe('Next')
    expect(wrapper.vm.nextCell.down.delta).toEqual(7)

    expect(wrapper.vm.nextCell.left.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.left.delta).toEqual(-1)

    expect(wrapper.vm.nextCell.right.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.right.delta).toEqual(1)
  })

  it('calculates last of month cell', async () => {
    const lastOfMonthCell = wrapper.findComponent({ ref: '31' })
    await lastOfMonthCell.trigger('focus')

    expect(wrapper.vm.nextCell.up.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.up.delta).toEqual(-7)

    expect(wrapper.vm.nextCell.down.onOtherPage).toBe('Next')
    expect(wrapper.vm.nextCell.down.delta).toEqual(10)

    expect(wrapper.vm.nextCell.left.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.left.delta).toEqual(-1)

    expect(wrapper.vm.nextCell.right.onOtherPage).toBe('Next')
    expect(wrapper.vm.nextCell.right.delta).toEqual(4)
  })
})

describe('FocusedDate: no edge dates (RTL)', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(PickerDay, {
      propsData: {
        translation: en,
        pageDate: new Date(2021, 2, 1),
        pageTimestamp: new Date(2021, 2, 1).valueOf(),
        showEdgeDates: false,
        isRtl: true,
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('calculates first of month cell', async () => {
    const firstOfMonthCell = wrapper.findComponent({ ref: '1' })
    await firstOfMonthCell.trigger('focus')

    expect(wrapper.vm.nextCell.up.onOtherPage).toBe('Previous')
    expect(wrapper.vm.nextCell.up.delta).toEqual(-13)

    expect(wrapper.vm.nextCell.down.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.down.delta).toEqual(7)

    expect(wrapper.vm.nextCell.left.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.left.delta).toEqual(1)

    expect(wrapper.vm.nextCell.right.onOtherPage).toBe('Previous')
    expect(wrapper.vm.nextCell.right.delta).toEqual(-7)
  })

  it('calculates last of month cell', async () => {
    const lastOfMonthCell = wrapper.findComponent({ ref: '31' })
    await lastOfMonthCell.trigger('focus')

    expect(wrapper.vm.nextCell.up.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.up.delta).toEqual(-7)

    expect(wrapper.vm.nextCell.down.onOtherPage).toBe('Next')
    expect(wrapper.vm.nextCell.down.delta).toEqual(10)

    expect(wrapper.vm.nextCell.left.onOtherPage).toBe('Next')
    expect(wrapper.vm.nextCell.left.delta).toEqual(4)

    expect(wrapper.vm.nextCell.right.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.right.delta).toEqual(-1)
  })
})

describe('FocusedDate: no edge dates, no `previous-month` dates', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(PickerDay, {
      propsData: {
        translation: en,
        pageDate: new Date(2021, 7, 1),
        pageTimestamp: new Date(2021, 7, 1).valueOf(),
        showEdgeDates: false,
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
    expect(wrapper.vm.nextCell.up.delta).toEqual(-7)

    expect(wrapper.vm.nextCell.down.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.down.delta).toEqual(7)

    expect(wrapper.vm.nextCell.left.onOtherPage).toBe('Previous')
    expect(wrapper.vm.nextCell.left.delta).toEqual(-1)

    expect(wrapper.vm.nextCell.right.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.right.delta).toEqual(1)
  })

  it('calculates last cell on first row', async () => {
    const lastCellOnFirstRow = wrapper.findComponent({ ref: '6' })
    await lastCellOnFirstRow.trigger('focus')

    expect(wrapper.vm.nextCell.up.onOtherPage).toBe('Previous')
    expect(wrapper.vm.nextCell.up.delta).toEqual(-1)

    expect(wrapper.vm.nextCell.down.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.down.delta).toEqual(7)

    expect(wrapper.vm.nextCell.left.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.left.delta).toEqual(-1)

    expect(wrapper.vm.nextCell.right.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.right.delta).toEqual(1)
  })
})

describe('FocusedDate: no edge dates, no `previous-month` dates (RTL)', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(PickerDay, {
      propsData: {
        translation: en,
        pageDate: new Date(2021, 7, 1),
        pageTimestamp: new Date(2021, 7, 1).valueOf(),
        showEdgeDates: false,
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
    expect(wrapper.vm.nextCell.up.delta).toEqual(-7)

    expect(wrapper.vm.nextCell.down.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.down.delta).toEqual(7)

    expect(wrapper.vm.nextCell.left.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.left.delta).toEqual(1)

    expect(wrapper.vm.nextCell.right.onOtherPage).toBe('Previous')
    expect(wrapper.vm.nextCell.right.delta).toEqual(-1)
  })

  it('calculates last cell on first row', async () => {
    const lastCellOnFirstRow = wrapper.findComponent({ ref: '6' })
    await lastCellOnFirstRow.trigger('focus')

    expect(wrapper.vm.nextCell.up.onOtherPage).toBe('Previous')
    expect(wrapper.vm.nextCell.up.delta).toEqual(-1)

    expect(wrapper.vm.nextCell.down.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.down.delta).toEqual(7)

    expect(wrapper.vm.nextCell.left.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.left.delta).toEqual(1)

    expect(wrapper.vm.nextCell.right.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.right.delta).toEqual(-1)
  })
})

describe('FocusedDate: no edge dates, no `next-month` dates', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(PickerDay, {
      propsData: {
        translation: en,
        pageDate: new Date(2021, 6, 1),
        pageTimestamp: new Date(2021, 6, 1).valueOf(),
        showEdgeDates: false,
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('calculates first cell on last row', async () => {
    const firstCellOnLastRow = wrapper.findComponent({ ref: '28' })
    await firstCellOnLastRow.trigger('focus')

    expect(wrapper.vm.nextCell.up.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.up.delta).toEqual(-7)

    expect(wrapper.vm.nextCell.down.onOtherPage).toBe('Next')
    expect(wrapper.vm.nextCell.down.delta).toEqual(0)

    expect(wrapper.vm.nextCell.left.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.left.delta).toEqual(-1)

    expect(wrapper.vm.nextCell.right.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.right.delta).toEqual(1)
  })

  it('calculates last cell', async () => {
    const lastCell = wrapper.findComponent({ ref: '34' })
    await lastCell.trigger('focus')

    expect(wrapper.vm.nextCell.up.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.up.delta).toEqual(-7)

    expect(wrapper.vm.nextCell.down.onOtherPage).toBe('Next')
    expect(wrapper.vm.nextCell.down.delta).toEqual(6)

    expect(wrapper.vm.nextCell.left.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.left.delta).toEqual(-1)

    expect(wrapper.vm.nextCell.right.onOtherPage).toBe('Next')
    expect(wrapper.vm.nextCell.right.delta).toEqual(0)
  })
})

describe('FocusedDate: no edge dates, no `next-month` dates (RTL)', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(PickerDay, {
      propsData: {
        translation: en,
        pageDate: new Date(2021, 6, 1),
        pageTimestamp: new Date(2021, 6, 1).valueOf(),
        showEdgeDates: false,
        isRtl: true,
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('calculates first cell on last row', async () => {
    const firstCellOnLastRow = wrapper.findComponent({ ref: '28' })
    await firstCellOnLastRow.trigger('focus')

    expect(wrapper.vm.nextCell.up.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.up.delta).toEqual(-7)

    expect(wrapper.vm.nextCell.down.onOtherPage).toBe('Next')
    expect(wrapper.vm.nextCell.down.delta).toEqual(0)

    expect(wrapper.vm.nextCell.left.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.left.delta).toEqual(1)

    expect(wrapper.vm.nextCell.right.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.right.delta).toEqual(-1)
  })

  it('calculates last cell', async () => {
    const lastCell = wrapper.findComponent({ ref: '34' })
    await lastCell.trigger('focus')

    expect(wrapper.vm.nextCell.up.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.up.delta).toEqual(-7)

    expect(wrapper.vm.nextCell.down.onOtherPage).toBe('Next')
    expect(wrapper.vm.nextCell.down.delta).toEqual(6)

    expect(wrapper.vm.nextCell.left.onOtherPage).toBe('Next')
    expect(wrapper.vm.nextCell.left.delta).toEqual(0)

    expect(wrapper.vm.nextCell.right.onOtherPage).toBe(false)
    expect(wrapper.vm.nextCell.right.delta).toEqual(-1)
  })
})
