Feature: Close on escape
  As a user
  I want to make the calendar lose focus
  So that I can close it


  Scenario: Press the escape key
    Given the calendar is open
    When the escape key is pressed
    Then the calendar closes
    And the input field is focused
