Feature: Cell Selection
  As a user
  I want to select a cell
  So that I pick a date


  @id-1
  Scenario Outline: Select by <action>: minimum view
    Given the calendar is open on the minimum view
    When the user performs a "<action>" action
    Then the date is submitted
    And the input field has focus

    Examples:
      | # | action |
      | 1 | click  |
      | 2 | enter  |
      | 3 | space  |


  @id-2
  Scenario Outline: Select by <action>: NOT minimum view
    Given the calendar is open on a higher than minimum view
    When the user performs a "<action>" action
    Then the `day` view is shown
    And the tabbable cell has focus

    Examples:
      | # | action |
      | 1 | click  |
      | 2 | enter  |
      | 3 | space  |
