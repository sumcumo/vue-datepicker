Feature: Cell Selection
  As a user
  I want to select a cell
  So that I pick a date


  # N.B. Until native events are supported by Cypress, we are simulating `enter` and `space bar` key presses
  # on buttons by using a `click` event.
  # See https://github.com/cypress-io/cypress/issues/311
  # and https://github.com/cypress-io/cypress/issues/8267

  @id-1
  Scenario Outline: Select a cell: minimum view: <minimumView>
    Given the calendar is open on the minimum view: "<minimumView>"
    When the user clicks on the tabbable cell
    Then the date is submitted with a value of "<date>"
    And the input field has focus

    Examples:
      | # | minimumView | date        |
      | 1 | day         | 15 Mar 2020 |
      | 2 | month       | 01 Mar 2020 |
      | 3 | year        | 01 Jan 2020 |


  @id-2
  Scenario Outline: Select a cell: higher than minimum view: <initialView>
    Given the calendar is open on a "<initialView>" view
    When the user clicks on the tabbable cell
    Then the "<view>" view is shown
    And the tabbable cell has focus

    Examples:
      | # | initialView | view  |
      | 1 | year        | month |
      | 2 | month       | day   |
