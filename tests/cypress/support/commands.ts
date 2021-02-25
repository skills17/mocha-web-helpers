Cypress.Commands.add(
  'assertTests',
  { prevSubject: true },
  (subject, tests: Record<string, boolean | 'manual-check'>) => {
    // check for each test
    Object.keys(tests).forEach((testName) => {
      const status = tests[testName];
      cy.get(subject).find('.test').contains(testName).should('be.visible');

      // check if the tests have the correct status
      cy.get(subject)
        .find('.test')
        .contains(testName)
        .parent()
        .should('have.class', status ? 'pass' : 'fail');
      cy.get(subject)
        .find('.test')
        .contains(testName)
        .parent()
        .should('not.have.class', status ? 'fail' : 'pass');

      // check for manual-check warning
      if (status === 'manual-check') {
        cy.get(subject)
          .find('.test')
          .contains(testName)
          .parent()
          .should('have.class', 'manual-check');

        cy.get(subject)
          .find('.test')
          .contains(testName)
          .find('.manual-check-warning')
          .should('be.visible')
          .should(
            'have.text',
            'please check manually for static return values and/or logical errors',
          );
      }

      if (!status) {
        // check if failed tests have the exception
        cy.get(subject)
          .find('.test')
          .contains(testName)
          .parent()
          .find('.error')
          .should('be.visible')
          .should('contain.text', 'AssertionError: expected true to equal false');
      }
    });

    // check for total test number
    cy.get(subject).find('.test').should('have.length', Object.keys(tests).length);

    // check for manual-check warning on the group
    const requiresManualCheck = Object.values(tests).includes('manual-check');
    if (requiresManualCheck) {
      cy.get(subject)
        .find('h1 .manual-check-warning')
        .should('be.visible')
        .should('contain.text', 'manual check required');
    } else {
      cy.get(subject).find('h1 .manual-check-warning').should('not.exist');
    }
  },
);

Cypress.Commands.add(
  'assertPoints',
  { prevSubject: true },
  (subject, scored: number, total: number, expectedClass: string) => {
    cy.get(subject)
      .find('.points')
      .should('be.visible')
      .should('contain.text', `${scored} / ${total} point${total !== 1 ? 's' : ''}`)
      .should('have.class', `${expectedClass}-points`);
  },
);

Cypress.Commands.add('assertStats', (passes: number, failures: number, percentage = 100) => {
  cy.get('#mocha-stats .passes').should('have.text', `passes: ${passes}`);
  cy.get('#mocha-stats .failures').should('have.text', `failures: ${failures}`);
  cy.get('#mocha-stats .progress').should('have.attr', 'data-progress', percentage);
});
