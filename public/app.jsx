class NewGamePageForm extends React.Component {
    constructor(props) {
        super(props);
        this.randomize = this.randomize.bind(this);
        this.parsePageEntry = this.parsePageEntry.bind(this);
    }

    render() {
        return (
            <div className="form-group">
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

    render() {
        return (
            <div className="container">
                <NewGamePageForm id="startPage" label="Start Page:" placeholder="Enter Start Page" ref={(input) => {this.startInput = input;}}/>
                <NewGamePageForm id="endPage" label="End Page:" placeholder="Enter End Page" ref={(input) => {this.endInput = input;}}/>
                <button className="btn btn-default" onClick={this.startGame}>Start Game</button>
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
        this.checkPages(function(start, end) {
            $.getJSON("/api/startGame?start=" + start + "&end=" + end, function(data) {
                console.log(data);
                window.history.pushState(data, 'WikiLinks', '/?gid=' + data.gid);
                ReactDOM.render(<InGame gid={data.gid}/>, document.getElementById('app'));
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

        this.startTime = new Date();
        this.timeElapsed;
        this.state = {gameWon : false, time: 0, path: []}

        this.returnTimeElapsed = this.returnTimeElapsed.bind(this);
        this.addArticle = this.addArticle.bind(this);
        this.onWin = this.onWin.bind(this);
        this.setEndpoints = this.setEndpoints.bind(this);

    }

    componentWillMount(){
      $.getJSON( "/api/getGameData?gid="+this.props.gid, this.setEndpoints);
    }

    setEndpoints(data){
      data = data[0];
      this.setState({start: data.start, end: data.end});
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
        if (this.state.start && this.state.end){
          if (!this.state.gameWon){
            return (
              <div>
                <Timer start={Date.now()} timeCallback={this.returnTimeElapsed}/>
                <ArticleSelect addArticle={this.addArticle} onWin={this.onWin} start={this.state.start} end={this.state.end}/>
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
        }else{
          return (
            <h1>Loading...</h1>
          );
        }
    }
}

class App extends React.Component {
    constructor() {
        super();
    }

    render(){
        var pageURL = decodeURIComponent(window.location.search.substring(1)),
            gidRegx = /(?:(?:gid=)([a-zA-Z0-9~\-_]*))/,
            gid = gidRegx.exec(pageURL);

        if (gid){
            return (
                <InGame gid={gid[1]}/>
            );
        } else {
            return (
                <NewGame/>
            );
        }
    }
}

ReactDOM.render(<App/>, document.getElementById('app'));
