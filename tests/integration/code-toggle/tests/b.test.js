/* eslint-disable no-undef */

describe('B', () => {
  it('Foo', () => {
    const someVariable = true;
    expect(someVariable).to.equal(true);
  });

  it('Bar', () => {
    const someVariable = 3;
    expect(someVariable).to.equal(3);
    const anotherVariable = 4;
    expect(someVariable).to.equal(anotherVariable);
  });
});
