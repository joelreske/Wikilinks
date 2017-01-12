var React = require('react');
var Modal = require('./Modal');
var TextInput = require('./TextInput');
var Ajax = require('./Ajax');
var Pager = require('./Pager');

function htmlDecode(input) {
  var doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent;
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
        this.getChartData = this.getChartData.bind(this);
        this.playNewGame = this.playNewGame.bind(this);
        this.dataDidLoad = this.dataDidLoad.bind(this);
        this.selectLink = this.selectLink.bind(this);

        var self = this;
        Ajax.run("GET", "/api/getGameData", {
            "gid": this.props.gid
        }, true, function(data, error) {
            self.setState({
                start: data.start,
                end: data.end
            });
        });
    }

    componentDidMount() {
        var self = this;
        window.onresize = this.getChartData;

        self.getChartData();
        setInterval(self.getChartData, 2000);
    }

    getChartData() {
        Ajax.run("GET", "/api/getGameResults", {
            "gid": this.props.gid
        }, true, this.dataDidLoad)
    }

    dataDidLoad(data, error) {
        console.log(data);

        var options = {
            showLine: false,
            axisX: {
                type: Chartist.AutoScaleAxis,
                onlyInteger: true
            },
            axisY: {
                type: Chartist.AutoScaleAxis,
                onlyInteger: true
            },
            chartPadding: {
                top: 50,
                right: 50,
                bottom: 70,
                left: 0
            },
            width: "1080px",
            height: "512px",
            plugins: [
                Chartist.plugins.tooltip({
                    tooltipFnc : function(meta, dat){
                        var metaDecoded = htmlDecode(meta);
                        return metaDecoded;
                    }
                }),
                Chartist.plugins.ctAxisTitle({
                    axisX: {
                        axisTitle: 'Time (seconds)',
                        axisClass: 'ct-axis-title',
                        offset: {
                            x: -5,
                            y: 50
                        },
                        textAnchor: 'middle'
                    },
                    axisY: {
                        axisTitle: 'Articles Visited',
                        axisClass: 'ct-axis-title',
                        offset: {
                            x: 0,
                            y: -1
                        },
                        flipTitle: true
                    }
                })
              ]
        }

        // Create a new line chart object where as first parameter we pass in a selector
        // that is resolving to our chart container element. The Second parameter
        // is the actual data object.
        new Chartist.Line('.ct-chart', data, options);
    }

    playAgain() {
        Pager.goToPath(Pager.Paths.PLAY, this.props.gid);
    }

    playNewGame() {
        Pager.goToPath(Pager.Paths.HOME);
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

            Ajax.run("POST", "/api/share", {
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
        if (this.state.start && this.state.end) {
            path = <h2 style={{fontFamily: "'Lora', serif"}}><b>{this.state.start}</b> to <b>{this.state.end}</b></h2>;
        }
        return (
            <div id="GameData">
                <h1>Game Results</h1>
                {path}
                <div className="ct-chart"></div>
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
                        <TextInput ref="link" value={window.location.href} onFocus={this.selectLink}/>
                    </div>
                </Modal>
            </div>
        );
    }
}

module.exports = GameData;