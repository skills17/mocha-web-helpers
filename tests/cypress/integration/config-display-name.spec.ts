/// <reference path="../support/index.d.ts" />

context('Config display name', () => {
  before(() => {
    cy.task('integration:prepare', 'config-display-name');
    cy.visit('http://localhost:3000/');
  });

  after(() => {
    cy.task('integration:reset');
  });

  it('Stats', () => {
    cy.assertStats(3, 0);
  });

  it('Warnings', () => {
    cy.assertNoWarnings();
  });

  it('Group A', () => {
    cy.contains('A.+').parentsUntil('#mocha-report').should('be.visible');
    cy.contains('A.+').parentsUntil('#mocha-report').assertTests({ Foo: true });
    cy.contains('A.+').parentsUntil('#mocha-report').assertPoints(1, 1, 'all');
  });

  it('Group B', () => {
    cy.contains('BGroup::foo').parentsUntil('#mocha-report').should('be.visible');
    cy.contains('BGroup::foo').parentsUntil('#mocha-report').assertTests({ Foo: true });
    cy.contains('BGroup::foo').parentsUntil('#mocha-report').assertPoints(1, 1, 'all');
  });

  it('Group C', () => {
    cy.contains('Last group').parentsUntil('#mocha-report').should('be.visible');
    cy.contains('Last group').parentsUntil('#mocha-report').assertTests({ Foo: true });
    cy.contains('Last group').parentsUntil('#mocha-report').assertPoints(1, 1, 'all');
  });
});
