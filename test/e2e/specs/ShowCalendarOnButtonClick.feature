Feature: Show calendar on button click
  As a user
  I want to open and close the calendar ONLY via the calendar button
  So that I can... hmm, well I'm not really sure of the benefit?


  @id-1
  Scenario Outline: Click on the calendar button when <openOrClosed>
    Given the calendar is "<openOrClosed>"
    When the user clicks the calendar button
    Then the calendar "<opensOrCloses>"
    And the "<element>" has focus

    Examples:
      | # | openOrClosed | opensOrCloses | element         |
      | 1 | closed       | opens         | today-cell      |
      | 2 | open         | closes        | calendar-button |


  @id-2
  Scenario Outline: Click on the input field when <openOrClosed>
    Given the calendar is "<openOrClosed>"
    When the user clicks on the input field
    Then the calendar remains "<openOrClosed>"
    And the input field has focus

    Examples:
      | # | openOrClosed |
      | 1 | closed       |
      | 2 | open         |


  @id-3
  Scenario Outline: Focus input field when <openOrClosed> and `show-calendar-on-focus` is true
    Given the calendar is "<openOrClosed>"
    And `show-calendar-on-focus` is true
    When the user focuses the input field
    Then the calendar remains "<openOrClosed>"
    And the input field has focus

    Examples:
      | # | openOrClosed |
      | 1 | closed       |


  @id-4
  Scenario Outline: Focus the typeable input field when <openOrClosed> and `show-calendar-on-focus` is true
    Given the typeable calendar is "<openOrClosed>"
    And `show-calendar-on-focus` is true
    When the user focuses the input field
    Then the calendar remains "<openOrClosed>"
    And the input field has focus

    Examples:
      | # | openOrClosed |
      | 1 | closed       |
      | 2 | open         |
