declare namespace Cypress {
  interface Chainable {
    assertTests(tests: Record<string, boolean>): Chainable;
    assertPoints(scored: number, total: number, expectedClass: string): Chainable;
  }
}
