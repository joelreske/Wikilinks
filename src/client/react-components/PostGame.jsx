var React = require('react');
var PathDisplay = require('./PathDisplay');
var TextInput = require('./TextInput');
var Modal = require('./Modal');
var Ajax = require('../helpers/Ajax');
var StoredGameData = require('../helpers/StoredGameData');

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

    componentWillMount() {
        var data = StoredGameData.getGameData();
        this.path = data.path;
        this.gid = data.gid;
        this.time = data.time;
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
        var name = this.refs.name.val();
        if (name != "" && !this.sent) {
            var ajaxStatus = this.refs.img;
            ajaxStatus.style.padding = 0;
            ajaxStatus.style.height = "30px";
            ajaxStatus.style.width = "30px";
            ajaxStatus.src = "/images/spinner.gif";
            var self = this;
            Ajax.run("POST", "/api/endGame", {
                'gid': this.gid,
                'username': name,
                'path': this.path,
                'time': this.time
            }, false, function(data, status) {
                ajaxStatus.src = "/images/checkmark.png";
                self.sent = true;
                StoredGameData.clear();
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
                <h2>And you did it in <b>{this.time}</b> seconds.</h2>
                <PathDisplay path={this.path}/>
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

module.exports = PostGame;