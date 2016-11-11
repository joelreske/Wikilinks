<script type="text/jsx">
var React = require('react');
var ReactDOM = require('react-dom');

var logo = React.createClass({
    render : function(){
        return (
            <h1>WikiLinks</h1>
        );
    } 

});

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

React.render(<logo/>,document.getElementById('logo'));



module.exports = Button;

</script>
