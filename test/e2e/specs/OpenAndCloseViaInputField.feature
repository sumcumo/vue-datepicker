Feature: Open and close the calendar via the input field
  As a user
  I want to interact with the input field
  So that I can open and close the calendar


  @id-1
  Scenario Outline: Click on input field: <openOrClosed>
    Given the calendar is "<openOrClosed>"
    When the user clicks on the input field
    Then the calendar "<opensOrCloses>"
    And the "<element>" has focus

    Examples:
      | # | openOrClosed | opensOrCloses | element    |
      | 1 | closed       | opens         | today-cell |
      | 2 | open         | closes        | input      |


  @id-2
  Scenario: Press space bar: closed
    Given the calendar is closed
    When the user focuses input field and presses the space bar
    Then the calendar opens
    And today's cell has focus
