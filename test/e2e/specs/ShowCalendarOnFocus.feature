Feature: Show calendar on focus
  As a user
  I want to open the calendar by focussing the input field
  So that I can open the calendar more easily


  @id-1
  Scenario: Focus input field when closed (default behaviour)
    Given the calendar is closed
    When the user focuses the input field
    Then the calendar remains closed
    And the input field has focus


  @id-2
  Scenario: Focus input field when closed and `show-calendar-on-focus` is true
    Given the calendar is closed and `show-calendar-on-focus` is true
    When the user focuses the input field
    Then the calendar opens
    And today's cell has focus


  @id-3
  Scenario Outline: Focus input field when the typeable calendar is <openOrClosed>
    Given the typeable calendar is "<openOrClosed>"
    When the user focuses the input field
    Then the calendar "<opensOrCloses>"
    And the "<element>" has focus

    Examples:
      | # | openOrClosed | opensOrCloses | element |
      | 1 | closed       | opens         | input   |
      | 2 | open         | opens         | input   |


  @id-4
  Scenario Outline: Click on the input field when <openOrClosed>
    Given the calendar is "<openOrClosed>"
    When the user clicks the input field
    Then the calendar "<opensOrCloses>"
    And the "<element>" has focus

    Examples:
      | # | openOrClosed | opensOrCloses | element    |
      | 1 | closed       | opens         | today-cell |
      | 2 | open         | closes        | input      |


  @id-5
  Scenario Outline: Click on the input field when the typeable calendar is <openOrClosed>
    Given the typeable calendar is "<openOrClosed>"
    When the user clicks the input field
    Then the calendar "<opensOrCloses>"
    And the "<element>" has focus

    Examples:
      | # | openOrClosed | opensOrCloses | element |
      | 1 | closed       | opens         | input   |
      | 2 | open         | opens         | input   |
