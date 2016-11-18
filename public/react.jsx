<script type="text/jsx">
var React = require('react');
var ReactDOM = require('react-dom');

var logo = React.createClass({
    render : function(){
        return <div>WikiLinks</div>;
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

 $(document).ready(function() {
    ReactDOM.render(<logo/>,document.getElementById('logo'));
  });

React.render(new Button(), document.getElementById('startgame'));

module.exports = Button;

</script>
