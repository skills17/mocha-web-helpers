/// <reference path="../support/index.d.ts" />

context('Ungrouped tests', () => {
  before(() => {
    cy.task('integration:prepare', 'ungrouped-tests');
    cy.visit('http://localhost:3000/');
  });

  after(() => {
    cy.task('integration:reset');
  });

  it('Stats', () => {
    cy.assertStats(3, 0);
  });

  it('Warnings', () => {
    cy.assertWarnings([
      'The following tests do not belong to a group and were ignored:\n  - B > Foo\n  - B > Bar',
    ]);
  });

  it('Group A', () => {
    cy.contains('A.+').parentsUntil('#mocha-report').should('be.visible');
    cy.contains('A.+').parentsUntil('#mocha-report').assertTests({ Foo: true });
    cy.contains('A.+').parentsUntil('#mocha-report').assertPoints(1, 1, 'all');
  });
});
