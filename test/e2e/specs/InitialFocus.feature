Feature: Set the initial focus
  As a user
  I want to have a sensible element focused when I open the calendar
  So that I can easily navigate the calendar


  @id-1
  Scenario Outline: Open date and <pastOrFuture> dates are disabled
    Given open date and "<pastOrFuture>" dates are disabled
    When the user clicks on the input field
    Then the calendar opens
    And the "<first-available-cell>" cell has focus

    Examples:
      | # | pastOrFuture | first-available-cell |
      | 1 | past         | next-day             |
      | 2 | future       | previous-day            |


  @id-2
  Scenario Outline: Dates this month and in the <pastOrFuture> are disabled
    Given dates this month and in the "<pastOrFuture>" are disabled
    When the user clicks on the input field
    Then the calendar opens
    And the "<element>" has focus

    Examples:
      | # | pastOrFuture | element         |
      | 1 | past         | next-button     |
      | 2 | future       | previous-button |
