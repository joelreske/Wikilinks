var React = require('react');
var GameStore = require('./GameStore');
var CircularCountdownTimer = require('./CircularCountdownTimer');
var Timer = require('./Timer');
var ArticleSelect = require('./ArticleSelect');
var Ajax = require('./Ajax');

class InGame extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showCountDownTimer: true
        }

        this.countdownDone = this.countdownDone.bind(this);
        this.onWin = this.onWin.bind(this);
        this.setEndpoints = this.setEndpoints.bind(this);
    }

    componentWillMount() {
        Ajax.run("GET", "/api/getGameData", {
            "gid": this.props.gid
        }, true, this.setEndpoints);
    }

    setEndpoints(data, error) {
        GameStore.storeGame(this.props.gid, data.start, data.end);

        this.setState({
            start: data.start,
            end: data.end
        });
    }

    onWin(path) {
        this.props.onPostGame(path, this.timer.val());
    }

    countdownDone() {
        this.startTime = new Date();
        this.setState({
            showCountDownTimer: false
        });
    }

    render() {
        if (this.state.showCountDownTimer) {
            return <CircularCountdownTimer countdownDoneCallback={this.countdownDone}/>;
        } else if (this.state.start && this.state.end) {
            return (
                <div className="inGame">
                    <h2>{this.state.start} to {this.state.end}</h2>
                    <Timer start={this.startTime} ref={(timer) => {this.timer = timer;}}/>
                    <ArticleSelect onWin={this.onWin} start={this.state.start} end={this.state.end}/>
                </div>
            );
        } else {
            return <h1>Loading...</h1>;
        }
    }
}

module.exports = InGame;