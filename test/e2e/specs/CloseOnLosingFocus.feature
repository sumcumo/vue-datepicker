Feature: Close on losing focus
  As a user
  I want to make the calendar lose focus
  So that I can close it


  @id-1
  Scenario Outline: Click outside: <openOrClosed>
    Given the calendar is "<openOrClosed>"
    And the input field is focused
    When the user clicks the body
    Then the calendar "<opensOrCloses>"
    And no element has focus

    Examples:
      | # | openOrClosed | opensOrCloses |
      | 1 | closed       | closes        |
      | 2 | open         | closes        |


  @id-2
  Scenario Outline: Click outside: typeable, <openOrClosed>, <validity>
    Given the typeable calendar is "<openOrClosed>" and a "<validity>" date is typed
    And the input field is focused
    When the user clicks the body
    Then the calendar "<opensOrCloses>"
    And the date is "<formattedOrCleared>"
    And no element has focus

    Examples:
      | # | openOrClosed | validity | opensOrCloses | formattedOrCleared |
      | 1 | closed       | valid    | closes        | formatted          |
      | 2 | closed       | invalid  | closes        | cleared            |
      | 3 | open         | valid    | closes        | formatted          |
      | 4 | open         | invalid  | closes        | cleared            |
