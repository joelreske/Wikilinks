var Logo = React.createClass({
    render : function(){
        console.log("hello from inside react");
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

console.log("hello2 from inside react");

ReactDOM.render(<Logo/>, document.getElementById('header'));

ReactDOM.render(new Button(), document.getElementById('startgame'));

module.exports = Button;
