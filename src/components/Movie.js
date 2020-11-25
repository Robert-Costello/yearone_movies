import {Component} from 'react';
import axios from 'axios';

import {ratings} from './Firebase';

const key = 'ccdaa563df49d444d84702641c61b0ac';

class Movie extends Component {
  _isMounted = false;
  imageUrl = '';
  constructor() {
    super();

    this.getCrewCast = this.getCrewCast.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.toggleDetails = this.toggleDetails.bind(this);
    this.rate = this.rate.bind(this);
    this.getRatings = this.getRatings.bind(this);
    this.unsub = () => {};
    this.state = {detailView: false, likes: 0, dislikes: 0, movieId: ''};
  }

  // Grabs crew (director) information from a separate endpoint from general movie info
  async getCrewCast(movie) {
    try {
      const castCrewResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${key}&language=en-US
        `);

      const director = castCrewResponse.data.crew.filter(
        (person) => person.job === 'Director'
      )[0];

      const starring = castCrewResponse.data.cast[0].name;

      movie['director'] = director ? director.name : 'unlisted';
      movie['starring'] = starring ? starring : 'unlisted';
      const directorName = movie.direct;
      if (this._isMounted)
        this.setState({direct: directorName, starring: starring});
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

  rate(e) {
    const choice = e.target.name;
    let docObj = {
      title: this.props.movie.title,
      id: String(this.props.movie.id),
      likes: 0,
      dislikes: 0,
    };

    if (choice === 'likes') docObj.likes = 1;
    else docObj.dislikes = 1;

    if (!this.state.movieId) {
      ratings
        .doc(String(this.props.movie.id))
        .set(docObj)
        .then(function () {
          console.log('Document successfully written!');
        })
        .catch(function (error) {
          console.error('Error writing document: ', error);
        });
    } else {
      let count = this.state[choice] + 1;
      if (choice === 'likes') {
        this.setState({likes: count});
        ratings.doc(this.state.movieId).update({
          likes: count,
        });
      } else {
        this.setState({dislikes: count});
        ratings.doc(this.state.movieId).update({
          dislikes: count,
        });
      }
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
      this.imageUrl = `http://image.tmdb.org/t/p/w500/${this.props.movie.poster_path}`;
    }
    this._isMounted = true;
    this.getCrewCast(this.props.movie);
    this.getRatings((data) => {
      this.setState({
        likes: data.likes,
        dislikes: data.dislikes,
        movieId: String(data.id),
      });
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.unsub();
  }

  render() {
    const releaseDate = this.props.movie.release_date
      ? this.props.movie.release_date
      : '';
    const newDate = this.formatDate(releaseDate);

    if (this.state.detailView) {
      return (
        <div>
          <div className="movie-container" key={this.props.movie.id}>
            <div className="poster">
              <img
                className="poster-image"
                name="image"
                width="350"
                src={this.imageUrl}
                alt={''}
              />
            </div>
            <div className="title">
              <h2>{this.props.movie.title}</h2>
              <div className="hide-rate">
                <input
                  className="rate-button"
                  type="button"
                  value="Hide details"
                  onClick={this.toggleDetails}
                ></input>

                <div className="rate">
                  <input
                    className="rate-button"
                    name="likes"
                    type="button"
                    value={`⭐ ${this.state.likes}`}
                    onClick={this.rate}
                  ></input>
                  <input
                    className="rate-button"
                    name="dislikes"
                    type="button"
                    value={`💔 ${this.state.dislikes}`}
                    onClick={this.rate}
                  ></input>
                </div>
              </div>
            </div>
            <div className="details">
              <h3>Directed by {this.props.movie.director}</h3>
              <h3>Starring {this.props.movie.starring}</h3>
              <h4>Released {newDate}</h4>
              <p>{this.props.movie.overview}</p>
            </div>
          </div>
          <hr></hr>
        </div>
      );
    } else {
      return (
        <div className="outter-shell">
          <div className="movie-container" key={this.props.movie.id}>
            <div className="poster">
              <img
                className="poster-image"
                name="image"
                width="200"
                src={this.imageUrl}
                alt={''}
              />
            </div>
            <div className="title">
              <h2>{this.props.movie.title}</h2>
              <input
                type="button"
                value="Show details"
                onClick={this.toggleDetails}
              ></input>
            </div>
          </div>
          <hr></hr>
        </div>
      );
    }
  }
}

export default Movie;
