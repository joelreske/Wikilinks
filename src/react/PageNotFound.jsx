var React = require('react');
var Link = require('react-router').Link;

class PageNotFound extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<p>Sorry, {this.props.params.splat} is not a valid page. <Link to="/">Click Here</Link> to return home.</p>);
    }
}

module.exports = PageNotFound;