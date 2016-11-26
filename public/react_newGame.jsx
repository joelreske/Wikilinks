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
