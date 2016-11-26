var Logo = React.createClass({
    render : function(){
        return <div>WikiLinks</div>;
    } 
});

ReactDOM.render(<Logo/>, document.getElementById('header'));

function handleClick() {
  alert('click');
}

var StartGame = React.createClass({
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


var GetWords = React.createClass({
  render: function () {
    return (
        <div className ="form"> 
        <form action="">
        Enter Stating Article:   <input type="text" name="firstWord" value="" />
            <br />
            <br />
        Enter Ending Article:   <input type="text" name="firstWord" value="" />
            <br />
            <br />
        Or 
        <br />
        <br />
        Randomize:    <input type="checkbox" name="randomize" value="random" />
        <br />
        <br />
            <button
                onClick={() => handleClick()}>Start Game</button>
        </form>
        </div>
      );
  }

});

ReactDOM.render(<GetWords/>, document.getElementById('getwords'));



// ReactDOM.render(<StartGame/>, document.getElementById('startgame'));

//old line belongs in button div but I needed intermediary work first
// onClick={this.props.handleClick}>Start Game</button></div>
