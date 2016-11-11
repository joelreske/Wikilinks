react.js

var React = require('react');
var Button = require('react-native-button');

var Button = React.createClass({
  render: function () {
    return (
      <button
        className="startbutton"
        style={startButtonStyle}
        onClick={this.props.handleClick}>Start Game</button>
    );
  }
});

module.exports = Button;