Feature: Calendar Button
  As a user
  I want to use a button
  So that I can open and close the calendar


  Scenario: Click on the calendar button when the calendar is closed
    Given the calendar is closed
    And `calendar-button` is true
    When the calendar button is clicked
    Then the calendar opens
#    And today's cell has focus


  Scenario: Click on the calendar button when the calendar is open
    Given the calendar is open
    And `calendar-button` is true
    When the calendar button is clicked
    Then the calendar closes
#    And the calendar button has focus


#  Scenario: Press enter when the calendar button is focused and the calendar is closed
#    Given the calendar is closed
#    And `calendar-button` is true
#    And the calendar button is focused
#    When the enter key is pressed
#    Then the calendar opens
##    And today's cell has focus


#  Scenario: Press space when the calendar button is focused and the calendar is closed
#    Given the calendar is closed
#    And `calendar-button` is true
#    And the calendar button is focused
#    When the space bar is pressed
#    Then the calendar opens
##    And today's cell has focus

