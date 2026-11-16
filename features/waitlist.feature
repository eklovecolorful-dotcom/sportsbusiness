Feature: Waitlist 候補登記＋付費意願 (UC-02, BILLING_MODE=waitlist)
  Payments are off at launch (docs/02-strategy.md §4). Readers join a free
  waitlist and tell us whether they would pay NT$150/month or NT$1,500/year.

  Background:
    Given BILLING_MODE is "waitlist"

  Scenario: Join the waitlist with a monthly intent
    When I submit the waitlist form with email "fan@example.com" and intent "monthly_150"
    Then one waitlist row should exist for "fan@example.com" with intent "monthly_150"
    And I should see "已加入候補 You're on the list"
    And "fan@example.com" should receive one welcome email

  Scenario: Same email signs up twice
    Given "Fan@Example.com" is already on the waitlist with intent "free_only"
    When I submit the waitlist form with email "fan@example.com " and intent "yearly_1500"
    Then exactly one waitlist row should exist for "fan@example.com"
    And its intent should be "yearly_1500"
    And I should see "你已在名單中 You're already on the list"
    And no second welcome email should be sent

  Scenario: Arrive from a tracked link
    Given I open "/insights/mlb-lockout?utm_source=threads&utm_medium=social&utm_campaign=lockout-2026"
    When I join the waitlist with email "a@example.com" and intent "monthly_150"
    Then the row should store utm_source "threads", utm_medium "social", utm_campaign "lockout-2026"
    And landing_path "/insights/mlb-lockout"

  Scenario: Bot fills the hidden field
    When a submission arrives with the honeypot field "website" set to "http://spam.example"
    Then I should see the success message
    But no waitlist row should be written

  Scenario: Invalid input
    When I submit the waitlist form with email "not-an-email" and no consent
    Then I should see "Email 格式不正確 Invalid email"
    And I should see "請同意隱私權政策 Please accept the privacy policy"
    And no waitlist row should be written

  Scenario: Database write fails
    Given the database is unavailable
    When I submit a valid waitlist form
    Then I should see "送出失敗，請稍後再試 Something went wrong, please try again"

  Scenario: Checkout is closed in waitlist mode
    When I POST to "/api/stripe/checkout" with plan "monthly"
    Then I should be redirected to "/pricing#waitlist"
    And no Stripe Checkout Session should be created

  Scenario: The service-role-only table is closed to the public
    When an anonymous client selects from "waitlist_signups"
    Then it should receive no rows
    When an anonymous client inserts into "waitlist_signups"
    Then the insert should be rejected by RLS
