/// <reference path="../support/index.d.ts" />

context('Extra tests strategy deduct', () => {
  before(() => {
    cy.task('integration:prepare', 'extra-tests-strategy-deduct');
    cy.visit('http://localhost:3000/');
  });

  after(() => {
    cy.task('integration:reset');
  });

  it('Stats', () => {
    cy.assertStats(27, 9);
  });

  it('Warnings', () => {
    cy.assertNoWarnings();
  });

  it('Group A', () => {
    cy.contains('A.+').parentsUntil('#mocha-report').should('be.visible');
    cy.contains('A.+')
      .parentsUntil('#mocha-report')
      .assertTests({ Foo: true, Bar: false, Baz: true });
    cy.contains('A.+').parentsUntil('#mocha-report').assertPoints(2, 3, 'partial');
  });

  it('Group B', () => {
    cy.contains('B.+').parentsUntil('#mocha-report').should('be.visible');
    cy.contains('B.+')
      .parentsUntil('#mocha-report')
      .assertTests({ Foo: true, Bar: false, Baz: 'manual-check' });
    cy.contains('B.+').parentsUntil('#mocha-report').assertPoints(1, 2, 'partial');
  });

  it('Group C', () => {
    cy.contains('C.+').parentsUntil('#mocha-report').should('be.visible');
    cy.contains('C.+')
      .parentsUntil('#mocha-report')
      .assertTests({ Foo: false, Bar: false, Baz: false });
    cy.contains('C.+').parentsUntil('#mocha-report').assertPoints(0, 2, 'no');
  });

  it('Group D', () => {
    cy.contains('D.+').parentsUntil('#mocha-report').should('be.visible');
    cy.contains('D.+')
      .parentsUntil('#mocha-report')
      .assertTests({ Foo: true, Bar: false, Baz: true });
    cy.contains('D.+').parentsUntil('#mocha-report').assertPoints(1, 1.5, 'partial');
  });

  it('Group E', () => {
    cy.contains('E.+').parentsUntil('#mocha-report').should('be.visible');
    cy.contains('E.+')
      .parentsUntil('#mocha-report')
      .assertTests({ Foo: true, MorePoints: false, Bar: false, Baz: true });
    cy.contains('E.+').parentsUntil('#mocha-report').assertPoints(0.5, 2, 'partial');
  });

  it('Group F', () => {
    cy.contains('F.+').parentsUntil('#mocha-report').should('be.visible');
    cy.contains('F.+').parentsUntil('#mocha-report').assertTests({ Foo: true, Bar: true });
    cy.contains('F.+').parentsUntil('#mocha-report').assertPoints(2, 2, 'all');
  });
});
