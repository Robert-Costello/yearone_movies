import {render, cleanup} from '@testing-library/react';

import Search from './Search';

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
  it('has getMovies method', () => {
    const comp = new Search();
    expect(typeof comp.getMovies).toBe('function');
  });
  it('getMovies returns an array with length 20', async () => {
    const comp = new Search();
    const movies = await comp.getMovies('Spider-Man');
    expect(Array.isArray(movies)).toBe(true);
    expect(movies.length).toBe(20);
  });
});
