var React = require('react');

class PathDisplay extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var history = this.props.path;
        var histpath = [];

        for (var i in history) {
            (function(i, obj) {
                if (i != 0) {
                    histpath.push(<span key={i + "arrow"} className="arrow">&rarr;</span>);
                }
                histpath.push(<span key={i + "historyItem"} className="historyItem">{history[i]}</span>);
            })(i, this);
        }

        return (<div className="historyContainer">{histpath}</div>);
    }
}

module.exports = PathDisplay;