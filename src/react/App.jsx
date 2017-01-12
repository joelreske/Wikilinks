var React = require('react');
var GameData = require('./GameData');
var PostGame = require('./PostGame');
var InGame = require('./InGame');
var NewGame = require('./NewGame');
var GameHistory = require('./GameHistory');

class App extends React.Component {
    constructor() {
        super();

        this.state = {
            page: "",
        };

        this.startGame = this.startGame.bind(this);
        this.onPostGame = this.onPostGame.bind(this);
        this.onPlayAgain = this.onPlayAgain.bind(this);
        this.viewStats = this.viewStats.bind(this);
        this.gohome = this.gohome.bind(this);
        this.preRender = this.preRender.bind(this);
    }

    componentWillMount() {
        var self = this;

        window.onpopstate = function(event) {
            self.gid = "";
            self.preRender();
        };

        this.preRender();
    }

    gohome() {
        window.history.pushState({}, 'WikiLinks', '/');
        this.gid = "";
        this.preRender();
    }

    startGame(gid) {
        this.gid = gid;
        window.history.pushState({}, 'WikiLinks', '/?gid=' + gid);
        this.preRender();
    }

    onPostGame(path, time) {
        window.history.replaceState({}, 'WikiLinks Game Results', '/gameResults?gid=' + this.gid);
        this.path = path;
        this.time = time;
        this.preRender(true);
    }

    onPlayAgain() {
        this.startGame(this.gid);
    }

    viewStats(gid) {
        window.history.replaceState({}, 'WikiLinks Game Results', '/gameResults?gid=' + gid);
        this.gid = gid;
        this.preRender()
    }

    preRender(getUsername) {
        if (typeof this.gid === 'undefined' || this.gid == null) {
            var pageURL = decodeURIComponent(window.location.search.substring(1)),
                gidRegx = /(?:(?:gid=)([a-zA-Z0-9~\-_]*))/,
                gid = gidRegx.exec(pageURL);

            if (gid) {
                gid = gid[1];
                var self = this;

                performAjax("GET", "/api/isValidGid", {
                    "gid": gid
                }, true, function(data, error) {
                    if (data.valid) {
                        self.gid = gid;
                        self.preRender();
                    } else {
                        window.alert("Invalid Game Id");
                        self.gohome();
                    }
                });
            }
        } else {
            var page = "";

            if (this.gid && window.location.pathname == "/gameResults") {
                if (getUsername) {
                    page = "postGame"
                } else {
                    page = "gameResults";
                }
            } else if (this.gid) {
                page = "inGame"
            } else {
                page = "newGame"
            }

            this.setState({
                "page": page
            });
        }
    }

    render() {
        var contents;

        if (this.state.page == "gameResults") {
            contents = <GameData gid={this.gid} onPlayAgain={this.onPlayAgain} onPlayNewGame={this.gohome}/>
        } else if (this.state.page == "postGame") {
            contents = (
                <div>
                    <GameData gid={this.gid} onPlayAgain={this.onPlayAgain} onPlayNewGame={this.gohome}/> 
                    <PostGame path={this.path} time={this.time} gid={this.gid}/>
                </div>);
        } else if (this.state.page == "inGame") {
            contents = <InGame gid={this.gid} onPostGame={this.onPostGame}/>;
        } else {
            contents = (<div>
                        <p id="welcome">Welcome to WikiLinks, the 6 degrees of Wikipedia game. Get from a start page to an end page by navigating each article’s links. Try "Apple" to "Ray Charles" or "Tufts" to "Banana" to start!</p>
                        <NewGame onCreateGame={this.startGame}/>
                        <GameHistory onReplay={this.startGame} onViewStats={this.viewStats}/> 
                    </div>);
        }

        return (
            <div id="mainContainer">
                <main>
                    <header>
                        <h1 onClick={this.gohome}>WikiLinks</h1>
                    </header>
                    <section id="main-content">
                        {contents}
                    </section>
                </main>
                <footer>
                    <p>Copyright &copy; {new Date().getFullYear()} All Right Reserved </p>
                    <p><a href="http://tobyglover.com" target="_blank">Toby Glover</a> and <a href="https://github.com/joelreske" target="_blank">Joel Reske</a> (<a href="https://github.com/joelreske/Wikilinks" target="_blank">Source</a> and <a href="http://comp20.wikilinks.io" target="_blank">Original Version</a>, with help from <a href="https://github.com/rgalbiati" target="_blank">Raina Galbiati</a> and <a href="https://github.com/asmith1" target="_blank">Ashley Smith</a>)</p>
                </footer>
            </div>
        );
    }
}

module.exports = App;