class NewGame extends React.Component {
    constructor(props) {
        super(props);
        this.randomizeStartPage = this.randomizeStartPage.bind(this);
        this.randomizeEndPage = this.randomizeEndPage.bind(this);
        this.parseStartPageEntry = this.parseStartPageEntry.bind(this);
        this.parseEndPageEntry = this.parseEndPageEntry.bind(this);
    }

    render(){
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

    startGame() {

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
        this.timer = setInterval(this.tick, 50);
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

class InGame extends React.Component {
    constructor(props) {
        super(props);

        console.log(props.gameId);
        this.startTime = new Date();
        this.timeElapsed;
        this.state = {gameStarted : false, time: 0}

        this.returnTimeElapsed = this.returnTimeElapsed.bind(this);
    }

    returnTimeElapsed(time) {
      this.setState({"time": time});
    }

    render() {
        return (
            //<Time time={this.state.time}/>
            <Timer start={Date.now()} timeCallback={this.returnTimeElapsed}/>
          );
    }
}

class App extends React.Component {
    constructor() {
        super();
    }

    render(){
        if (false){
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
