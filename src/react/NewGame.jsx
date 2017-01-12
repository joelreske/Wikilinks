var React = require('react');
var NewGamePageForm = require('./NewGamePageForm');
var Ajax = require('./Ajax');

class NewGame extends React.Component {
    constructor(props) {
        super(props);
        this.checkPages = this.checkPages.bind(this);
        this.startGame = this.startGame.bind(this);
    }

    componentDidMount() {
        var self = this;

        this.refs.newGameContainer.addEventListener('keypress', function(e) {
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
            <section id="newGameContainer" ref="newGameContainer">
                <div>
                    <NewGamePageForm id="startPage" label="Start Page" placeholder="Enter Start Page" ref='startInput'/>
                    <NewGamePageForm id="endPage" label="End Page" placeholder="Enter End Page" ref='endInput'/>
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
            Ajax.run("GET", "/api/isWikipediaPage", {
                page: startPage
            }, true, function(data, error) {
                if (!data.valid) {
                    window.alert("Start is not a valid Wikipedia Page");
                } else {
                    Ajax.run("GET", "/api/isWikipediaPage", {
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
            Ajax.run("GET", "/api/startGame", {
                "start": start,
                "end": end
            }, true, function(data, error) {
                onCreateGame(data.gid);
            });
        });
    }
}

module.exports = NewGame;