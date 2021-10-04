Feature: Cell Navigation
  As a user
  I want to focus a cell
  So that I can navigate the picker


  @id-1
  Scenario Outline: Arrow <direction> (isRtl: <isRtl>)
    Given the calendar is open on "<openDate>" and isRtl is "<isRtl>"
    When the user presses the "<direction>" arrow
    Then the "<newDate>" has focus

    Examples:
      | # | isRtl | openDate   | direction | newDate    |
      | 1 | false | 2020-01-15 | up        | 2020-01-08 |
      | 2 | false | 2020-01-15 | down      | 2020-01-22 |
      | 3 | false | 2020-01-15 | left      | 2020-01-14 |
      | 4 | true  | 2020-01-15 | left      | 2020-01-16 |
      | 5 | false | 2020-01-15 | right     | 2020-01-16 |
      | 6 | true  | 2020-01-15 | right     | 2020-01-14 |


  @id-2
  Scenario Outline: Arrow <direction> to <page> page
    Given the calendar is open on "<openDate>"
    When the user presses the "<direction>" arrow
    Then the picker slides to the "<slideDirection>"
    And the "<newDate>" has focus

    Examples:
      | # | openDate   | direction | slideDirection | page     | newDate    |
      | 1 | 2020-01-01 | up        | left           | previous | 2019-12-25 |
      | 2 | 2021-01-31 | down      | right          | next     | 2021-02-07 |
      | 3 | 2020-01-01 | left      | left           | previous | 2019-12-31 |
      | 4 | 2020-01-31 | right     | right          | next     | 2020-02-01 |
