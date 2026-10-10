Feature: Paid weekly brief 付費週報 (UC-02)
  Scenario: Non-subscriber opens a premium brief
    Given I am not subscribed
    When I open a premium brief
    Then I should see the excerpt and the paywall card
    And the brief body must not be returned by Supabase (RLS)

  Scenario: Payment fails
    Given my subscription becomes "past_due"
    When I open a premium brief
    Then I should see the paywall card
    And free briefs remain readable
