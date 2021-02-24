Cypress.Commands.add(
  'assertTests',
  { prevSubject: true },
  (subject, tests: Record<string, boolean>) => {
    // check for each test
    Object.keys(tests).forEach((testName) => {
      const test = cy.get(subject).find('.test').contains(testName);
      const status = tests[testName];
      test.should('be.visible');

      // check if the tests have the correct status
      test.parent().should('have.class', status ? 'pass' : 'fail');
      test.parent().should('not.have.class', status ? 'fail' : 'pass');

      if (!status) {
        // check if failed tests have the exception
        test
          .parent()
          .find('.error')
          .should('be.visible')
          .should('contain.text', 'AssertionError: expected true to equal false');
      }
    });

    // check for total test number
    cy.get(subject).find('.test').should('have.length', Object.keys(tests).length);
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
