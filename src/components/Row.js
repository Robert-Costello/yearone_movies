import {Component} from 'react';
import axios from 'axios';
const key = 'ccdaa563df49d444d84702641c61b0ac';
class Row extends Component {
  _isMounted = false;
  constructor() {
    super();

    this.viewDetails = this.viewDetails.bind(this);
    this.getDirector = this.getDirector.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.toggleDetails = this.toggleDetails.bind(this);
    this.upVote = this.upVote.bind(this);
    this.downVote = this.downVote.bind(this);
    this.state = {detailView: false};
  }
  viewDetails() {
    const id = this.props.movie.id;
    window.open(`https://www.themoviedb.org/movie/${id}`, '_blank');
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

  upVote() {
    console.log('👍');
  }

  downVote() {
    console.log('👎');
  }
  componentDidMount() {
    this._isMounted = true;
    this.getDirector(this.props.movie);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const releaseDate = this.props.movie.release_date
      ? this.props.movie.release_date
      : '';
    const newDate = this.formatDate(releaseDate);

    if (this.state.detailView) {
      return (
        <table key={this.props.movie.id}>
          <tbody>
            <tr>
              <td>
                <img
                  name="image"
                  width="120"
                  src={`http://image.tmdb.org/t/p/w185/${this.props.movie.poster_path}`}
                  alt={''}
                />
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
                  <input type="button" value="👍" onClick={this.upVote}></input>
                  <input
                    type="button"
                    value="👎"
                    onClick={this.downVote}
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
                <img
                  name="image"
                  width="120"
                  src={`http://image.tmdb.org/t/p/w185/${this.props.movie.poster_path}`}
                  alt={''}
                />
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
