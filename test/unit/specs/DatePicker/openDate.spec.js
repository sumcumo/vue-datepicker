import { shallowMount } from '@vue/test-utils'
import DatePicker from '~/components/DatePicker.vue'

describe('Datepicker shallowMounted', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(DatePicker)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it("defaults to today's date if no open date is set", () => {
    const today = new Date()
    expect(wrapper.vm.pageDate.getMonth()).toEqual(today.getMonth())
    expect(wrapper.vm.pageDate.getFullYear()).toEqual(today.getFullYear())
  })

  it("defaults to today's date when invalid", async () => {
    const today = new Date()

    await wrapper.setProps({
      openDate: 'invalid',
    })

    expect(wrapper.vm.pageDate.getMonth()).toEqual(today.getMonth())
    expect(wrapper.vm.pageDate.getFullYear()).toEqual(today.getFullYear())
  })

  it('accepts an instance of a date object', async () => {
    await wrapper.setProps({
      openDate: new Date(2016, 9, 12),
    })

    expect(wrapper.vm.pageDate.getMonth()).toEqual(9)
    expect(wrapper.vm.pageDate.getFullYear()).toEqual(2016)
  })

  it('accepts a string value', async () => {
    await wrapper.setProps({
      openDate: '2016-10-12',
      useUtc: true,
    })

    expect(wrapper.vm.pageDate.getMonth()).toEqual(9)
    expect(wrapper.vm.pageDate.getFullYear()).toEqual(2016)
  })

  it('accepts a timestamp value', async () => {
    await wrapper.setProps({
      openDate: new Date(2016, 9, 12).valueOf(),
    })

    expect(wrapper.vm.pageDate.getMonth()).toEqual(9)
    expect(wrapper.vm.pageDate.getFullYear()).toEqual(2016)
  })
})

describe('Datepicker shallowMounted with open date', () => {
  let wrapper
  const openDate = new Date(2016, 9, 12)

  beforeEach(() => {
    wrapper = shallowMount(DatePicker, {
      props: {
        openDate,
      },
    })
  })

  afterEach(() => {
    wrapper.unmount()
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
