Feature: Next Button
  As a user
  I want to use a next button
  So that I can navigate to the next page


# N.B. The enter and space bar tests have been disabled until native events are supported by Cypress
# See https://github.com/cypress-io/cypress/issues/311
# and https://github.com/cypress-io/cypress/issues/8267

  @id-1
  Scenario Outline: Select by <action>
    Given the calendar is open on `Dec 2020`
    When the user performs a "<action>" action
    Then the page is `Jan 2021`
    And the next button has focus

    Examples:
      | # | action |
      | 1 | click  |
#      | 2 | enter  |
#      | 3 | space  |

  @id-2
  Scenario: Arrow down to tabbable cell
    Given the calendar is open on `Dec 2020`
    When the user presses the `down` arrow
    Then the tabbable cell has focus


  @id-3
  Scenario Outline: Arrow <direction> (isRtl: <isRtl>, isMaximumView: <isMaximumView>, isPrevDisabled: <isPrevDisabled>)
    Given the calendar is open with isRtl: "<isRtl>", isMaximumView: "<isMaximumView>", isPrevDisabled: "<isPrevDisabled>"
    When the user presses the "<direction>" arrow
    Then the "<element>" has focus

    Examples:
      | # | isRtl | direction | isMaximumView | isPrevDisabled | element         |
      | 1 | false | left      | false         | false          | up-button       |
      | 2 | false | left      | true          | false          | previous-button |
      | 3 | false | left      | true          | true           | tabbable-cell  |
      | 4 | true  | right     | false         | false          | up-button       |
      | 5 | true  | right     | true          | false          | previous-button |
      | 6 | true  | right     | true          | true           | tabbable-cell  |


  @id-4
  Scenario: Typeable: arrow up to input
    Given the typeable calendar is open
    When the user presses the `up` arrow
    Then the input has focus
