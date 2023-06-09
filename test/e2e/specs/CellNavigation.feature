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


  @id-3
  Scenario Outline: Arrow <direction> to <page> page when destination and all cells beyond are disabled
    Given the calendar is open on "<openDate>" with view "<view>" and disabled dates "<toOrFrom>" "<disabled>"
    When the user presses the "<direction>" arrow
    Then the focused cell is "<focusedCell>"

    Examples:
      | # | openDate   | direction | view  | toOrFrom | disabled   | page     | focusedCell |
      | 1 | 2020-01-01 | up        | day   | to       | 2019-12-26 | previous | 26          |
      | 2 | 2020-01-31 | down      | day   | from     | 2020-02-05 | next     | 5           |
      | 3 | 2020-01-01 | up        | month | to       | 2019-12-01 | previous | December    |
      | 4 | 2019-12-31 | down      | month | from     | 2020-01-31 | next     | January     |
      | 5 | 2022-01-01 | up        | year  | to       | 2019-01-01 | previous | 2019        |
      | 6 | 2018-01-01 | down      | year  | from     | 2020-12-31 | next     | 2020        |


  @id-4
  Scenario Outline: Arrow <direction> to cell when all cells beyond destination are disabled
    Given the calendar is open on "<openDate>" with view "<view>" and disabled dates "<toOrFrom>" "<disabled>"
    When the user presses the "<direction>" arrow
    Then the focused cell is "<focusedCell>"

    Examples:
      | # | openDate   | direction | view  | toOrFrom | disabled   | focusedCell |
      | 1 | 2020-01-15 | left      | day   | to       | 2020-01-14 | 14          |
      | 2 | 2020-01-15 | right     | day   | from     | 2020-01-16 | 16          |
      | 3 | 2020-06-01 | left      | month | to       | 2020-05-15 | May         |
      | 4 | 2020-06-01 | right     | month | from     | 2020-07-15 | July        |
      | 5 | 2023-01-01 | left      | year  | to       | 2022-06-01 | 2022        |
      | 6 | 2020-01-01 | right     | year  | from     | 2021-06-01 | 2021        |
