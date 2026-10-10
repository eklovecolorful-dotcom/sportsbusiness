Feature: Game-trip inquiry 觀賽詢價 (UC-03)
  Scenario: NBA trip inquiry is forwarded
    When I submit an NBA inquiry for "2027-01-10" to "2027-01-15" for 2 people
    Then the inquiry status should be "new"
    And the partner agency should receive one email

  Scenario: 2027 MLB trip before the CBA is signed
    Given MLB_CBA_SETTLED is "false"
    When I submit an MLB inquiry for "2027-04-01" to "2027-04-07"
    Then the inquiry status should be "waitlist"
    And I should see the CBA risk notice
    And the partner agency should not be emailed
