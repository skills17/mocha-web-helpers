/// <reference path="../support/index.d.ts" />

context('Local history', () => {
  before(() => {
    cy.task('integration:prepare', 'local-history');
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

  it('Stores a history file for a test run', () => {
    cy.task('history:get', 'local-history').then((res) => {
      expect(res).to.have.length(1);
      expect(typeof res[0].time).to.equal('number');
      expect(res[0].testResults).to.deep.equal([
        {
          group: 'A.+',
          points: 1,
          maxPoints: 2,
          strategy: 'add',
          manualCheck: false,
          tests: [
            {
              name: 'Foo',
              points: 1,
              maxPoints: 1,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: 'Bar',
              points: 0,
              maxPoints: 1,
              successful: false,
              required: false,
              manualCheck: false,
            },
          ],
        },
        {
          group: 'B.+',
          points: 1,
          maxPoints: 2,
          strategy: 'add',
          manualCheck: false,
          tests: [
            {
              name: 'Foo',
              points: 1,
              maxPoints: 1,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: 'Bar',
              points: 0,
              maxPoints: 1,
              successful: false,
              required: false,
              manualCheck: false,
            },
          ],
        },
      ]);
    });
  });
});
