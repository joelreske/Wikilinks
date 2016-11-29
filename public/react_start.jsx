var StartGame = React.createClass({
  handleClick: function () {
      window.location = "http://www.google.com/";
  },
  render: function () {
    return (
      <div className="new-game">
      <div id="startText">Go on a Wiki Adventure</div>
      <div id="startButton"><button
        onClick={() => this.handleClick()}>Start Game</button></div>

        </div>
    );
  }
});