Feature: Set the initial focus
  As a user
  I want to have a sensible element focused when I open the calendar
  So that I can easily navigate the calendar


  @id-1
  Scenario Outline: initialView is <initialView>
    Given the initialView is "<initialView>"
    When the user opens the calendar
    Then the calendar opens
    And the focusable-cell cell for "<initialView>" has focus

    Examples:
      | # | initialView |
      | 1 | day         |
      | 2 | month       |
      | 2 | year        |


  @id-2
  Scenario Outline: Day view when <pastOrFuture> dates are disabled
    Given a day view where "<pastOrFuture>" dates are disabled
    When the user opens the calendar
    Then the calendar opens
    And the "<first-available-cell>" day cell has focus

    Examples:
      | # | pastOrFuture | first-available-cell |
      | 1 | past         | next-day             |
      | 2 | future       | previous-day         |


  @id-3
  Scenario Outline: Month view when <pastOrFuture> dates are disabled
    Given a month view where "<pastOrFuture>" dates are disabled
    When the user opens the calendar
    Then the calendar opens
    And the "<first-available-cell>" month cell has focus

    Examples:
      | # | pastOrFuture | first-available-cell |
      | 1 | past         | next-month           |
      | 2 | future       | previous-month       |


  @id-4
  Scenario Outline: Year view when <pastOrFuture> dates are disabled
    Given a year view where "<pastOrFuture>" dates are disabled
    When the user opens the calendar
    Then the calendar opens
    And the "<first-available-cell>" cell has focus

    Examples:
      | # | pastOrFuture | first-available-cell |
      | 1 | past         | next-year            |
      | 2 | future       | previous-year        |


  @id-5
  Scenario Outline: Dates this month and in the <pastOrFuture> are disabled
    Given dates this month and in the "<pastOrFuture>" are disabled
    When the user opens the calendar
    Then the calendar opens
    And the "<element>" has focus

    Examples:
      | # | pastOrFuture | element         |
      | 1 | past         | next-button     |
      | 2 | future       | previous-button |


  @id-6
  Scenario Outline: Dates this year and in the <pastOrFuture> are disabled
    Given dates this year and in the "<pastOrFuture>" are disabled
    When the user opens the calendar
    Then the calendar opens
    And the "<element>" has focus

    Examples:
      | # | pastOrFuture | element         |
      | 1 | past         | next-button     |
      | 2 | future       | previous-button |


  @id-7
  Scenario Outline: Dates this decade and in the <pastOrFuture> are disabled
    Given dates this decade and in the "<pastOrFuture>" are disabled
    When the user opens the calendar
    Then the calendar opens
    And the "<element>" has focus

    Examples:
      | # | pastOrFuture | element         |
      | 1 | past         | next-button     |
      | 2 | future       | previous-button |
