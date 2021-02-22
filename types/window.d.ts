import setupMocha from '../src/setupMocha';

declare global {
  interface Window {
    skills17: {
      setupMocha: typeof setupMocha;
    };
    mocha: any;
    chai: any;
    expect: any;
  }
}
