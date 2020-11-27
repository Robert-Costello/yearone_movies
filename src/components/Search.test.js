import {render, cleanup, screen, waitFor} from '@testing-library/react';

import {Search} from './Search';

afterEach(cleanup);

describe('Search', () => {
  it('renders successfully', () => {
    render(<Search />);
  });
  it('renders a header', () => {
    const {getByRole} = render(<Search />);
    getByRole('img', {name: /YearOne Movies/i});
  });
  it('renders a search form', () => {
    const {getByRole} = render(<Search />);
    getByRole('form', {name: /search-form/i});
  });
  it('renders a search input', () => {
    const {getByPlaceholderText} = render(<Search />);
    getByPlaceholderText('Enter movie title');
  });
});
