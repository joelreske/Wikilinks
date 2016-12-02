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
                            callback();
                        }
                    });
                }
            });
        }
    }

    startGame() {
        this.checkPages(function() {
            console.log("ready");
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
        clearInterval(this.timer);
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
    }

    componentWillMount(){
        this.nextPage(this.props.start);
    }

    nextPage(page){
      console.log("Going to: " + page);
      this.props.addArticle(page);
      if (page == this.props.end){
        this.props.onWin();
      }else{
        this.getLinksForPage(page, this.showLinks);
      }
    }

    getLinksForPage(page, callback){
      if (page){
          $.getJSON( "/api/getLinksForPage?page="+page, callback);
      }else{
          console.log("Shoot.");
      }
    }

    showLinks(data){
        this.setState({linksShown: data});
    }

    render() {
        var data = this.state.linksShown;
        var output = [];
        for (var i in data){
          (function (i, obj) {
            var articleName = data[i];
            //console.log(articleName);
            output.push(<a key={i} className="col-sm-2 articleName" onClick={() => obj.nextPage(articleName)}>{articleName}</a>);
          })(i, this);
        }
        return <div className="">{output}</div>;
    }
}

class InGame extends React.Component {
    constructor(props) {
        super(props);

        console.log(props.gameId);
        this.startTime = new Date();
        this.timeElapsed;
        this.state = {gameWon : false, time: 0, path: []}

        this.returnTimeElapsed = this.returnTimeElapsed.bind(this);
        this.addArticle = this.addArticle.bind(this);
        this.onWin = this.onWin.bind(this);
    }

    returnTimeElapsed(time) {
      this.setState({"time": time});
    }

    addArticle(name) {
      var newPath = this.state.path;
      newPath.push(name);
      this.setState({path: newPath});
    }

    onWin() {
      this.setState({gameWon:true});
    }

    render() {
        if (!this.state.gameWon){
          return (
            <div>
              <Timer start={Date.now()} timeCallback={this.returnTimeElapsed}/>
              <ArticleSelect addArticle={this.addArticle} onWin={this.onWin} start="United States" end="Flag of the United States"/>
            </div>
          );
        }else{
          return (
            <div>
              <h1>YOU WON</h1>
              <h2>And you did it in {this.state.time} seconds</h2>
              <p>{JSON.stringify(this.state.path)}</p>
            </div>
          );
        }
    }
}

class App extends React.Component {
    constructor() {
        super();
    }

    render(){
        if (true){
            return (
                <InGame gameId="1234"/>
            );
        }else{
            return (
                <NewGame/>
            );
        }
    }
}

ReactDOM.render(<App/>, document.getElementById('app'));
