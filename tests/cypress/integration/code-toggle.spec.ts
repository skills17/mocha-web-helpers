/// <reference path="../support/index.d.ts" />

context('Code toggle', () => {
  before(() => {
    cy.task('integration:prepare', 'code-toggle');
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

  it('Toggles Group A', () => {
    // show Foo
    cy.contains('A.+').parentsUntil('#mocha-report').find('.test').contains('Foo').click();
    cy.contains('A.+')
      .parentsUntil('#mocha-report')
      .find('.test')
      .contains('Foo')
      .parent()
      .find('pre')
      .should('be.visible')
      .should('have.text', 'expect(true).to.equal(true);');

    // hide Foo
    cy.contains('A.+').parentsUntil('#mocha-report').find('.test').contains('Foo').click();
    cy.contains('A.+')
      .parentsUntil('#mocha-report')
      .find('.test')
      .contains('Foo')
      .parent()
      .find('pre')
      .should('not.be.visible')
      .should('have.text', 'expect(true).to.equal(true);');

    // show Bar
    cy.contains('A.+').parentsUntil('#mocha-report').find('.test').contains('Bar').click();
    cy.contains('A.+')
      .parentsUntil('#mocha-report')
      .find('.test')
      .contains('Bar')
      .parent()
      .find('pre:not(.error)')
      .should('be.visible')
      .should('have.text', 'expect(true).to.equal(false);');

    // hide Bar
    cy.contains('A.+').parentsUntil('#mocha-report').find('.test').contains('Bar').click();
    cy.contains('A.+')
      .parentsUntil('#mocha-report')
      .find('.test')
      .contains('Bar')
      .parent()
      .find('pre:not(.error)')
      .should('not.be.visible')
      .should('have.text', 'expect(true).to.equal(false);');
  });

  it('Group B', () => {
    cy.contains('B.+').parentsUntil('#mocha-report').should('be.visible');
    cy.contains('B.+')
      .parentsUntil('#mocha-report')
      .assertTests({ Foo: true, Bar: false }, { Bar: 'AssertionError: expected 3 to equal 4' });
    cy.contains('B.+').parentsUntil('#mocha-report').assertPoints(1, 2, 'partial');
  });

  it('Toggles Group B', () => {
    // show Foo
    cy.contains('B.+').parentsUntil('#mocha-report').find('.test').contains('Foo').click();
    cy.contains('B.+')
      .parentsUntil('#mocha-report')
      .find('.test')
      .contains('Foo')
      .parent()
      .find('pre')
      .should('be.visible')
      .should('have.text', 'const someVariable = true;\nexpect(someVariable).to.equal(true);');

    // hide Foo
    cy.contains('B.+').parentsUntil('#mocha-report').find('.test').contains('Foo').click();
    cy.contains('B.+')
      .parentsUntil('#mocha-report')
      .find('.test')
      .contains('Foo')
      .parent()
      .find('pre')
      .should('not.be.visible')
      .should('have.text', 'const someVariable = true;\nexpect(someVariable).to.equal(true);');

    // show Bar
    cy.contains('B.+').parentsUntil('#mocha-report').find('.test').contains('Bar').click();
    cy.contains('B.+')
      .parentsUntil('#mocha-report')
      .find('.test')
      .contains('Bar')
      .parent()
      .find('pre:not(.error)')
      .should('be.visible')
      .should(
        'have.text',
        'const someVariable = 3;\nexpect(someVariable).to.equal(3);\nconst anotherVariable = 4;\nexpect(someVariable).to.equal(anotherVariable);',
      );

    // hide Bar
    cy.contains('B.+').parentsUntil('#mocha-report').find('.test').contains('Bar').click();
    cy.contains('B.+')
      .parentsUntil('#mocha-report')
      .find('.test')
      .contains('Bar')
      .parent()
      .find('pre:not(.error)')
      .should('not.be.visible')
      .should(
        'have.text',
        'const someVariable = 3;\nexpect(someVariable).to.equal(3);\nconst anotherVariable = 4;\nexpect(someVariable).to.equal(anotherVariable);',
      );
  });
});
