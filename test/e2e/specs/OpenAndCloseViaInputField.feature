Feature: Open and close the calendar via the input field
  As a user
  I want to interact with the input field
  So that I can open and close the calendar


  Scenario: Click on the input field when the calendar is closed
    Given the calendar is closed
    When a user clicks on the input field
    Then the calendar opens
#    And today's cell has focus


  Scenario: Click on the input field when the calendar is open
    Given the calendar is open
    When a user clicks on the input field
    Then the calendar closes
    And the input field has focus


  Scenario: Blur the input field when the calendar is closed
    Given the calendar is closed
    And the input field is focused
    When the input field is blurred
    Then the calendar remains closed
#    And no element in the calendar is focused

  Scenario: Blur the input field when the calendar is open
    Given the calendar is open
    And the input field is focused
    When the input field is blurred
    Then the calendar closes
#    And no element in the calendar is focused

