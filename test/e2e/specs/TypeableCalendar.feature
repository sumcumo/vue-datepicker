Feature: Typeable calendar
  As a user
  I want to type a date into the input field
  So that I can pick a date more easily


  @id-1
  Scenario Outline: Press the enter key: <openOrClosed> & <validity> date
    Given the typeable calendar is "<openOrClosed>" and a "<validity>" date is typed
    When the user presses the enter key
    Then the calendar "<opensOrCloses>"
    And the date is "<formattedOrCleared>"
    And the input has focus

    Examples:
      | # | openOrClosed | validity | opensOrCloses | formattedOrCleared |
      | 1 | closed       | valid    | closes        | formatted          |
      | 2 | closed       | invalid  | closes        | cleared            |
      | 3 | open         | valid    | closes        | formatted          |
      | 4 | open         | invalid  | closes        | cleared            |


  @id-2
  Scenario Outline: Press the down arrow: <openOrClosed> & <validity> date
    Given the typeable calendar is "<openOrClosed>" and a "<validity>" date is typed
    When the user presses the `down` arrow
    Then the calendar "<opensOrCloses>"
    And the date is "<formattedOrCleared>"
    And the previous button has focus

    Examples:
      | # | openOrClosed | validity | opensOrCloses | formattedOrCleared |
      | 1 | open         | valid    | opens         | formatted          |
      | 2 | open         | invalid  | opens         | cleared            |


  @id-3
  Scenario Outline: Press the down arrow (no header): <openOrClosed> & <validity> date
    Given the typeable calendar with no header is "<openOrClosed>" and a "<validity>" date is typed
    When the user presses the `down` arrow
    Then the calendar "<opensOrCloses>"
    And the date is "<formattedOrCleared>"
    And the tabbable cell has focus

    Examples:
      | # | openOrClosed | validity | opensOrCloses | formattedOrCleared |
      | 1 | open         | valid    | opens         | formatted          |
      | 2 | open         | invalid  | opens         | cleared            |
