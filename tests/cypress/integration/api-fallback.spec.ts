/// <reference path="../support/index.d.ts" />

context('API fallback', () => {
  before(() => {
    cy.task('integration:prepare', 'api-fallback');
    cy.visit('http://localhost:3000/');
  });

  after(() => {
    cy.task('integration:reset');
  });

  it('Stats', () => {
    cy.get('#mocha-stats .passes').should('have.text', 'passes: 2');
    cy.get('#mocha-stats .failures').should('have.text', 'failures: 1');
    cy.get('#mocha-stats .progress').should('not.have.attr', 'data-progress');
  });

  it('Warnings', () => {
    cy.assertNoWarnings();
  });

  it('All groups', () => {
    cy.contains('AandB').should('not.exist');
    cy.contains('B.+').should('not.exist');
    cy.contains('AA').parentsUntil('#mocha-report').assertTests({ Foo: true });
    cy.contains('AB').parentsUntil('#mocha-report').assertTests({ Bar: false });
    cy.contains(/^B$/).parentsUntil('#mocha-report').assertTests({ Foo: true });
  });
});
