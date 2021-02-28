/// <reference path="../support/index.d.ts" />

context('Loading failure', () => {
  before(() => {
    cy.task('integration:prepare', 'loading-failure');
    cy.visit('http://localhost:3000/');
  });

  after(() => {
    cy.task('integration:reset');
  });

  it('Stats', () => {
    cy.assertStats(2, 1);
  });

  it('Warnings', () => {
    cy.assertWarnings(['tests/c.test.js failed to load']);
  });

  it('Group A', () => {
    cy.contains('AandB').parentsUntil('#mocha-report').should('be.visible');
    cy.contains('AandB').parentsUntil('#mocha-report').assertTests({ Foo: true, Bar: false });
    cy.contains('AandB').parentsUntil('#mocha-report').assertPoints(1, 2, 'partial');
  });

  it('Group B', () => {
    cy.contains('B.+').parentsUntil('#mocha-report').should('be.visible');
    cy.contains('B.+').parentsUntil('#mocha-report').assertTests({ Foo: true });
    cy.contains('B.+').parentsUntil('#mocha-report').assertPoints(1, 1, 'all');
  });
});
