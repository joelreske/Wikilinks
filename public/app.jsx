var gamestore = new GameStore();

function performAjax(method, url, data, parse, callback) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            var error = true;
            var resData = null;

            if (this.status == 200) {
                error = false;
                resData = this.responseText;
                if (parse) {
                    resData = JSON.parse(this.responseText);
                }
            }
            callback(resData, error);
        }
    };

    var dataString = "";

    if (data != null) {
        if (method == "GET") {
            url += "?";
            for (var key in data) {
                url += key + "=" + data[key] + "&";
            }
        } else {
            dataString = JSON.stringify(data);
        }

    }
    xhr.open(method, url, true);

    if (method == "GET") {
        xhr.send();
    } else {
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(dataString);
    }

}

class TextInput extends React.Component {
    constructor(props) {
        super(props);

        this.textDidChange = this.textDidChange.bind(this);
        this.onFocus = this.onFocus.bind(this);
    }

    textDidChange() {
        if (this.props.onTextChange) {
            this.props.onTextChange(this.refs.input.value);
        }
    }

    onFocus() {
        if (this.props.onFocus) {
            this.props.onFocus();
        }
    }

    select() {
        this.refs.input.select();
    }

    val() {
        return this.refs.input.value;
    }

    setVal(text) {
        this.refs.input.value = text;
    }

    componentDidMount() {
        if (this.props.focus) {
            this.refs.input.focus();
        }
        if (this.props.value) {
            this.setVal(this.props.value);
        }
    }

    render() {
        return <input id={this.props.id} type="text" autoComplete="off" onChange={this.textDidChange} ref='input' placeholder={this.props.placeholder} onFocus={this.onFocus}/>
    }
}

class NewGamePageForm extends React.Component {
    constructor(props) {
        super(props);
        this.randomize = this.randomize.bind(this);
        this.parsePageEntry = this.parsePageEntry.bind(this);
    }

    render() {
        return (
            <div className="newGameOption">
                <TextInput onTextChange={this.parsePageEntry} placeholder={this.props.placeholder} ref="input" initialValue={this.props.initialValue}/>
                <div>
                    <label>{this.props.label}</label>
                    <a onClick={this.randomize}>Randomize</a>
                </div>
            </div>
        );
    }

    randomize() {
        var input = this.refs.input;

        performAjax("GET", "/api/getRandomPage", null, true, function(data, err) {
            console.log(data);
            input.setVal(data.pageTitle);
        });
    }

    parsePageEntry() {
        var urlRegx = /(?:http:\/\/|https:\/\/)en.wikipedia.org\/wiki\/([^#<>[\]|{}]*)/i;
        var match = urlRegx.exec(this.refs.input.val());

        if (match) {
            var pagetitle = match[1].replace(/_/g, " ");
            this.refs.input.setVal(pagetitle);
        }
    }

    val() {
        return this.refs.input.val();
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

        document.getElementById('newGameContainer').addEventListener('keypress', function(e) {
            var key = e.which || e.keyCode;
            if (key === 13) {
                e.preventDefault();
                self.startGame();
                return false;
            }
        });
    }

    render() {
        return (
            <section id="newGameContainer">
                <div>
                    <NewGamePageForm id="startPage" label="Start Page" placeholder="Enter Start Page" ref='startInput' initialValue='Apple'/>
                    <NewGamePageForm id="endPage" label="End Page" placeholder="Enter End Page" ref='endInput' initialValue='Adolf Hitler'/>
                </div>
                <button id="startBtn" className="winlinkbtn" onClick={this.startGame}>Start Game</button>
            </section>
        );

    }

    checkPages(callback) {
        var startPage = this.refs.startInput.val();
        var endPage = this.refs.endInput.val();

        if (startPage == "") {
            window.alert("Start is empty");
        } else if (endPage == "") {
            window.alert("End is empty");
        } else if (startPage == endPage) {
            window.alert("Start and end cannot be the same");
        } else {
            performAjax("GET", "/api/isWikipediaPage", {
                page: startPage
            }, true, function(data, error) {
                if (!data.valid) {
                    window.alert("Start is not a valid Wikipedia Page");
                } else {
                    performAjax("GET", "/api/isWikipediaPage", {
                        page: endPage
                    }, true, function(data, error) {
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
            performAjax("GET", "/api/startGame", {
                "start": start,
                "end": end
            }, true, function(data, error) {
                onCreateGame(data.gid);
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
            this.props.countdownDoneCallback();
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
        return <h2><b>{this.state.elapsed } seconds</b></h2>;
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
                if (i != 0) {
                    histpath.push(<span key={i + "arrow"} className="arrow">&rarr;</span>);
                }
                histpath.push(<span key={i + "historyItem"} className="historyItem">{history[i]}</span>);
            })(i, this);
        }

        return (<div className="historyContainer">{histpath}</div>);
    }
}

class ArticleSelect extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            history: [],
            searchString: ""
        };

        this.showLinks = this.showLinks.bind(this);
        this.search = this.search.bind(this);
    }

    componentWillMount() {
        this.nextPage(this.props.start);

        window.addEventListener("keydown", function(e) {
            if ((e.ctrlKey || e.metaKey) && e.keyCode === 70) {
                e.preventDefault();
                document.getElementById("search").focus();
            }
        })
    }

    nextPage(page) {
        console.log("Going to: " + page);
        this.state.history.push(page);

        if (page == this.props.end) {
            this.props.onWin(this.state.history);
        } else {
            performAjax("GET", "/api/getLinksForPage", {
                "page": page
            }, true, this.showLinks);
        }
    }

    showLinks(data, error) {
        this.refs.search.setVal("");

        this.setState({
            article: data,
            searchString: ""
        });
    }

    search(text) {
        this.setState({
            searchString: text
        });
    }

    render() {
        var data = this.state.article;
        var searchString = this.state.searchString;

        var links = [];

        for (var i in data) {
            (function(i, obj) {
                var articleName = data[i];
                var searchRegex;
                if (searchString.length < 2) {
                    searchRegex = new RegExp("^" + searchString + ".*", "i");
                } else {
                    searchRegex = new RegExp("" + searchString + "", "i");
                }

                if (searchRegex.test(articleName) || articleName == obj.props.end) {
                    if (articleName == obj.props.end) {
                        var btn = <button key={i} className="winlinkbtn" onClick={() => obj.nextPage(articleName)}>{articleName}</button>;
                    } else {
                        var btn = <button key={i} onClick={() => obj.nextPage(articleName)}>{articleName}</button>;
                    }

                    links.push(btn);
                }
            })(i, this);
        }
        // <PathDisplay path={this.state.history}/>
        return (
            <div>
                <h2>You are on <b>{this.state.history[this.state.history.length - 1]}</b></h2>
                <TextInput id="search" focus={true} placeholder="Search" onTextChange={this.search} ref="search"/>
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
        performAjax("GET", "/api/getGameData", {
            "gid": this.props.gid
        }, true, this.setEndpoints);
    }

    setEndpoints(data, error) {
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

class Modal extends React.Component {
    constructor(props) {
        super(props);
        if (this.props.id == null) {
            this.id = "";
        } else {
            this.id = this.props.id;
        }

        this.close = this.close.bind(this);
    }

    close() {
        this.props.onHide();
    }

    render() {
        if (!this.props.show) {
            return <div></div>;
        }

        return (<div id={this.id}>
                    <div className="modal-background" onClick={this.close}></div>
                    <div className="modal-foreground">
                        <div className="modal-content">
                            {this.props.children}
                        </div>
                        <div className="close">
                            <button onClick={this.close}>Close</button>
                        </div>
                    </div>
                </div>);

    }
}

class PostGame extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            show: true
        };
        this.sent = false;
        this.sendScore = this.sendScore.bind(this);
        this.close = this.close.bind(this);
    }

    componentDidMount() {
        var self = this;

        document.getElementById('name').addEventListener('keypress', function(e) {
            var key = e.which || e.keyCode;
            if (key === 13) {
                e.preventDefault();
                self.sendScore();
                return false;
            }
        });
    }

    sendScore() {
        var name = ReactDOM.findDOMNode(this.refs.name).value;
        if (name != "" && !this.sent) {
            var ajaxStatus = this.refs.img;
            ajaxStatus.style.padding = 0;
            ajaxStatus.style.height = "30px";
            ajaxStatus.style.width = "30px";
            ajaxStatus.src = "/images/spinner.gif";
            var self = this;
            performAjax("POST", "/api/endGame", {
                'gid': this.props.gid,
                'username': name,
                'path': this.props.path,
                'time': this.props.time
            }, false, function(data, status) {
                ajaxStatus.src = "/images/checkmark.png";
                self.sent = true
            });
        } else {
            window.alert("Username field cannot be empty");
        }
    }

    close() {
        this.setState({
            show: false
        });
    }

    render() {
        return (
            <Modal show={this.state.show} onHide={this.close}>
                <h1>YOU WON</h1>
                <h2>And you did it in <b>{this.props.time}</b> seconds.</h2>
                <PathDisplay path={this.props.path}/>
                <div id="sendName">
                    <label>Enter your name to save your score:</label>
                    <TextInput id="name" placeholder="Name" ref="name"/>
                    <div id="sendContainer">
                        <button onClick={this.sendScore}>Send Score</button>
                        <img className="ajax-status" ref="img"/>
                    </div>
                </div>
            </Modal>
        );
    }
}

class GameData extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showShare: false,
            start: "",
            end: "",
        };

        this.playAgain = this.playAgain.bind(this);
        this.share = this.share.bind(this);
        this.shareClose = this.shareClose.bind(this);
        this.drawChart = this.drawChart.bind(this);
        this.getChartData = this.getChartData.bind(this);
        this.playNewGame = this.playNewGame.bind(this);
        this.dataDidLoad = this.dataDidLoad.bind(this);
        this.selectLink = this.selectLink.bind(this);

        var self = this;
        performAjax("GET", "/api/getGameData", {
            "gid": this.props.gid
        }, true, function(data, error){
            self.setState({start: data.start, end: data.end});
        });
    }

    componentDidMount() {
        var self = this;
        window.onresize = this.getChartData;

        google.charts.load('current', {
            'packages': ['scatter']
        });
        google.charts.setOnLoadCallback(function() {
            self.getChartData();
            setInterval(self.getChartData, 10000);
        });
    }

    getChartData() {
        performAjax("GET", "/api/getGameResults", {
            "gid": this.props.gid
        }, true, this.dataDidLoad)
    }

    dataDidLoad(data, error) {
        this.currentChartData = new google.visualization.DataTable(data["data"]);
        this.currentChartOptions = data.options;
        this.drawChart()
    }

    drawChart() {
        if (!this.chart) {
            this.chart = new google.charts.Scatter(this.refs.chart);
        }

        this.chart.draw(this.currentChartData, this.currentChartOptions);
    }

    playAgain() {
        this.props.onPlayAgain();
    }

    playNewGame() {
        this.props.onPlayNewGame();
    }

    shareClose() {
        this.setState({
            showShare: false
        });
    }

    share() {
        var emailRegex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
        var email = this.refs.email.val();
        var name = this.refs.name.val();
        var friendName = this.refs.friendName.val();

        if (name == "" || email == "" || friendName == "") {
            window.alert("All fields must be set");
        } else if (!emailRegex.test(email)) {
            window.alert("Invalid email");
        } else {
            var ajaxStatus = this.refs.img;
            ajaxStatus.style.height = "30px";
            ajaxStatus.style.width = "30px";
            ajaxStatus.src = "/images/spinner.gif";

            var emailInput = this.refs.email;
            var friendNameInput = this.refs.friendName;

            performAjax("POST", "/api/share", {
                'userName': name,
                'friendName': friendName,
                'email': email,
                'gid': this.props.gid
            }, false, function(data, status) {
                ajaxStatus.src = "/images/checkmark.png";
                emailInput.value = "";
                friendNameInput.value = "";
            });
        }
    }

    selectLink() {
        this.refs.link.select();
    }

    render() {
        var path = "";
        if (this.state.start && this.state.end){
            path = <h2 style={{fontFamily: "'Lora', serif"}}><b>{this.state.start}</b> to <b>{this.state.end}</b></h2>;
        }
        return (
            <div id="GameData">
                <h1>Game Results</h1>
                {path}
                <div id="chart" ref="chart"></div>
                <span className="buttonContainer">
                    <button onClick={()=>{this.setState({ showShare: true })}}>Share</button>
                    <button onClick={this.playNewGame}>New Game</button>
                    <button onClick={this.playAgain}>Replay</button>
                </span>

                <Modal id="sharePopup" show={this.state.showShare} onHide={this.shareClose}>
                    <h2>Share by email</h2>
                    <TextInput id="name" placeholder="Your Name" ref="name"/>
                    <TextInput id="friendName" placeholder="Friend's Name" ref="friendName"/>
                    <TextInput id="email" placeholder="Their Email" ref="email"/>
                    <div id="sendContainer">
                        <button id="sendEmail" onClick={this.share}>Send</button>
                        <img className="ajax-status" ref="img"/>
                    </div>
                    <div id="sendLinkContainer">
                        <h2>Or send a link</h2>
                        <TextInput ref="link" value={window.location.origin + window.location.search} onFocus={this.selectLink}/>
                    </div>
                </Modal>
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
                        <p id="welcome">Welcome to WikiLinks, the 6 degrees of Wikipedia game. Get from a start page to an end page by navigating each article’s links. Try "Apple" to "Adolf Hitler" or "Tufts" to "Banana" to start!</p>
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
                    <p>Created by <a href="http://tobyglover.com" target="_blank">Toby Glover</a>, <a href="https://github.com/joelreske"  target="_blank">Joel Reske</a>, <a href="https://github.com/rgalbiati" target="_blank">Raina Galbiati</a>, and <a href="https://github.com/asmith1" target="_blank">Ashley Smith</a></p>
                </footer>
            </div>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById('app'));
