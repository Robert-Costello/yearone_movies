import {Component} from 'react';
import axios from 'axios';

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

const key = 'ccdaa563df49d444d84702641c61b0ac';

class Row extends Component {
  _isMounted = false;
  imageUrl = '';
  constructor() {
    super();

    this.getDirector = this.getDirector.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.toggleDetails = this.toggleDetails.bind(this);
    this.like = this.like.bind(this);
    this.dislike = this.dislike.bind(this);
    this.getRatings = this.getRatings.bind(this);
    this.unsub = () => {};
    this.state = {detailView: false, likes: 0, dislikes: 0, movieId: ''};
  }

  async getDirector(movie) {
    try {
      const castCrewResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${key}&language=en-US
        `);

      const director = castCrewResponse.data.crew.filter(
        (person) => person.job === 'Director'
      )[0];

      movie['director'] = director ? director.name : 'unlisted';
      const directorName = movie.direct;
      if (this._isMounted) this.setState({direct: directorName});
    } catch (error) {
      console.log(error);
    }
  }

  formatDate(dateString) {
    const newDate =
      dateString.slice(5, 7) +
      '/' +
      dateString.slice(8) +
      '/' +
      dateString.slice(0, 4);
    return newDate;
  }

  toggleDetails() {
    if (!this.state.detailView) this.setState({detailView: true});
    if (this.state.detailView) this.setState({detailView: false});
  }

  like() {
    if (!this.state.movieId) {
      ratings
        .doc(String(this.props.movie.id))
        .set({
          title: this.props.movie.title,
          id: String(this.props.movie.id),
          likes: 1,
          dislikes: 0,
        })
        .then(function () {
          console.log('Document successfully written!');
        })
        .catch(function (error) {
          console.error('Error writing document: ', error);
        });
    } else {
      let count = this.state.likes + 1;
      this.setState({likes: count});
      console.log(ratings.doc(this.state.movieId));
      ratings.doc(this.state.movieId).update({
        likes: count,
      });
    }
  }

  dislike() {
    if (!this.state.movieId) {
      ratings
        .doc(String(this.props.movie.id))
        .set({
          title: this.props.movie.title,
          id: String(this.props.movie.id),
          likes: 0,
          dislikes: 1,
        })
        .then(function () {
          console.log('Document successfully written!');
        })
        .catch(function (error) {
          console.error('Error writing document: ', error);
        });
    } else {
      let count = this.state.dislikes + 1;
      this.setState({dislikes: count});
      ratings.doc(this.state.movieId).update({
        dislikes: count,
      });
    }
  }

  getRatings(callback) {
    this.unsub = ratings
      .where('id', '==', String(this.props.movie.id))
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added' || change.type === 'modified') {
            callback(change.doc.data());
          }
        });
      });
  }

  componentDidMount() {
    if (!this.props.movie.poster_path) {
      this.imageUrl =
        'https://thefemalegazers.files.wordpress.com/2018/08/coming-of-age-film.jpg';
    } else {
      this.imageUrl = `http://image.tmdb.org/t/p/w185/${this.props.movie.poster_path}`;
    }
    this._isMounted = true;
    this.getDirector(this.props.movie);
    this.getRatings((data) => {
      this.setState({
        likes: data.likes,
        dislikes: data.dislikes,
        movieId: String(data.id),
      });
      console.log('$$$$$', data);
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.unsub();
  }

  render() {
    const releaseDate = this.props.movie.release_date.length
      ? this.props.movie.release_date
      : '';
    const newDate = this.formatDate(releaseDate);

    if (this.state.detailView) {
      return (
        <table key={this.props.movie.id}>
          <tbody>
            <tr>
              <td>
                <img name="image" width="120" src={this.imageUrl} alt={''} />
              </td>
              <td>
                <h2>{this.props.movie.title}</h2>
                <p>Directed by {this.props.movie.director}</p>
                <p>Released {newDate}</p>
                <p>{this.props.movie.overview}</p>
                <input
                  type="button"
                  value="Hide details"
                  onClick={this.toggleDetails}
                ></input>
                <div>
                  <input
                    type="button"
                    value={`⭐ ${this.state.likes}`}
                    onClick={this.like}
                  ></input>
                  <input
                    type="button"
                    value={`💔 ${this.state.dislikes}`}
                    onClick={this.dislike}
                  ></input>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      );
    } else {
      return (
        <table key={this.props.movie.id}>
          <tbody>
            <tr>
              <td>
                <img name="image" width="120" src={this.imageUrl} alt={''} />
              </td>
              <td>
                <h2>{this.props.movie.title}</h2>
                {/* <p>Directed by {this.props.movie.director}</p> */}
                <p>Released {newDate}</p>
                {/* <p>{this.props.movie.overview}</p> */}
                <input
                  type="button"
                  value="Show details"
                  onClick={this.toggleDetails}
                ></input>
              </td>
            </tr>
          </tbody>
        </table>
      );
    }
  }
}

export default Row;
