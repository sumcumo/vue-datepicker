Feature: Cell Selection
  As a user
  I want to select a cell
  So that I pick a date

# N.B. The enter and space bar tests have been disabled until native events are supported by Cypress
# See https://github.com/cypress-io/cypress/issues/311
# and https://github.com/cypress-io/cypress/issues/8267

  @id-1
  Scenario Outline: Select by <action>: minimum view
    Given the calendar is open on the minimum view
    When the user performs a "<action>" action
    Then the date is submitted
    And the input field has focus

    Examples:
      | # | action |
      | 1 | click  |
#      | 2 | enter  |
#      | 3 | space  |


  @id-2
  Scenario Outline: Select by <action>: NOT minimum view
    Given the calendar is open on a higher than minimum view
    When the user performs a "<action>" action
    Then the `day` view is shown
    And the tabbable cell has focus

    Examples:
      | # | action |
      | 1 | click  |
#      | 2 | enter  |
#      | 3 | space  |
