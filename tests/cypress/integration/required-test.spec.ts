/// <reference path="../support/index.d.ts" />

context('Required test', () => {
  before(() => {
    cy.task('integration:prepare', 'required-test');
    cy.visit('http://localhost:3000/');
  });

  after(() => {
    cy.task('integration:reset');
  });

  it('Stats', () => {
    cy.assertStats(5, 3);
  });

  it('Group A', () => {
    cy.contains('A.+').parentsUntil('#mocha-report').should('be.visible');
    cy.contains('A.+')
      .parentsUntil('#mocha-report')
      .assertTests({ Foo: true, Bar: false, Required: false });
    cy.contains('A.+').parentsUntil('#mocha-report').assertPoints(0, 3, 'no');
  });

  it('Group B', () => {
    cy.contains('B.+').parentsUntil('#mocha-report').should('be.visible');
    cy.contains('B.+')
      .parentsUntil('#mocha-report')
      .assertTests({ Foo: true, Bar: true, Required: false });
    cy.contains('B.+').parentsUntil('#mocha-report').assertPoints(0, 2, 'no');
  });

  it('Group C', () => {
    cy.contains('C.+').parentsUntil('#mocha-report').should('be.visible');
    cy.contains('C.+').parentsUntil('#mocha-report').assertTests({ Foo: true, Required: true });
    cy.contains('C.+').parentsUntil('#mocha-report').assertPoints(2, 2, 'all');
  });
});
