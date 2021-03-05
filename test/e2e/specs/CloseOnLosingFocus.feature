Feature: Close on losing focus
  As a user
  I want to make the calendar lose focus
  So that I can close it


  Scenario: Click outside
    Given the calendar is open
    When the body is clicked
    Then the calendar closes
#    And no element in the calendar is focused
