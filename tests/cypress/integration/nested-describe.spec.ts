/// <reference path="../support/index.d.ts" />

context('Nested describe', () => {
  before(() => {
    cy.task('integration:prepare', 'nested-describe');
    cy.visit('http://localhost:3000/');
  });

  after(() => {
    cy.task('integration:reset');
  });

  it('Stats', () => {
    cy.assertStats(2, 0);
  });

  it('Warnings', () => {
    cy.assertNoWarnings();
  });

  it('Group A', () => {
    cy.contains('A > B.+').parentsUntil('#mocha-report').should('be.visible');
    cy.contains('A > B.+').parentsUntil('#mocha-report').assertTests({ Foo: true });
    cy.contains('A > B.+').parentsUntil('#mocha-report').assertPoints(1, 1, 'all');
  });

  it('Group C', () => {
    cy.contains('.+D.+').parentsUntil('#mocha-report').should('be.visible');
    cy.contains('.+D.+').parentsUntil('#mocha-report').assertTests({ Foo: true });
    cy.contains('.+D.+').parentsUntil('#mocha-report').assertPoints(1, 1, 'all');
  });
});
