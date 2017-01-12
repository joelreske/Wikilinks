var React = require('react');

class TextInput extends React.Component {
    constructor(props) {
        super(props);

        this.textDidChange = this.textDidChange.bind(this);
        this.onFocus = this.onFocus.bind(this);
    }

    textDidChange() {
        if (this.props.onTextChange) {
            this.props.onTextChange(this.refs.input.value);
        }
    }

    onFocus() {
        if (this.props.onFocus) {
            this.props.onFocus();
        }
    }

    select() {
        this.refs.input.select();
    }

    val() {
        return this.refs.input.value;
    }

    setVal(text) {
        this.refs.input.value = text;
    }

    componentDidMount() {
        if (this.props.focus) {
            this.refs.input.focus();
        }
        if (this.props.value) {
            this.setVal(this.props.value);
        }
    }

    render() {
        return <input id={this.props.id} type="text" autoComplete="off" onChange={this.textDidChange} ref='input' placeholder={this.props.placeholder} onFocus={this.onFocus}/>
    }
}

module.exports = TextInput;