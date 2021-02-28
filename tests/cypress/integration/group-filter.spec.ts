/// <reference path="../support/index.d.ts" />

context('Group filter', () => {
  before(() => {
    cy.task('integration:prepare', 'group-filter');
  });

  after(() => {
    cy.task('integration:reset');
  });

  it('All groups', () => {
    cy.visit('http://localhost:3000/');
    cy.assertStats(2, 1);
    cy.assertNoWarnings();
    cy.contains('AandB').parentsUntil('#mocha-report').should('be.visible');
    cy.contains('AandB').parentsUntil('#mocha-report').assertTests({ Foo: true, Bar: false });
    cy.contains('AandB').parentsUntil('#mocha-report').assertPoints(1, 2, 'partial');
    cy.contains('B.+').parentsUntil('#mocha-report').should('be.visible');
    cy.contains('B.+').parentsUntil('#mocha-report').assertTests({ Foo: true });
    cy.contains('B.+').parentsUntil('#mocha-report').assertPoints(1, 1, 'all');
  });

  it('Filter Group A', () => {
    cy.visit('http://localhost:3000/');
    cy.contains('AandB').should('be.visible');
    cy.contains('B.+').should('be.visible');

    cy.contains('AandB').click();
    cy.assertStats(1, 1);
    cy.assertNoWarnings();
    cy.contains('AandB').parentsUntil('#mocha-report').should('be.visible');
    cy.contains('AandB').parentsUntil('#mocha-report').assertTests({ Foo: true, Bar: false });
    cy.contains('AandB').parentsUntil('#mocha-report').assertPoints(1, 2, 'partial');
    cy.contains('B.+').should('not.exist');
  });

  it('Filter Group B', () => {
    cy.visit('http://localhost:3000/');
    cy.contains('AandB').should('be.visible');
    cy.contains('B.+').should('be.visible');

    cy.contains('B.+').click();
    cy.assertStats(1, 0);
    cy.assertNoWarnings();
    cy.contains('AandB').should('not.exist');
    cy.contains('B.+').parentsUntil('#mocha-report').should('be.visible');
    cy.contains('B.+').parentsUntil('#mocha-report').assertTests({ Foo: true });
    cy.contains('B.+').parentsUntil('#mocha-report').assertPoints(1, 1, 'all');
  });
});
