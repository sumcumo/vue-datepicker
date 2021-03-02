Feature: Show calendar on button click
  As a user
  I want to open and close the calendar ONLY via the calendar button
  So that I can... hmm, well I'm not really sure of the benefit?


  Scenario: Click on the calendar button when the calendar is closed
    Given the calendar is closed
    And `calendar-button` is true
    And `show-calendar-on-button-click` is true
    When the calendar button is clicked
    Then the calendar opens
#    And today's cell has focus


  Scenario: Click on the calendar button when the calendar is open
    Given the calendar is open
    And `calendar-button` is true
    And `show-calendar-on-button-click` is true
    When the calendar button is clicked
    Then the calendar closes
#    And the calendar button has focus


  Scenario: Click on the input field when the calendar is closed
    Given the calendar is closed
    And `show-calendar-on-button-click` is true
    When a user clicks on the input field
    Then the calendar remains closed
    And the input field has focus


# This test may no longer be valid once focus trapping is implemented
# (unless the calendar is `typeable`, perhaps?)
  Scenario: Click on the input field when when the calendar is open
    Given the calendar is open
    And `show-calendar-on-button-click` is true
    When a user clicks on the input field
    Then the calendar remains open
    And the input field has focus


  Scenario: Focus the input field when the calendar is closed
    Given the calendar is closed
    And `show-calendar-on-button-click` is true
    When the input field is focused
    Then the calendar remains closed
    And the input field has focus


#  N.B. Current behaviour is for `show-calendar-on-focus` to override
#  `show-calendar-on-button-click`. So, really the only benefit of using
#  the latter is to disable the ability to open/close by clicking on the input.
#  Were we to change the prop to `only-toggle-via-button`, the following test
#  would need to pass:

#  Scenario: Focus the input field when the calendar is closed and `show-calendar-on-focus` is true
#    Given the calendar is closed
#    And `show-calendar-on-button-click` is true
#    And `show-calendar-on-focus` is true
#    When the input field is focused
#    Then the calendar remains closed
#    And the input field has focus
