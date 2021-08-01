Feature: Previous Button
  As a user
  I want to use a previous button
  So that I can navigate to the previous page


# N.B. The enter and space bar tests have been disabled until native events are supported by Cypress
# See https://github.com/cypress-io/cypress/issues/311
# and https://github.com/cypress-io/cypress/issues/8267

  @id-1
  Scenario Outline: Select by <action>
    Given the calendar is open on `Jan 2021`
    When the user performs a "<action>" action
    Then the page is `Dec 2020`
    And the previous button has focus

    Examples:
      | # | action |
      | 1 | click  |
#      | 2 | enter  |
#      | 3 | space  |

  @id-2
  Scenario: Arrow down to tabbable cell
    Given the calendar is open on `Jan 2021`
    When the user presses the `down` arrow
    Then the tabbable cell has focus


  @id-3
  Scenario Outline: Arrow <direction> (isRtl: <isRtl>, isMaximumView: <isMaximumView>, isNextDisabled: <isNextDisabled>)
    Given the calendar is open with isRtl: "<isRtl>", isMaximumView: "<isMaximumView>", isNextDisabled: "<isNextDisabled>"
    When the user presses the "<direction>" arrow
    Then the "<element>" has focus

    Examples:
      | # | isRtl | direction | isMaximumView | isNextDisabled | element        |
      | 1 | false | right     | false         | false          | up-button      |
      | 2 | false | right     | true          | false          | next-button    |
      | 3 | false | right     | true          | true           | tabbable-cell |
      | 4 | true  | left      | false         | false          | up-button      |
      | 5 | true  | left      | true          | false          | next-button    |
      | 6 | true  | left      | true          | true           | tabbable-cell |


  @id-4
  Scenario: Typeable: arrow up to input
    Given the typeable calendar is open
    When the user presses the `up` arrow
    Then the input has focus
