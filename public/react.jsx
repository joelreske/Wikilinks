var Logo = React.createClass({
    render : function(){
        return <div>WikiLinks</div>;
    } 
});

ReactDOM.render(<Logo/>, document.getElementById('header'));




var Button = React.createClass({
  render: function () {
    return (
      <button
        className="startbutton"
        // style={startButtonStyle}
        onClick={this.props.handleClick}>Start Game</button>
    );
  }
});


ReactDOM.render(<Button/>, document.getElementById('startgame'));

// module.exports = Button;
