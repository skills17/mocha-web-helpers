declare namespace Cypress {
  interface Chainable {
    assertTests(tests: Record<string, boolean | 'manual-check'>): Chainable;
    assertPoints(scored: number, total: number, expectedClass: string): Chainable;
    assertStats(passes: number, failures: number, percentage?: number): Chainable;
  }
}
