var React = require('react');
var TextInput = require('./TextInput');
var Ajax = require('../helpers/Ajax');

class NewGamePageForm extends React.Component {
    constructor(props) {
        super(props);
        this.randomize = this.randomize.bind(this);
        this.parsePageEntry = this.parsePageEntry.bind(this);
    }

    render() {
        return (
            <div className="newGameOption">
                <TextInput onTextChange={this.parsePageEntry} placeholder={this.props.placeholder} ref="input"/>
                <div>
                    <label>{this.props.label}</label>
                    <a onClick={this.randomize}>Randomize</a>
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.randomize();
    }

    randomize() {
        var input = this.refs.input;

        Ajax.run("GET", "/api/getRandomPage", null, true, function(data, err) {
            console.log(data);
            input.setVal(data.pageTitle);
        });
    }

    parsePageEntry() {
        var urlRegx = /(?:http:\/\/|https:\/\/)en.wikipedia.org\/wiki\/([^#<>[\]|{}]*)/i;
        var match = urlRegx.exec(this.refs.input.val());

        if (match) {
            var pagetitle = match[1].replace(/_/g, " ");
            this.refs.input.setVal(pagetitle);
        }
    }

    val() {
        return this.refs.input.val();
    }
}

module.exports = NewGamePageForm;