import { mount } from '@vue/test-utils'
import PickerDay from '~/components/PickerDay'
import { en } from '~/locale'

describe('PickerDay: changing months', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(PickerDay, {
      propsData: {
        translation: en,
        allowedToShowView: () => true,
        selectedDate: new Date(2018, 2, 24),
        pageDate: new Date(2018, 1, 1),
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('can set the next month', () => {
    wrapper.vm.nextMonth()
    expect(wrapper.emitted()['changed-month']).toBeTruthy()
    expect(wrapper.emitted()['changed-month'][0][0].getMonth()).toEqual(2)
  })

  it('can set the previous month', () => {
    wrapper.vm.previousMonth()
    expect(wrapper.emitted()['changed-month']).toBeTruthy()
    expect(wrapper.emitted()['changed-month'][0][0].getMonth()).toEqual(0)
  })
})
