import setupMocha from '../src/setupMocha';

declare global {
  interface Window {
    skills17: {
      setupMocha: typeof setupMocha;
    };
    mocha: any;
    chai: any;
    expect: any;
    before: (callback: () => void) => void;
    after: (callback: () => void) => void;
  }
}
