var StartGame = React.createClass({
  handleClick: function () {
      alert('click');
  }
  render: function () {
    return (
      <div className="new-game">
      <div id="startText">Go on a Wiki Adventure</div>
      <div id="startButton"><button
        onClick={() => handleClick()}>Start Game</button></div>

        </div>
    );
  }
});


ReactDOM.render(<StartGame/>, document.getElementById('startgame'));
