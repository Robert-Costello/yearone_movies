import {render, cleanup, screen} from '@testing-library/react';

import App from './App';

afterEach(cleanup);

describe('Search', () => {
  it('renders successfully', () => {
    render(<App />);
  });
});
