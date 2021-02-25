/// <reference path="../support/index.d.ts" />

context('Config default points', () => {
  before(() => {
    cy.task('integration:prepare', 'config-default-points');
    cy.visit('http://localhost:3000/');
  });

  after(() => {
    cy.task('integration:reset');
  });

  it('Group A', () => {
    cy.contains('A.+').parentsUntil('#mocha-report').should('be.visible');
    cy.contains('A.+')
      .parentsUntil('#mocha-report')
      .assertTests({ Foo: true, Bar: true, Baz: false });
    cy.contains('A.+').parentsUntil('#mocha-report').assertPoints(6, 9, 'partial');
  });

  it('Group B', () => {
    cy.contains('B.+').parentsUntil('#mocha-report').should('be.visible');
    cy.contains('B.+')
      .parentsUntil('#mocha-report')
      .assertTests({ Foo: true, Bar: true, Baz: false });
    cy.contains('B.+').parentsUntil('#mocha-report').assertPoints(1, 1.5, 'partial');
  });

  it('Group C', () => {
    cy.contains('C.+').parentsUntil('#mocha-report').should('be.visible');
    cy.contains('C.+')
      .parentsUntil('#mocha-report')
      .assertTests({ Foo: true, LessPoints: true, Baz: false });
    cy.contains('C.+').parentsUntil('#mocha-report').assertPoints(5, 8, 'partial');
  });

  it('Group D', () => {
    cy.contains('D.+').parentsUntil('#mocha-report').should('be.visible');
    cy.contains('D.+')
      .parentsUntil('#mocha-report')
      .assertTests({ Foo: true, MorePoints: true, Baz: false });
    cy.contains('D.+').parentsUntil('#mocha-report').assertPoints(3, 4, 'partial');
  });
});
