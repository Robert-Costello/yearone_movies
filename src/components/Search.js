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
            <img
              width="500px"
              src="https://static.wixstatic.com/media/c93ed2_c57eae83724f4b9da0171370812ea7d8~mv2.png/v1/fill/w_766,h_118,al_c,q_85,usm_0.66_1.00_0.01/YearOne-Logo-WhiteYellow.webp"
              alt="YearOne Movies"
            ></img>
            {/* <h1>YearOne Movies</h1> */}
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
            <button className="search-button" onSubmit={this.handleSubmit}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                role="presentation"
              >
                <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
              </svg>
            </button>
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
