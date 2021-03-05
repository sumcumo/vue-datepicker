Feature: Clear Button
  As a user
  I want to use a button
  So that I can clear the date


  Background:
    Given the calendar is closed
    And `calendar-button` is true
    And `clear-button` is true
    And a date is selected


  Scenario: Click on the clear button when the calendar is closed
    When the clear button is clicked
    Then the date is cleared
#    And the input field has focus


#  Scenario: Press enter when the clear button is focused and the calendar is closed
#    Given the clear button is focused
#    When the enter key is pressed
#    Then the date is cleared
##    And the input field has focus


# N.B. The clear button is hidden behind the open calendar, so no need to test for that
