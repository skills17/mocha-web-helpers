/// <reference path="../support/index.d.ts" />

context('Config minimal', () => {
  before(() => {
    cy.task('integration:prepare', 'config-minimal');
    cy.visit('http://localhost:3000/');
  });

  after(() => {
    cy.task('integration:reset');
  });

  it('Group A', () => {
    cy.contains('A.+').parentsUntil('#mocha-report').should('be.visible');
    cy.contains('A.+').parentsUntil('#mocha-report').assertTests({ Foo: true });
    cy.contains('A.+').parentsUntil('#mocha-report').assertPoints(1, 1, 'all');
  });

  it('Group B', () => {
    cy.contains('B.+').parentsUntil('#mocha-report').should('be.visible');
    cy.contains('B.+')
      .parentsUntil('#mocha-report')
      .assertTests({ Foo: true, Bar: true, Baz: false });
    cy.contains('B.+').parentsUntil('#mocha-report').assertPoints(2, 3, 'partial');
  });

  it('Group C', () => {
    cy.contains('C.+').parentsUntil('#mocha-report').should('be.visible');
    cy.contains('C.+').parentsUntil('#mocha-report').assertTests({ Foo: true, Bar: true });
    cy.contains('C.+').parentsUntil('#mocha-report').assertPoints(2, 2, 'all');
  });

  it('Group D', () => {
    cy.contains('D.+').parentsUntil('#mocha-report').should('be.visible');
    cy.contains('D.+').parentsUntil('#mocha-report').assertTests({ Foo: false });
    cy.contains('D.+').parentsUntil('#mocha-report').assertPoints(0, 1, 'no');
  });

  it('Group E', () => {
    cy.contains('E.+').parentsUntil('#mocha-report').should('be.visible');
    cy.contains('E.+').parentsUntil('#mocha-report').assertTests({ Foo: false, Bar: false });
    cy.contains('E.+').parentsUntil('#mocha-report').assertPoints(0, 2, 'no');
  });
});
