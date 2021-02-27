declare namespace Cypress {
  interface Chainable {
    assertTests(tests: Record<string, boolean | 'manual-check'>, errors?: Record<string, string>): Chainable;
    assertPoints(scored: number, total: number, expectedClass: string): Chainable;
    assertStats(passes: number, failures: number, percentage?: number): Chainable;
    assertNoWarnings(): Chainable;
    assertWarnings(warnings: string[]): Chainable;
  }
}
