/// <reference path="../support/index.d.ts" />

context('Empty groups', () => {
  before(() => {
    cy.task('integration:prepare', 'empty-groups');
    cy.visit('http://localhost:3000/');
  });

  after(() => {
    cy.task('integration:reset');
  });

  it('Stats', () => {
    cy.assertStats(4, 0);
  });

  it('Warnings', () => {
    cy.assertWarnings(['The following groups do not have any test:\n  - B.+']);
  });

  it('Group A', () => {
    cy.contains('A.+').parentsUntil('#mocha-report').should('be.visible');
    cy.contains('A.+').parentsUntil('#mocha-report').assertTests({ Foo: true });
    cy.contains('A.+').parentsUntil('#mocha-report').assertPoints(1, 1, 'all');
  });

  it('Group C', () => {
    cy.contains('C.+').parentsUntil('#mocha-report').should('be.visible');
    cy.contains('C.+').parentsUntil('#mocha-report').assertTests({ Foo: true });
    cy.contains('C.+').parentsUntil('#mocha-report').assertPoints(1, 1, 'all');
  });
});
