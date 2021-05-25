Feature: Clear Button
  As a user
  I want to use a button
  So that I can clear the date


  @id-1
  Scenario Outline: Click on clear button: <openOrClosed>
    Given the calendar is "<openOrClosed>" and a date is selected
    When the user clicks on the clear button
    Then the calendar closes
    And the date is cleared
    And the input field has focus

    Examples:
      | # | openOrClosed |
      | 1 | closed       |
      | 2 | open         |


  @id-2
  Scenario Outline: Click on clear button: typeable: <openOrClosed>
    Given the typeable calendar is "<openOrClosed>" and a date is selected
    When the user clicks on the clear button
    Then the calendar closes
    And the date is cleared
    And the input field has focus

    Examples:
      | # | openOrClosed |
      | 1 | closed       |
      | 2 | open         |


  @id-3
  Scenario: Press the enter key
    Given the calendar is closed and a date is selected
    When the user focuses the clear button and presses the enter key
    Then the calendar remains closed
    And the date is cleared
    And the input field has focus


  @id-4
  Scenario: Press the space bar
    Given the calendar is closed and a date is selected
    When the user focuses the clear button and presses the space bar
    Then the calendar remains closed
    And the date is cleared
    And the input field has focus
