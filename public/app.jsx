var gamestore = new GameStore();

class NewGamePageForm extends React.Component {
    constructor(props) {
        super(props);
        this.randomize = this.randomize.bind(this);
        this.parsePageEntry = this.parsePageEntry.bind(this);
    }

    render() {
        return (
            <div className="form-group form-group-border">
                <label htmlFor={this.props.id}>{this.props.label}</label>
                <input type="text" className="input-sm" id={this.props.id} placeholder={this.props.placeholder} onChange={this.parsePageEntry} ref={(input) => {this.textInput = input;}}/>
                <button className="btn btn-default" onClick={this.randomize}>Randomize</button>
            </div>
        );
    }

    randomize() {
        var textInput = this.textInput;

        $.getJSON("/api/getRandomPage", function(data) {
            textInput.value = data.pageTitle;
        });
    }

    parsePageEntry() {
        var urlRegx = /(?:http:\/\/|https:\/\/)en.wikipedia.org\/wiki\/([^#<>[\]|{}]*)/i;
        var match = urlRegx.exec(this.textInput.value);

        if (match) {
            var pagetitle = match[1].replace(/_/g, " ");
            this.textInput.value = pagetitle;
        }
    }

    val() {
        return this.textInput.value;
    }
}

class NewGame extends React.Component {
    constructor(props) {
        super(props);
        this.checkPages = this.checkPages.bind(this);
        this.startGame = this.startGame.bind(this);
    }

    componentDidMount() {
        var self = this;

        $('#newGameContainer').keypress(function(e) {
            if (e.which == 13) {
                self.startGame();
            }
        });
    }

    render() {
        return (
            <div>
            <h2>Create a new Game:</h2>
                <div id="newGameContainer">
                    <div>
                        <NewGamePageForm id="startPage" label="Start Page:" placeholder="Enter Start Page" ref={(input) => {this.startInput = input;}}/>
                        <NewGamePageForm id="endPage" label="End Page:" placeholder="Enter End Page" ref={(input) => {this.endInput = input;}}/>
                    </div>
                    <button className="btn btn-default" id="startBtn" onClick={this.startGame}>Start Game</button>
                </div>
            </div>
        );

    }

    checkPages(callback) {
        var startPage = this.startInput.val();
        var endPage = this.endInput.val();

        if (startPage == "") {
            window.alert("Start is empty");
        } else if (endPage == "") {
            window.alert("End is empty");
        } else if (startPage == endPage) {
            window.alert("Start and end cannot be the same");
        } else {
            $.getJSON("/api/isWikipediaPage?page=" + startPage, function(data) {
                if (!data.valid) {
                    window.alert("Start is not a valid Wikipedia Page");
                } else {
                    $.getJSON("/api/isWikipediaPage?page=" + endPage, function(data) {
                        if (!data.valid) {
                            window.alert("End is not a valid Wikipedia Page");
                        } else {
                            callback(startPage, endPage);
                        }
                    });
                }
            });
        }
    }

    startGame() {
        var onCreateGame = this.props.onCreateGame;
        this.checkPages(function(start, end) {
            $.getJSON("/api/startGame?start=" + start + "&end=" + end, function(data) {
                $("#newGameContainer").fadeOut(400, function() {
                    onCreateGame(data.gid);
                });
            });
        });
    }
}

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
        var gameHistory = gamestore.getAllStoredGames();

        if (gameHistory.length > 0) {
            var games = [];
            for (var i = 0; i < gameHistory.length; i++) {
                (function(gid, start, end) {
                    games.push(
                        <div>
                            <PathDisplay path={[start, end]}/>
                            <button className="btn btn-default" key={i + "replay"} onClick={function(){self.onReplayButtonClicked(gid)} }>Replay</button>
                            <button className="btn btn-default" key={i + "states"} onClick={function(){self.onViewStatsButtonClicked(gid)} }>View Stats</button>
                        </div>
                    );
                })(gameHistory[i].gid, gameHistory[i].start, gameHistory[i].end);
            }

            return (
                <div>
                    <h2>Or, view your previous games:</h2>
                    {games}
                </div>);
        } else {
            return (<div></div>)
        }
    }
}

class CircularCountdownTimer extends React.Component {
    constructor(props) {
        super(props);
        this.initialOffset = 440;
        this.time = 3;
        this.i = 0;

        this.tick = this.tick.bind(this);
    }

    componentDidMount() {
        this.circle.style.strokeDashoffset = this.initialOffset;
        this.timer = setInterval(this.tick, 1000);
    }

    tick() {
        if (this.i == this.time) {
            this.header.innerHTML = "GO";
            clearInterval(this.timer);
            $("#CircularCountdownTimer").fadeOut(400, this.props.countdownDoneCallback);
        } else {
            this.header.innerHTML = this.time - this.i;
            this.circle.style.strokeDashoffset = this.initialOffset - (this.i + 1) * (this.initialOffset / this.time);
            this.i++;
        }
    }

    render() {
        return (
            <div id="CircularCountdownTimer">
                <h2 ref={(elm) => {this.header = elm;}}></h2>
                <svg width="160" height="160" xmlns="http://www.w3.org/2000/svg">
                    <circle id="circle_animation" r="69.85699" cy="81" cx="81" align="center" ref={(elm) => {this.circle = elm;}}/>
                </svg>
            </div>
        );
    }
}

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
        return <p style={{color:"white"}}>Time Since Start: <b>{this.state.elapsed } seconds</b></p>;
    }
}

class PathDisplay extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var history = this.props.path;
        var histpath = [];

        for (var i in history) {
            (function(i, obj) {
                var historyItem = <span key={i} className="historyItem">{history[i]}</span>;

                if (i != history.length - 1) {
                    histpath.push(<span>
                                    {historyItem}
                                    <img key={(i + 1) + "img"} className="rightArrow" src="/images/right-arrow.png"/>
                                  </span>);
                } else {
                    histpath.push(historyItem);
                }
            })(i, this);
        }

        return (<div>{histpath}</div>);
    }
}

class ArticleSelect extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            history: [],
            searchString: ""
        };

        this.getLinksForPage = this.getLinksForPage.bind(this);
        this.showLinks = this.showLinks.bind(this);
        this.search = this.search.bind(this);
    }

    componentWillMount() {
        this.nextPage(this.props.start);
    }

    nextPage(page) {
        console.log("Going to: " + page);
        this.state.history.push(page)

        if (page == this.props.end) {
            this.props.onWin(this.state.history);
        } else {
            this.getLinksForPage(page, this.showLinks);
        }
    }

    getLinksForPage(page, callback) {
        if (page) {
            $.getJSON("/api/getLinksForPage?page=" + page, callback);
        } else {
            console.log("Shoot.");
        }
    }

    showLinks(data) {
        this.searchInput.value = "";

        this.setState({
            article: data,
            searchString: ""
        });
    }

    search() {
        this.setState({
            searchString: this.searchInput.value
        });
    }

    render() {
        var data = this.state.article;
        var searchString = this.state.searchString;

        var links = []

        for (var i in data) {
            (function(i, obj) {
                var articleName = data[i];
                var searchRegex = new RegExp("^" + searchString + ".*", "i")

                if (searchRegex.test(articleName) || articleName == obj.props.end) {
                    if (articleName == obj.props.end) {
                       var btn = <button className="btn btn-default endbtn" key={i} onClick={() => obj.nextPage(articleName)}>{articleName}</button>; 
                    } else {
                        var btn = <button className="btn btn-default" key={i} onClick={() => obj.nextPage(articleName)}>{articleName}</button>;
                    }

                    links.push(btn);
                }
            })(i, this);
        }

        return (
            <div className="container">
                <p>Destination: {this.props.end}</p>
                <PathDisplay path={this.state.history}/>
                <input type="text" key="search" className="input-sm" id="search" placeholder="Search" onChange={this.search} ref={(input) => {this.searchInput = input;}}/>
                <div>{links}</div>
            </div>
        );
    }
}

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
        $.getJSON("/api/getGameData?gid=" + this.props.gid, this.setEndpoints);
    }

    setEndpoints(data) {
        var data = data[0];
        gamestore.storeGame(this.props.gid, data.start, data.end);

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
                <div>
                    <Timer start={this.startTime} ref={(timer) => {this.timer = timer;}}/>
                    <ArticleSelect onWin={this.onWin} start={this.state.start} end={this.state.end}/>
                </div>
            );
        } else {
            return <h1>Loading...</h1>;
        }
    }
}

class PostGame extends React.Component {
    constructor(props) {
        super(props);

        this.sendScore = this.sendScore.bind(this);
    }

    componentDidMount() {
        var self = this;

        $('#name').keypress(function(e) {
            if (e.which == 13) {
                self.sendScore();
            }
        });
    }

    sendScore() {
        if (this.textInput.value != "") {
            $("#username-status").css("padding", 0);
            $("#username-status").attr("src", "/images/spinner.gif").height(30).width(30)

            $.post("/api/endGame", {'gid': this.props.gid, 'username':this.textInput.value, 'path':this.props.path}, function (data, status) {
                $("#username-status").attr("src", "/images/checkmark.png");
                $("#username-collection").fadeOut(1000);
            });
        } else {
            window.alert("Username field cannot be empty");
        }
    }

    render() {
        return (
        <span>
            <div id="PostGame">
                <h1>YOU WON</h1>
                <h2>And you did it in {this.props.time} seconds.</h2>
                <PathDisplay path={this.props.path}/>
                <div id="username-collection" className="form-group" ref={(form) => {this.form = form;}}>
                    <label htmlFor="name">Enter your name to save your score:</label>
                    <span id="name-group">
                        <input type="text" className="input-sm" id="name" placeholder="Name" ref={(input) => {this.textInput = input;}}/>
                        <button className="btn btn-default" onClick={this.sendScore}>Send Score</button>
                        <img id="username-status" ref={(img) => {this.img = img;}}/>
                    </span>
                </div>
            </div>
        </span>
        );
    }
}

class GameData extends React.Component { 
    constructor(props) {
        super(props);
        this.playAgain = this.playAgain.bind(this);
    }

    playAgain() {
        this.props.onPlayAgain();
    }

    render() {
        // placeholder
        return (
            <div id="GameData">
                <div style={{width:'50%', height:'300px', backgroundColor:'gray', margin:'0 auto'}}>
                    Graph goes here
                </div>
                <button className="btn btn-default" id="startBtn" onClick={this.playAgain}>Play Again</button>
            </div>
        );
    }
}

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
    }

    componentWillMount() {
        var self = this;

        window.onpopstate = function(event) {
            self.gid = "";
            self.preRender();
        };

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
        window.history.replaceState({}, 'WikiLinks Game Results', '/gameResults?gid=' + this.gid);
        this.preRender()
    }

    preRender(getUsername) {
        if (!this.gid) {
            var pageURL = decodeURIComponent(window.location.search.substring(1)),
            gidRegx = /(?:(?:gid=)([a-zA-Z0-9~\-_]*))/,
            gid = gidRegx.exec(pageURL);
            if (gid) {
                this.gid = gid[1];
            }
        }

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
            "page":page
        });
    }

    render() {
        if (this.state.page == "gameResults") {
            return <GameData gid={this.gid} onPlayAgain={this.onPlayAgain}/>
        } else if (this.state.page == "postGame") {
            return (
                <div>
                    <PostGame path={this.path} time={this.time} gid={this.gid}/>
                    <GameData gid={this.gid} onPlayAgain={this.onPlayAgain}/> 
                </div>);
        } else if (this.state.page == "inGame") {
            return <InGame gid={this.gid} onPostGame={this.onPostGame}/>;
        } else {
            return (<div>
                        <NewGame onCreateGame={this.startGame}/>
                        <GameHistory onReplay={this.startGame} onViewStats={this.viewStats}/> 
                    </div>);
        }
    }
}

ReactDOM.render(<App/>, document.getElementById('app'));