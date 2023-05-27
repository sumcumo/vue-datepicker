Feature: Close on escape
  As a user
  I want to press the escape key
  So that I can revert to today's date or close the calendar


  @id-1
  Scenario Outline: Close by pressing escape on the <element>
    Given the calendar is open
    When the user focuses the "<element>" and presses escape
    Then the calendar closes
    And the input field has focus

    Examples:
      | # | element         |
      | 1 | open-date       |
      | 2 | previous-button |
      | 3 | up-button       |
      | 4 | next-button     |


  @id-2
  Scenario Outline: Revert to open date when the focused cell is on the same page: <minimumView>
    Given the calendar is open on a "<minimumView>" view
    When the user focuses another cell on the same "<minimumView>" view and presses the escape key
    Then the open date has focus

    Examples:
      | # | minimumView |
      | 1 | day         |
      | 2 | month       |
      | 3 | year        |

  @id-3
  Scenario Outline: Revert to open date when the focused cell is on a different page: <minimumView>
    Given the calendar is open on a "<minimumView>" view
    And the user visits another page
    When the user focuses another cell on the new "<minimumView>" view and presses the escape key
    Then the open date has focus

    Examples:
      | # | minimumView |
      | 1 | day         |
      | 2 | month       |
      | 3 | year        |


  @id-4
  Scenario Outline: Revert to open date when the focused cell is on a different view: <initialView>
    Given the calendar is open with a "<initialView>" initial view
    When the user focuses a cell and presses the escape key
    Then the open date on the minimum view has focus

    Examples:
      | # | initialView |
      | 1 | month       |
      | 2 | year        |
