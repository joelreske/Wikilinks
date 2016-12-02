class NewGame extends React.Component {
    constructor(props) {
        super(props);
        this.randomizeStartPage = this.randomizeStartPage.bind(this);
        this.randomizeEndPage = this.randomizeEndPage.bind(this);
        this.parseStartPageEntry = this.parseStartPageEntry.bind(this);
        this.parseEndPageEntry = this.parseEndPageEntry.bind(this);
        this.checkPages = this.checkPages.bind(this);
        this.startGame = this.startGame.bind(this);
    }

    render() {
        return (
            <div className="container">
                <div className="form-group">
                    <label htmlFor="startPage">Start Page:</label>
                    <input className="input-sm" id="startPage" placeholder="Enter Start Page" onChange={this.parseStartPageEntry}/>
                    <button className="btn btn-default" onClick={this.randomizeStartPage}>Randomize</button>
                </div>
                <div className="form-group">
                    <label htmlFor="endPage">End Page:</label>
                    <input className="input-sm" id="endPage" placeholder="Enter End Page" onChange={this.parseEndPageEntry}/>
                    <button className="btn btn-default" onClick={this.randomizeEndPage}>Randomize</button>
                </div>
                <button className="btn btn-default" onClick={this.startGame}>Start Game</button>
            </div>
        );

    }

    randomize(inputId) {
        $.getJSON("/api/getRandomPage", function(data) {
            $("#" + inputId).val(data.pageTitle);
        });
    }

    randomizeStartPage(event) {
        this.randomize("startPage");
    }

    randomizeEndPage() {
        this.randomize("endPage");
    }

    parsePageEntry(inputId) {
        var urlRegx = /(?:http:\/\/|https:\/\/)en.wikipedia.org\/wiki\/([^#<>[\]|{}]*)/i
        var inputField = $("#" + inputId);
        var match = urlRegx.exec(inputField.val());

        if (match) {
            var pagetitle = match[1].replace(/_/g, " ");
            inputField.val(pagetitle);
        }
    }

    parseEndPageEntry() {
        this.parsePageEntry("endPage");
    }

    parseStartPageEntry() {
        this.parsePageEntry("startPage");
    }

    checkPages(callback) {
        var startPage = $("#startPage").val();
        var endPage = $("#endPage").val();

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
        this.checkPages(function(start, end) {
            $.getJSON("/api/startGame?start=" + start + "&end=" + end, function(data) {
                window.history.pushState(data, 'WikiLinks', '/?gid=' + data.gameId);
                ReactDOM.render(<InGame gameId={data.gameId}/>, document.getElementById('app'));
            });
        });
    }
}

class Time extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>{this.props.time}</div>
          );
    }
}

class Timer extends React.Component {
    constructor(props){
        super(props);

        this.tick = this.tick.bind(this);
        this.state = {elapsed: 0 };
    }

    componentDidMount(){
        this.timer = setInterval(this.tick, 100);
    }

    componentWillUnmount(){
        this.props.timeCallback(new Date() - this.props.start);
    }

    tick(){
        this.setState({elapsed: new Date() - this.props.start});
    }

    render() {
        var elapsed = Math.round(this.state.elapsed / 100);
        var seconds = (elapsed / 10).toFixed(1);

        return <p>Time Since Start: <b>{seconds} seconds</b></p>;
    }
}

class ArticleSelect extends React.Component {
    constructor(props){
        super(props);

        this.state = { article: this.props.start, linksShown: [] };

        this.getLinksForPage = this.getLinksForPage.bind(this);
        this.showLinks = this.showLinks.bind(this);

        this.getLinksForPage(this.props.start, this.showLinks);
    }

    getLinksForPage(page, callback, error){
      if (page){
          $.getJSON( "/api/getLinksForPage?page="+page, callback);
      }else{
          console.log("Fuck");
      }
    }

    showLinks(data){
      console.log(data);
      this.setState({linksShown: data});
    }

    render() {
        var data = this.state.linksShown;
        var output = [];
        for (var i in data){
          //console.log(data[i]);
          output.push(<a key={i}>{data[i]}</a>);
        }
        return <p>{output}</p>;
    }
}

class InGame extends React.Component {
    constructor(props) {
        super(props);

        console.log(props.gameId);
        this.startTime = new Date();
        this.timeElapsed;
        this.state = {gameStarted : false, time: 0, path: []}

        this.returnTimeElapsed = this.returnTimeElapsed.bind(this);
        this.addArticle = this.addArticle.bind(this);
    }

    returnTimeElapsed(time) {
      this.setState({"time": time});
    }

    addArticle(name) {
      var newPath = this.state.path;
      newPath.push(name);
      this.setState({path: newPath});
    }

    render() {
        return (
            //<Time time={this.state.time}/>
            <div>
            <Timer start={Date.now()} timeCallback={this.returnTimeElapsed}/>
            <ArticleSelect addAtricle={this.addArticle} start="United States" end="United States"/>
            </div>
          );
    }
}

class App extends React.Component {
    constructor() {
        super();
    }

    render(){
        var pageURL = decodeURIComponent(window.location.search.substring(1)),
            urlVariables = pageURL.split('&'),
            gidRegx = /(?:(?:gid=)([a-zA-Z0-9~\-_]*))/,
            gameId = null;

        for (var i = 0; i < urlVariables.length; i++) {
            gameId = gidRegx.exec(urlVariables[i]);
            if (gameId != null) {
                gameId = gameId[1];
                break;
            }
        }

        if (gameId){
            return (
                <InGame gameId={gameId}/>
            );
        } else {
            return (
                <NewGame/>
            );
        }
    }
}

ReactDOM.render(<App/>, document.getElementById('app'));
