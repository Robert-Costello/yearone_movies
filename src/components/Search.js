import {Component} from 'react';
import Row from './Row';

const axios = require('axios');
const key = 'ccdaa563df49d444d84702641c61b0ac';
const input = 'Evil Dead';

export class Search extends Component {
  constructor(props) {
    super(props);
    this.getMovies = this.getMovies.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {};
  }

  async getMovies(title) {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${key}&language=en-US&query=${title}&include_adult=false`
      );

      const movies = response.data.results;
      console.log(movies);
      movies.sort((a, b) => b.popularity - a.popularity);

      let movieRows = [];

      movies.map((movie) => {
        const movieRow = <Row key={movie.id} movie={movie} />;
        movieRows.push(movieRow);
        return movie;
      });

      if (this.state.rows) {
        this.setState({rows: []});
        this.setState({rows: [movieRows]});
      } else {
        this.setState({rows: [movieRows]});
      }
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
    this.getMovies('Zatoichi');
  }

  render() {
    return (
      <div>
        <div className="header">
          <div>
            <h1>YearOne Movie Search</h1>
          </div>
          <form className="search-form" onSubmit={this.handleSubmit}>
            <input
              name="input"
              className="search-input"
              type="text"
              placeholder="Enter movie title"
              autoComplete="off"
              onChange={this.handleChange}
            ></input>
          </form>
        </div>

        <div className="all-movies">
          <div className="rows">{this.state.rows}</div>
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
