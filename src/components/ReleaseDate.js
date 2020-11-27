import {Component} from 'react';

class ReleaseDate extends Component {
  releaseDate = '';
  constructor(props) {
    super(props);
    this.formatDate = this.formatDate.bind(this);
    this.state = {releaseDate: ''};
  }

  // Takes year-month-day and returns month/day/year
  formatDate(dateString) {
    const date = dateString ? dateString : '';

    if (!date.length) return;

    const formattedDate =
      date.slice(5, 7) + '/' + date.slice(8) + '/' + date.slice(0, 4);

    const released = formattedDate.length === 2 ? '' : formattedDate;

    this.releaseDate = released;
    this.setState({releaseDate: released});
  }

  componentDidMount() {
    this.formatDate(this.props.date);
  }

  render() {
    if (this.releaseDate.length) {
      return (
        <div>
          <h4>Released {this.releaseDate}</h4>
        </div>
      );
    } else return <h5>Released (unlisted)</h5>;
  }
}

export default ReleaseDate;
