var React = require('react');
var NewGame = require('./NewGame');
var GameHistory = require('./GameHistory');
var Pager = require('../helpers/Pager');

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.startGame = this.startGame.bind(this);
        this.viewStats = this.viewStats.bind(this);
    }

    startGame(gid) {
    	Pager.goToPath(Pager.Paths.PLAY, gid);
    }

    viewStats(gid) {
    	Pager.goToPath(Pager.Paths.STAT, gid);
    }

    render() {
        return (<div>
    				<p id="welcome">Welcome to WikiLinks, the 6 degrees of Wikipedia game. Get from a start page to an end page by navigating each article’s links. Try "Apple" to "Ray Charles" or "Tufts" to "Banana" to start!</p>
    				<NewGame onCreateGame={this.startGame}/>
    				<GameHistory onReplay={this.startGame} onViewStats={this.viewStats}/> 
				</div>);
    }
}

module.exports = Home;