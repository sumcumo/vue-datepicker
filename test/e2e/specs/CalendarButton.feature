Feature: Calendar Button
  As a user
  I want to use a button
  So that I can open and close the calendar


  @id-1
  Scenario Outline: Click on calendar button: <openOrClosed>
    Given the calendar is "<openOrClosed>"
    When the user clicks the calendar button
    Then the calendar "<opensOrCloses>"
    And the "<element>" has focus

    Examples:
      | # | openOrClosed | opensOrCloses | element         |
      | 1 | closed       | opens         | today-cell      |
      | 2 | open         | closes        | calendar-button |


  @id-2
  Scenario Outline: Click on calendar button: typeable, <openOrClosed> & <validity> date
    Given the typeable calendar is "<openOrClosed>" and a "<validity>" date is typed
    When the user clicks the calendar button
    Then the calendar "<opensOrCloses>"
    And the date is "<formattedOrCleared>"
    And the "<element>" has focus

    Examples:
      | # | openOrClosed | validity | opensOrCloses | formattedOrCleared | element         |
      | 1 | closed       | valid    | opens         | formatted          | input           |
      | 2 | closed       | invalid  | opens         | cleared            | input           |
      | 3 | open         | valid    | closes        | formatted          | calendar-button |
      | 4 | open         | invalid  | closes        | cleared            | calendar-button |


# N.B. These tests have been disabled until native events are supported by Cypress
# See https://github.com/cypress-io/cypress/issues/311
# and https://github.com/cypress-io/cypress/issues/8267

#  @id-3
#  Scenario: Press the enter key
#    Given the calendar is closed
#    When the user presses the enter key
#    Then the calendar opens
#    And today's cell has focus


#  @id-4
#  Scenario Outline: Press the enter key: typeable, <openOrClosed>, <validity> date
#    Given the typeable calendar is "<openOrClosed>" and a "<validity>" date is typed
#    When the user presses the enter key
#    Then the calendar "<opensOrCloses>"
#    And the date is "<formattedOrCleared>"
#    And the input has focus
#
#    Examples:
#      | # | openOrClosed | validity | opensOrCloses | formattedOrCleared |
#      | 1 | closed       | valid    | opens         | formatted          |
#      | 2 | closed       | invalid  | opens         | cleared            |


#  @id-5
#  Scenario: Press the space bar
#    Given the calendar is closed
#    When the user presses the space bar
#    Then the calendar opens
#    And today's cell has focus


#  @id-6
#  Scenario Outline: Press the space bar: typeable, <openOrClosed>, <validity> date
#    Given the typeable calendar is "<openOrClosed>" and a "<validity>" date is typed
#    When the user presses the space bar
#    Then the calendar "<opensOrCloses>"
#    And the date is "<formattedOrCleared>"
#    And the input has focus
#
#    Examples:
#      | # | openOrClosed | validity | opensOrCloses | formattedOrCleared |
#      | 1 | closed       | valid    | opens         | formatted          |
#      | 2 | closed       | invalid  | opens         | cleared            |
