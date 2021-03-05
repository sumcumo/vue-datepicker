Feature: Typeable calendar
  As a user
  I want to type a date into the input field
  So that I can pick a date more easily


  Scenario: Enter a valid date and blur the input field
    Given the calendar is typeable
    And the input field is focused
    And the date is valid
    When the input field is blurred
    Then the calendar closes
    And the date is submitted
#    And no element in the calendar is focused


  Scenario: Enter an invalid date and blur the input field
    Given the calendar is typeable
    And the input field is focused
    And the date is invalid
    When the input field is blurred
    Then the calendar closes
    And the date is cleared
#    And no element in the calendar is focused


  Scenario: Enter a valid date and press the enter key
    Given the calendar is typeable
    And the input field is focused
    And the date is valid
    When the enter key is pressed
    Then the calendar closes
    And the date is submitted
    And the input field has focus


  Scenario: Enter an invalid date and press the enter key
    Given the calendar is typeable
    And the input field is focused
    And the date is invalid
    When the enter key is pressed
    Then the calendar closes
    And the date is cleared
    And the input field has focus
