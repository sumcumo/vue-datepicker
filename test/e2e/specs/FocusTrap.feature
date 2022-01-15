Feature: Focus Trap
  As a user
  I want to tab through only the main elements
  So that I can easily navigate the calendar


#  Unfortunately, tabbing is not yet fully implemented in Cypress
#  See https://github.com/cypress-io/cypress/issues/299
#  and https://github.com/cypress-io/cypress/issues/311

#  Background:
#    Given the calendar is open
#
#
#  @id-1
#  Scenario: Tab forwards when the previous button is focused
#    When the user focuses the previous button and tabs forwards
#    Then the up button has focus
#
#  @id-2
#  Scenario: Tab backwards when the previous button is focused
#    When the user focuses the previous button and tabs backwards
#    Then the tabbable cell has focus
#
#
#  @id-3
#  Scenario: Tab forwards when the up button is focused
#    When the user focuses the up button and tabs forwards
#    Then the next button has focus
#
#
#  @id-4
#  Scenario: Tab backwards when the up button is focused
#    When the user focuses the up button and tabs backwards
#    Then the previous button has focus
#
#
#  @id-5
#  Scenario: Tab forwards when the next button is focused
#    When the user focuses the next button and tabs forwards
#    Then the tabbable cell has focus
#
#
#  @id-6
#  Scenario: Tab backwards when the next button is focused
#    When the user focuses the next button and tabs backwards
#    Then the up button has focus
#
#
#  @id-7
#  Scenario: Tab forwards when today's cell is focused
#    When the user focuses the tabbable cell and tabs forwards
#    Then the previous button has focus
#
#
#  @id-8
#  Scenario: Tab backwards when today's cell is focused
#    When the user focuses the tabbable cell and tabs backwards
#    Then the next button has focus
#
#
#  @id-9
#  Scenario: Inline calendar: Tab forwards when last element is focused
#    When the user focuses the last element and tabs forwards
#    Then the next element on the page has focus
#
#
#  @id-10
#  Scenario: Inline calendar: Tab backwards when first element is focused
#    When the user focuses the first element and tabs backwards
#    Then the previous element on the page has focus
