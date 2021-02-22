import setupMocha from './setupMocha';

declare global {
  interface Window {
    skills17: {
      setupMocha: typeof setupMocha;
    };
  }
}

window.skills17 = {
  setupMocha,
};
