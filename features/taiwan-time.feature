# Executable spec — mirrored by src/lib/time.test.ts (P3 / P6)
Feature: Taiwan-time schedule 台灣時間賽程
  Scenario: Convert a US night game across daylight saving time
    Given a game starts at "2026-11-01 19:10" in "America/New_York"
    When I view the schedule in "Asia/Taipei"
    Then I should see the start time "2026-11-02 08:10"

  Scenario: Postponed game
    Given the game "NYY@BOS 2026-09-20" is marked "postponed"
    When I open today's schedule
    Then I should see "延賽 Postponed" instead of a start time
    And followers of that team should receive one push notification
