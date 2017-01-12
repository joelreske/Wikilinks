var React = require('react');
var StoredGameData = require('./StoredGameData');
var PostGame = require('./PostGame');
var GameData = require('./GameData');

class Stats extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showSave: false
        }
    }

    componentWillMount() {
        if (StoredGameData.isDataStoredForGame(this.props.params.gid)) {
            this.setState({
                showSave: true
            });
        }
    }

    render() {
        var savePrompt = null;
        if (this.state.showSave) {
            savePrompt = <PostGame gid={this.props.params.gid}/>;
        } 

        return (<div>
                    {savePrompt}
                    <GameData gid={this.props.params.gid} />
                </div>);
    }
}

module.exports = Stats;