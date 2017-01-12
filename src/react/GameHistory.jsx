var React = require('react');
var PathDisplay = require('./PathDisplay');
var GameStore = require('./GameStore');

class GameHistory extends React.Component {
    constructor(props) {
        super(props);
        this.onReplayButtonClicked = this.onReplayButtonClicked.bind(this);
        this.onViewStatsButtonClicked = this.onViewStatsButtonClicked.bind(this);
    }

    onReplayButtonClicked(gid) {
        this.props.onReplay(gid);
    }

    onViewStatsButtonClicked(gid) {
        this.props.onViewStats(gid);
    }

    render() {
        var self = this;
        var gameHistory = GameStore.getAllStoredGames();

        if (gameHistory.length > 0) {
            var games = [];
            for (var i = 0; i < gameHistory.length; i++) {
                (function(gid, start, end) {
                    games.push(
                        <div key={i + "historyGame"} className="historyGame">
                            <PathDisplay path={[start, end]}/>
                            <span className="options">
                                <a key={i + "replay"} onClick={function(){self.onReplayButtonClicked(gid)} }>Replay</a>
                                <a key={i + "stats"} onClick={function(){self.onViewStatsButtonClicked(gid)} }>View Stats</a>
                            </span>
                        </div>
                    );
                })(gameHistory[i].gid, gameHistory[i].start, gameHistory[i].end);
            }

            return (
                <div>
                    <h3>Choose from previous games</h3>
                    {games}
                </div>);
        } else {
            return (<div></div>)
        }
    }
}

module.exports = GameHistory;