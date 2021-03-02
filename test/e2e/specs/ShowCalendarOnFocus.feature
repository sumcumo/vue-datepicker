Feature: Show calendar on focus
  As a user
  I want to open the calendar by focussing the input field
  So that I can open the calendar more easily


  Scenario: Focus the input field when the calendar is closed (default behaviour)
    Given the calendar is closed
    When the input field is focused
    Then the calendar remains closed
    And the input field has focus


  Scenario: Focus the input field when the calendar is closed and `show-calendar-on-focus` is true
    Given the calendar is closed
    And `show-calendar-on-focus` is true
    When the input field is focused
    Then the calendar opens
#    And today's cell has focus


# This test may become more relevant once focus trapping is implemented
# and the calendar is `typeable`.
   Scenario: Focus the input field when the calendar is open (default behaviour)
    Given the calendar is open
    When the input field is focused
    Then the calendar remains open
    And the input field has focus


# This test may become more relevant once focus trapping is implemented
# and the calendar is `typeable`.
   Scenario: Focus the input field when the calendar is open and `show-calendar-on-focus` is true
    Given the calendar is open
    And `show-calendar-on-focus` is true
    When the input field is focused
    Then the calendar remains open
    And the input field has focus
