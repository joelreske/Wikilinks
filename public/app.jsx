class NewGame extends React.Component {
    constructor(props) {
        super(props);
        this.randomizeStartPage = this.randomizeStartPage.bind(this);
        this.randomizeEndPage = this.randomizeEndPage.bind(this);
        this.parseStartPageEntry = this.parseStartPageEntry.bind(this);
        this.parseEndPageEntry = this.parseEndPageEntry.bind(this);
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

    startGame() {

    }
}

class InGame extends React.Component{
    constructor(props) {
        super(props);

        this.state = {"gameStarted" : false}
    }

    render() {
        return (
            <div>Hello</div>
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
