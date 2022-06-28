import { shallowMount } from '@vue/test-utils'
import Datepicker from '~/components/Datepicker.vue'

describe('Datepicker shallowMounted', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Datepicker)
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it("shows today's date if no open date is set", () => {
    const today = new Date()
    expect(wrapper.vm.pageDate.getMonth()).toEqual(today.getMonth())
    expect(wrapper.vm.pageDate.getFullYear()).toEqual(today.getFullYear())
  })
})

describe('Datepicker shallowMounted with open date', () => {
  let wrapper
  const openDate = new Date(2016, 9, 12)

  beforeEach(() => {
    wrapper = shallowMount(Datepicker, {
      propsData: {
        openDate,
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('accepts an instance of a date object', () => {
    expect(wrapper.vm.pageDate.getMonth()).toEqual(9)
    expect(wrapper.vm.pageDate.getFullYear()).toEqual(2016)
  })

  it("sets pageTimestamp to be first day of open date's month", () => {
    const date = new Date(wrapper.vm.pageTimestamp)
    expect(wrapper.vm.openDate.valueOf()).toEqual(openDate.valueOf())
    wrapper.vm.setPageDate()
    expect(date.getFullYear()).toEqual(openDate.getFullYear())
    expect(date.getMonth()).toEqual(openDate.getMonth())
    expect(date.getDate()).toEqual(1)
  })

  it('opens with selected date if one is set', () => {
    const newDate = new Date(2018, 10, 9)
    wrapper.vm.handleSelect({ timestamp: newDate.valueOf() })
    expect(wrapper.vm.pageDate.getMonth()).toEqual(10)
    expect(wrapper.vm.pageDate.getFullYear()).toEqual(2018)
  })
})
