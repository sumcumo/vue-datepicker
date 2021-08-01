Feature: Up Button
  As a user
  I want to use an up button
  So that I can navigate to the next view up


# N.B. The enter and space bar tests have been disabled until native events are supported by Cypress
# See https://github.com/cypress-io/cypress/issues/311
# and https://github.com/cypress-io/cypress/issues/8267

  @id-1
  Scenario Outline: Select up button by <action>
    Given the calendar is open on `Jan 2021`
    When the user performs a "<action>" action
    Then the page is `2021`
    And the up button has focus

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
  Scenario Outline: Arrow <direction> (isRtl: <isRtl>, isPrevDisabled: <isPrevDisabled>, isNextDisabled: <isNextDisabled>)
    Given the calendar is open with isRtl: "<isRtl>", isPrevDisabled: "<isPrevDisabled>", isNextDisabled: "<isNextDisabled>"
    When the user presses the "<direction>" arrow
    Then the "<element>" has focus

    Examples:
      | # | isRtl | direction | isPrevDisabled | isNextDisabled | element         |
      | 1 | false | left      | false          | false          | previous-button |
      | 2 | false | left      | true           | false          | tabbable-cell  |
      | 3 | false | right     | false          | false          | next-button     |
      | 4 | false | right     | false          | true           | tabbable-cell  |
      | 5 | true  | left      | false          | false          | next-button     |
      | 6 | true  | left      | false          | true           | tabbable-cell  |
      | 7 | true  | right     | false          | false          | previous-button |
      | 8 | true  | right     | true           | false          | tabbable-cell  |


  @id-4
  Scenario Outline: Typeable: Arrow <direction> (isRtl: <isRtl>, isPrevDisabled: <isPrevDisabled>, isNextDisabled: <isNextDisabled>)
    Given the typeable calendar is open with isRtl: "<isRtl>", isPrevDisabled: "<isPrevDisabled>", isNextDisabled: "<isNextDisabled>"
    When the user presses the "<direction>" arrow
    Then the "<element>" has focus

    Examples:
      | # | isRtl | direction | isPrevDisabled | isNextDisabled | element         |
      | 1 | false | left      | true           | false          | input           |
      | 2 | false | right     | false          | true           | input           |
      | 3 | true  | left      | false          | true           | input           |
      | 4 | true  | right     | true           | false          | input           |
      | 5 | false | up        | false          | false          | input           |
