var React = require('react');

class Timer extends React.Component {
    constructor(props) {
        super(props);

        this.tick = this.tick.bind(this);
        this.state = {
            elapsed: 0
        };
    }

    componentDidMount() {
        this.timer = setInterval(this.tick, 100);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    tick() {
        this.setState({
            elapsed: this.diff()
        });
    }

    val() {
        return this.diff();
    }

    diff() {
        return (Math.round((new Date() - this.props.start) / 100) / 10).toFixed(1);
    }

    render() {
        return <h2><b>{this.state.elapsed } seconds</b></h2>;
    }
}

module.exports = Timer;