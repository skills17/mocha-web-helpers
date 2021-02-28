/// <reference path="../support/index.d.ts" />

context('Local history disabled', () => {
  before(() => {
    cy.task('integration:prepare', 'local-history-disabled');
    cy.visit('http://localhost:3000/');
  });

  after(() => {
    cy.task('integration:reset');
  });

  it('Stats', () => {
    cy.assertStats(2, 2);
  });

  it('Warnings', () => {
    cy.assertNoWarnings();
  });

  it('Group A', () => {
    cy.contains('A.+').parentsUntil('#mocha-report').should('be.visible');
    cy.contains('A.+').parentsUntil('#mocha-report').assertTests({ Foo: true, Bar: false });
    cy.contains('A.+').parentsUntil('#mocha-report').assertPoints(1, 2, 'partial');
  });

  it('Group B', () => {
    cy.contains('B.+').parentsUntil('#mocha-report').should('be.visible');
    cy.contains('B.+').parentsUntil('#mocha-report').assertTests({ Foo: true, Bar: false });
    cy.contains('B.+').parentsUntil('#mocha-report').assertPoints(1, 2, 'partial');
  });

  it('Is disabled by default', () => {
    cy.task('history:get', 'local-history-disabled').then((res) => {
      expect(res).to.have.length(0);
    });
  });
});
