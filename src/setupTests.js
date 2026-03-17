// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

jest.mock('html2canvas', () => {
  return jest.fn(() => Promise.resolve({ toDataURL: () => '' }));
});

jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => ({
    addImage: jest.fn(),
    save: jest.fn(),
    internal: {
      pageSize: {
        getWidth: () => 0,
        getHeight: () => 0
      }
    }
  }));
});
