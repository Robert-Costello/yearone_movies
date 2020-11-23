import {Component} from 'react';
import Row from './Row';

//==========================================================

import {firebaseConfig} from './Firebase';
import firebase from 'firebase';

// For the module builds, these are available in the following manner
// (replace <PACKAGE> with the name of a component - i.e. auth, database, etc):

// CommonJS Modules:
// const firebase = require('firebase/app');
// require('firebase/<PACKAGE>');

// ES Modules:
// import firebase from 'firebase/app';
// import 'firebase/<PACKAGE>';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const db = firebase.firestore();

let ratings = db.collection('movie-ratings');

//==========================================================

const axios = require('axios');
const key = 'ccdaa563df49d444d84702641c61b0ac';
const input = 'Evil Dead';

export class Search extends Component {
  constructor(props) {
    super(props);
    this.getMovies = this.getMovies.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getChats = this.getChats.bind(this);
    this.unsub = () => {};
    this.state = {};
  }

  async getMovies(title) {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${key}&language=en-US&query=${title}&include_adult=false`
      );

      const movies = response.data.results;

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

  getChats(callback) {
    this.unsub = ratings
      // .where('room', '==', 'movie-ratings')
      .orderBy('id')
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            callback(change.doc.data());
          }
        });
      });
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
    this.getChats((data) => console.log('$$$$$', data));
  }

  componentWillUnmount() {
    this.unsub();
  }

  render() {
    return (
      <div>
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

        {this.state.rows}
      </div>
    );
  }
}
