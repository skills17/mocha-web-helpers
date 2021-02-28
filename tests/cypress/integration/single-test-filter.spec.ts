/// <reference path="../support/index.d.ts" />

context('Single test filter', () => {
  before(() => {
    cy.task('integration:prepare', 'single-test-filter');
  });

  after(() => {
    cy.task('integration:reset');
  });

  it('All tests', () => {
    cy.visit('http://localhost:3000/');
    cy.assertStats(2, 1);
    cy.assertNoWarnings();
    cy.contains('AandB').parentsUntil('#mocha-report').should('be.visible');
    cy.contains('AandB').parentsUntil('#mocha-report').assertTests({ Foo: true, Bar: false });
    cy.contains('AandB').parentsUntil('#mocha-report').assertPoints(1, 2, 'partial');
    cy.contains('AandB').parent().find('.points').should('be.visible');
    cy.contains('B.+').parentsUntil('#mocha-report').should('be.visible');
    cy.contains('B.+').parentsUntil('#mocha-report').assertTests({ Foo: true });
    cy.contains('B.+').parentsUntil('#mocha-report').assertPoints(1, 1, 'all');
    cy.contains('B.+').parent().find('.points').should('be.visible');
  });

  it('Filter Group A Foo', () => {
    cy.visit('http://localhost:3000/');
    cy.contains('AandB').should('be.visible');
    cy.contains('B.+').should('be.visible');

    cy.contains('AandB').parentsUntil('#mocha-report').contains('Foo').find('.replay').click();
    cy.assertStats(1, 0);
    cy.assertNoWarnings();
    cy.contains('AandB').parentsUntil('#mocha-report').should('be.visible');
    cy.contains('AandB').parentsUntil('#mocha-report').assertTests({ Foo: true });
    cy.contains('AandB').parent().find('.points').should('not.be.visible');
    cy.contains('B.+').should('not.exist');
  });

  it('Filter Group A Bar', () => {
    cy.visit('http://localhost:3000/');
    cy.contains('AandB').should('be.visible');
    cy.contains('B.+').should('be.visible');

    cy.contains('AandB').parentsUntil('#mocha-report').contains('Bar').find('.replay').click();
    cy.assertStats(0, 1);
    cy.assertNoWarnings();
    cy.contains('AandB').parentsUntil('#mocha-report').should('be.visible');
    cy.contains('AandB').parentsUntil('#mocha-report').assertTests({ Bar: false });
    cy.contains('AandB').parent().find('.points').should('not.be.visible');
    cy.contains('B.+').should('not.exist');
  });

  it('Filter Group B Foo', () => {
    cy.visit('http://localhost:3000/');
    cy.contains('AandB').should('be.visible');
    cy.contains('B.+').should('be.visible');

    cy.contains('B.+').parentsUntil('#mocha-report').contains('Foo').find('.replay').click();
    cy.assertStats(1, 0);
    cy.assertNoWarnings();
    cy.contains('B.+').parentsUntil('#mocha-report').should('be.visible');
    cy.contains('B.+').parentsUntil('#mocha-report').assertTests({ Foo: true });
    cy.contains('B.+').parent().find('.points').should('not.be.visible');
    cy.contains('AandB').should('not.exist');
  });
});
