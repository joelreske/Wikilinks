var Logo = React.createClass({
    render : function(){
        return <div>WikiLinks</div>;
    } 
});

ReactDOM.render(<Logo/>, document.getElementById('header'));


var Stext = React.createClass ({
  render : function(){
      return <div>Go on a Wiki Adventure</div>
  }
});

var Button = React.createClass({
  render: function () {
    return (
      <button
        // className="startbutton"
        // style={startButtonStyle}
        onClick={this.props.handleClick}>Start Game</button>
    );
  }
});

ReactDOM.render(<Stext/>, document.getElementById('startText'));
ReactDOM.render(<Button/>, document.getElementById('startButton'));

// module.exports = Button;
