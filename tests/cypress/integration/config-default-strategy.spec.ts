/// <reference path="../support/index.d.ts" />

context('Config default strategy', () => {
  before(() => {
    cy.task('integration:prepare', 'config-default-strategy');
    cy.visit('http://localhost:3000/');
  });

  after(() => {
    cy.task('integration:reset');
  });

  it('Stats', () => {
    cy.assertStats(4, 2);
  });

  it('Warnings', () => {
    cy.assertNoWarnings();
  });

  it('Group A', () => {
    cy.contains('A.+').parentsUntil('#mocha-report').should('be.visible');
    cy.contains('A.+')
      .parentsUntil('#mocha-report')
      .assertTests({ Foo: true, Bar: true, Baz: false });
    cy.contains('A.+').parentsUntil('#mocha-report').assertPoints(1, 2, 'partial');
  });

  it('Group B', () => {
    cy.contains('B.+').parentsUntil('#mocha-report').should('be.visible');
    cy.contains('B.+')
      .parentsUntil('#mocha-report')
      .assertTests({ Foo: true, Bar: true, Baz: false });
    cy.contains('B.+').parentsUntil('#mocha-report').assertPoints(2, 3, 'partial');
  });
});
