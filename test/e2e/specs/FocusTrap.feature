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
#  Scenario: Press tab when the previous button is focused
#    When the user focuses the previous button and presses tab
#    Then the up button has focus
#
#  @id-2
#  Scenario: Press shift + tab when the previous button is focused
#    When the user focuses the previous button and presses shift + tab
#    Then the tabbable cell has focus
#
#
#  @id-3
#  Scenario: Press tab when the up button is focused
#    When the user focuses the up button and presses tab
#    Then the next button has focus
#
#
#  @id-4
#  Scenario: Press shift + tab when the up button is focused
#    When the user focuses the up button and presses shift + tab
#    Then the previous button has focus
#
#
#  @id-5
#  Scenario: Press tab when the next button is focused
#    When the user focuses the next button and presses tab
#    Then the tabbable cell has focus
#
#
#  @id-6
#  Scenario: Press shift + tab when the next button is focused
#    When the user focuses the next button and presses shift + tab
#    Then the up button has focus
#
#
#  @id-7
#  Scenario: Press tab when today's cell is focused
#    When the user focuses the tabbable cell and presses tab
#    Then the previous button has focus
#
#
#  @id-8
#  Scenario: Press shift + tab when today's cell is focused
#    When the user focuses the tabbable cell and presses shift + tab
#    Then the next button has focus
