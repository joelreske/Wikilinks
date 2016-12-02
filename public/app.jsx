class NewGame extends React.Component{
    constructor(){
        super();
    }

    render(){
        return (
            <form action="" className ="form">
            Enter Stating Article: <input type="text" ref="firstWord"/>
            Enter Ending Article: <input type="text" ref="secondWord"/>
            <button type="submit"></button>
            </form>
        );
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
            <ArticleSelect addAtricle={this.addAtricle} start="United States" end="United States"/>
            </div>
          );
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
