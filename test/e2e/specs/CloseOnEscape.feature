Feature: Close on escape
  As a user
  I want to press the escape key
  So that I can revert to today's date or close the calendar


  @id-1
  Scenario Outline: Clear date when a typeable calendar is <openOrClosed> and <validity>
    Given the typeable calendar is "<openOrClosed>" and a "<validity>" date is typed
    When the user focuses the input field and presses escape
    Then the calendar "<opensOrCloses>"
    And the input field has focus

    Examples:
      | # | openOrClosed | validity | opensOrCloses |
      | 1 | closed       | valid    | closes        |
      | 2 | closed       | invalid  | closes        |
      | 3 | open         | valid    | closes        |
      | 4 | open         | invalid  | closes        |


  @id-2
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


  @id-3
  Scenario: Revert to open date when the focused cell is on the same page
    Given the calendar is open
    When the user focuses another cell and presses the escape key
    Then the open date has focus


  @id-4
  Scenario: Revert to open date when the focused cell is on a different page
    Given the calendar is open
    And the user visits another page
    When the user focuses a cell and presses the escape key
    Then the open date has focus


  @id-5
  Scenario: Revert to open date when the focused cell is on a different view
    Given the calendar is open
    And the user visits the next view up
    When the user focuses a cell and presses the escape key
    Then the open date has focus
