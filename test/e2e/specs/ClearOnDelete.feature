Feature: Clear date on delete
  As a user
  I want to press the delete or backspace key
  So that I can clear the date


  @id-1
  Scenario Outline: Clear date via "<key>"
    Given the calendar has a selected date
    When the user focuses the input field and presses "<key>"
    Then the date is cleared
    And the input field has focus

    Examples:
      | # | key       |
      | 1 | backspace |
      | 2 | del       |


  @id-2
  Scenario Outline: Clear inline date via "<key>"
    Given the inline calendar has a selected date
    When the user focuses any element and presses "<key>"
    Then the date is cleared
    And the same element has focus

    Examples:
      | # | key       |
      | 1 | backspace |
      | 2 | del       |
