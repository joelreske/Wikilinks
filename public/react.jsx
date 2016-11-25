var Logo = React.createClass({
    render : function(){
        return <div>WikiLinks</div>;
    } 
});

ReactDOM.render(<Logo/>, document.getElementById('header'));

var StartGame = React.createClass({
  render: function () {
    return (
      <div>
      <div id="startText">Go on a Wiki Adventure</div>
      <div id="startButton"><button
        onClick={this.props.handleClick}>Start Game</button></div>
        </div>
    );
  }
});

ReactDOM.render(<StartGame/>, document.getElementById('startgame'));

