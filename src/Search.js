import {Component} from 'react';
import Movie from './components/Movie';
import {Header} from './components/Header';
import {key} from './secrets.js';
const axios = require('axios');

class Search extends Component {
  _isMounted = false;
  constructor() {
    super();

    this.getMovies = this.getMovies.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {};
  }

  // Grabs all movies that match input title
  async getMovies(title) {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${key}&language=en-US&query=${title}&include_adult=false`
      );

      const movies = response.data.results;

      movies.sort((a, b) => b.popularity - a.popularity);

      let movieComponents = [];

      movies.map((movie) => {
        const movieComponent = (
          <Movie aria-label="movie" key={movie.id} movie={movie} />
        );
        movieComponents.push(movieComponent);
        return movie;
      });

      if (this._isMounted) {
        if (this.state.rows) {
          this.setState({moivies: []});
          this.setState({moivies: [movieComponents]});
        } else {
          this.setState({movies: [movieComponents]});
        }
      }

      return movies;
    } catch (error) {
      console.log(error);
    }
  }

  handleChange(e) {
    this.getMovies(e.target.value);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.getMovies(e.target.input.value);
    e.target.input.value = '';
  }

  componentDidMount() {
    this._isMounted = true;
    // Intial data fetch
    this.getMovies('Spider Man');
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <div name="search-container">
        <div className="header">
          <Header />
          <form
            aria-label="search-form"
            className="search-form"
            onSubmit={this.handleSubmit}
          >
            <input
              name="input"
              className="search-input"
              type="text"
              placeholder="Enter movie title"
              autoComplete="off"
              onChange={this.handleChange}
            ></input>

            <svg className="search-icon" width="24" height="24">
              <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
            </svg>
          </form>
        </div>
        <div className="all-movies">
          <div className="rows">{this.state.movies}</div>
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noreferrer noopener"
          >
            <img width="50" src="blue_square.svg" alt=""></img>
          </a>
        </div>
      </div>
    );
  }
}

export default Search;
