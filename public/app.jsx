var gamestore = new GameStore();

var Modal = ReactBootstrap.Modal;
var OverlayTrigger = ReactBootstrap.OverlayTrigger;
var Button = ReactBootstrap.Button;
var Form = ReactBootstrap.Form;
var FormGroup = ReactBootstrap.FormGroup;
var ControlLabel = ReactBootstrap.ControlLabel;
var FormControl = ReactBootstrap.FormControl;
var InputGroup = ReactBootstrap.InputGroup;
var Tabs = ReactBootstrap.Tabs;
var Tab = ReactBootstrap.Tab;
var ButtonToolbar = ReactBootstrap.ButtonToolbar

class TextInput extends React.Component {
    constructor(props) {
        super(props);

        this.textDidChange = this.textDidChange.bind(this);
    }

    textDidChange() {
        if (this.props.onTextChange) {
            this.props.onTextChange(this.refs.input);
        }
    }

    val() {
        return this.refs.input.value;
    }

    render() {
        return <input id={this.props.id} type="text" onchange={this.textDidChange} ref='input' placeholder={this.props.placeholder}/>
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
                    <a onclick={this.randomize}>Randomize</a>
                </div>
            </div>
        );
    }

    randomize() {
        $.getJSON("/api/getRandomPage", function(data) {
            this.refs.input.value = data.pageTitle;
        });
    }

    parsePageEntry() {
        var urlRegx = /(?:http:\/\/|https:\/\/)en.wikipedia.org\/wiki\/([^#<>[\]|{}]*)/i;
        var match = urlRegx.exec(this.refs.input.value);

        if (match) {
            var pagetitle = match[1].replace(/_/g, " ");
            this.refs.input.value = pagetitle;
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

        $('#newGameContainer').keypress(function(e) {
            if (e.which == 13) {
                self.startGame();
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
                <button id="startBtn" onClick={this.startGame}>Start Game</button>
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
                        <div key={i + "historyGame"} className="historyGame">
                            <PathDisplay path={[start, end]}/>
                            <span className="buttonContainer" key={i + "buttonContainer"}>
                                <ButtonToolbar>
                                    <Button key={i + "replay"} onClick={function(){self.onReplayButtonClicked(gid)} }>Replay</Button>
                                    <Button key={i + "stats"} onClick={function(){self.onViewStatsButtonClicked(gid)} }>View Stats</Button>
                                </ButtonToolbar>
                            </span>
                        </div>
                    );
                })(gameHistory[i].gid, gameHistory[i].start, gameHistory[i].end);
            }

            return (
                <div>
                    <h2>Or, choose from your previous games:</h2>
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
                var historyItem = <span key={i + "historyItem"} className="historyItem">{history[i]}</span>;

                if (i != 0) {
                    histpath.push(<span key={i + "historyItemContainer"} className="pathWrapper">
                                    <img key={(i + 1) + "img"} className="rightArrow" src="/images/right-arrow.png"/>
                                    {historyItem}
                                  </span>);
                } else {
                    histpath.push(historyItem);
                }
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
        ReactDOM.findDOMNode(this.refs.search).value = "";

        this.setState({
            article: data,
            searchString: ""
        });
    }

    search() {
        var search = ReactDOM.findDOMNode(this.refs.search);
        this.setState({
            searchString: search.value
        });
    }

    render() {
        var data = this.state.article;
        var searchString = this.state.searchString;

        var links = []

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
                       var btn = <Button key={i} bsClass="btn btn-success linkbtn" onClick={() => obj.nextPage(articleName)}>{articleName}</Button>; 
                    } else {
                        var btn = <Button key={i} bsClass="btn btn-default linkBtn" onClick={() => obj.nextPage(articleName)}>{articleName}</Button>;
                    }

                    links.push(btn);
                }
            })(i, this);
        }

        return (
            <div className="container">
                <p>Destination: {this.props.end}</p>
                <PathDisplay path={this.state.history}/>
                <FormControl bsSize="sm" type="text" id="search" key="search" placeholder="Search" onChange={this.search} ref="search"/>
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

        this.state = {
            show: true
        };

        this.sendScore = this.sendScore.bind(this);
        this.close = this.close.bind(this);
    }

    componentDidMount() {
        var self = this;

        $('#name').keypress(function(e) {
            if (e.which == 13) {
                e.preventDefault();
                self.sendScore();
                return false;
            }
        });
    }

    sendScore() {
        var name = ReactDOM.findDOMNode(this.refs.name).value;
        if (name != "") {
            $("#ajax-status").css("padding", 0);
            $("#ajax-status").attr("src", "/images/spinner.gif").height(30).width(30);

            $.post("/api/endGame", {'gid': this.props.gid, 'username':name, 'path':this.props.path, 'time':this.props.time}, function (data, status) {
                $("#ajax-status").attr("src", "/images/checkmark.png");
                $("#username-collection").fadeOut(1000);
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
             <Modal id="win-popup" bsSize="large" show={this.state.show} onHide={this.close}>
                <Modal.Body>
                    <h1>YOU WON</h1>
                    <h2>And you did it in {this.props.time} seconds.</h2>
                    <PathDisplay path={this.props.path}/>
                    <div id="username-collection">
                        <Form inline>
                            <FormGroup controlId="name-group">
                                <ControlLabel>Enter your name to save your score:</ControlLabel>
                                <InputGroup>
                                    <FormControl bsSize="sm" type="text" id="name" placeholder="Name" ref="name"/>
                                    <InputGroup.Button>
                                        <Button onClick={this.sendScore}>Send Score</Button>
                                    </InputGroup.Button>
                                </InputGroup>
                            </FormGroup>
                            <img id="ajax-status" ref={(img) => {this.img = img;}}/>
                        </Form>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.close}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

class GameData extends React.Component {
    constructor(props) {
        super(props);
        this.playAgain = this.playAgain.bind(this);
        this.addTextToShareTab = this.addTextToShareTab.bind(this);
        this.share = this.share.bind(this);
        this.shareClose = this.shareClose.bind(this);
        this.drawChart = this.drawChart.bind(this);
        this.getChartData = this.getChartData.bind(this);
        this.playNewGame = this.playNewGame.bind(this);

        this.state = {
            showShare: false
        };
    }

    componentDidMount() {
        var self = this;
        window.onresize = this.getChartData;

        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(function () {
            self.getChartData();
            setInterval(self.getChartData, 10000);
        });
    }

    getChartData() {
        var gid = this.props.gid;

        var jsonData = $.ajax({
            url: "/api/getGameResults?gid=" + gid,
            dataType: "json",
            async: false
        }).responseJSON;

        this.currentChartData = new google.visualization.DataTable(jsonData["data"]);
        this.currentChartOptions = jsonData.options;
        this.drawChart()
    }

    drawChart() {
        if (!this.chart) {
            this.chart = new google.visualization.ScatterChart(this.refs.chart);
        }
        
        this.chart.draw(this.currentChartData, this.currentChartOptions);
    }

    playAgain() {
        this.props.onPlayAgain();
    }

    playNewGame() {
        this.props.onPlayNewGame();
    }

    addTextToShareTab() {
        this.link.value = window.location.origin + window.location.search;
        this.link.select();
    }

    shareClose() {
        this.setState({
            showShare: false
        });
    }

    share() {
        var emailRegex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
        var email = this.email.value;
        var name = this.name.value;
        var friendName = this.friendName.value;

        if (name == "" || email == "" || friendName == "") {
            window.alert("All fields must be set");
        } else if (!emailRegex.test(email)) {
            window.alert("Invalid email");
        } else {
            $("#ajax-status").css("padding", 0);
            $("#ajax-status").attr("src", "/images/spinner.gif").height(30).width(30);

            var emailInput = this.email;
            var friendNameInput = this.friendName;
            $.post("/api/share", {'userName': name, 'friendName': friendName, 'email':email, 'gid': this.props.gid}, function (data, status) {
                $("#ajax-status").attr("src", "/images/checkmark.png");
                emailInput.value = "";
                friendNameInput.value = "";
            });
        }
    }

    render() {

        return (
            <div id="GameData">
                <h1>Game Results</h1>
                <div id="chart" ref="chart"></div>
                <span className="buttonContainer">
                    <ButtonToolbar>
                        <Button onClick={()=>{this.setState({ showShare: true })}}>Share</Button>
                        <Button onClick={this.playAgain}>Play Again</Button>
                        <Button onClick={this.playNewGame}>Play New Game</Button>
                    </ButtonToolbar>
                </span>

                <Modal id="share-popup" bsSize="small" show={this.state.showShare} onHide={this.shareClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Share</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Tabs id="share-tabs" defaultActiveKey={1}>
                            <Tab eventKey={1} title="Email">
                                <Form>
                                    <FormGroup controlId="share-email-group">
                                        <ControlLabel>Your name</ControlLabel>
                                        <FormControl bsSize="sm" type="text" id="name" placeholder="Your Name" inputRef={(input) => {this.name = input}}/>
                                    </FormGroup>
                                    <FormGroup controlId="share-email-group">
                                        <ControlLabel>Friend&#700;s name</ControlLabel>
                                        <FormControl bsSize="sm" type="text" id="friendName" placeholder="Friend's Name" inputRef={(input) => {this.friendName = input}}/>
                                    </FormGroup>
                                    <FormGroup controlId="share-email-group">
                                        <ControlLabel>Friend&#700;s Email</ControlLabel>
                                        <FormControl bsSize="sm" type="text" id="email" placeholder="Their Email" inputRef={(input) => {this.email = input}}/>
                                    </FormGroup>
                                    <Button onClick={this.share}>Send</Button>
                                    <img id="ajax-status" ref={(img) => {this.img = img;}}/>
                                </Form>
                            </Tab>
                            <Tab eventKey={2} title="Link" onEntering={this.addTextToShareTab}>
                                <FormControl bsSize="sm" type="text" inputRef={(input) => {this.link = input}}/>
                                <p>Copy the link above and send it to whoever you want, however you want</p>
                            </Tab>
                        </Tabs>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.shareClose}>Close</Button>
                    </Modal.Footer>
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
        if (!this.gid) {
            var pageURL = decodeURIComponent(window.location.search.substring(1)),
            gidRegx = /(?:(?:gid=)([a-zA-Z0-9~\-_]*))/,
            gid = gidRegx.exec(pageURL);
            if (gid) {
                gid = gid[1];

                var jsonData = $.ajax({
                    url: "/api/isValidGid?gid=" + gid,
                    dataType: "json",
                    async: false
                }).responseJSON;

                if (jsonData.valid) {
                    this.gid = gid;
                } else {
                    window.alert("Invalid Game Id");
                    this.gohome();
                    return;
                }
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
        var contents;

        if (this.state.page == "gameResults") {
            contents = <GameData gid={this.gid} onPlayAgain={this.onPlayAgain} onPlayNewGame={this.gohome}/>
        } else if (this.state.page == "postGame") {
            contents = (
                <div>
                    <PostGame path={this.path} time={this.time} gid={this.gid}/>
                    <GameData gid={this.gid} onPlayAgain={this.onPlayAgain} onPlayNewGame={this.gohome}/> 
                </div>);
        } else if (this.state.page == "inGame") {
            contents = <InGame gid={this.gid} onPostGame={this.onPostGame}/>;
        } else {
            contents = (<div>
                        <p>Welcome to WikiLinks, the 6 degrees of Wikipedia game. Try to get from a start page to an end page by navigating each article’s links and challenge your friends once you're done. Try "Apple" to "Adolf Hitler" or "Tufts" to "Banana" to start!</p>
                        <NewGame onCreateGame={this.startGame}/>
                        <GameHistory onReplay={this.startGame} onViewStats={this.viewStats}/> 
                    </div>);
        }

        return (
            <main>
                <div className="container-fluid">
                    <header>
                        <h1 onClick={this.gohome}>WikiLinks</h1>
                    </header>
                    <section id="main-content">
                        {contents}
                    </section>
                </div>
                <footer>
                    <p>Created by <a href="http://tobyglover.com" target="_blank">Toby Glover</a>, <a href="https://github.com/joelreske"  target="_blank">Joel Reske</a>, <a href="https://github.com/rgalbiati" target="_blank">Raina Galbiati</a>, and <a href="https://github.com/asmith1" target="_blank">Ashley Smith</a></p>
                </footer>
            </main>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById('app'));