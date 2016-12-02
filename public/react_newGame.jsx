var GetWords = React.createClass({
  handleClick: function () {
    // if (this.value = random) {
    //   //get random words
    // }
    // var data = {firstWord:this.firstWord, secondWord:this.secondWord};
    //     $.ajax({
    //       type: "POST",
    //       data :JSON.stringify(data),
    //       url: "google.com",
    //       contentType: "application/json"
    //     });
    window.location = "http://www.google.com/";
  },
  render: function () {
    return (
        <div className ="form"> 
        <form action="">
        Enter Stating Article:   <input type="text" name="firstWord" value="" />
            <br />
            <br />
        Enter Ending Article:   <input type="text" name="secondWord" value="" />
            <br />
            <br />
        Or 
        <br />
        <br />
        Randomize:    <input type="checkbox" name="randomize" value="random" />
        <br />
        <br />
            <button
                onClick={() => this.handleClick()}>Start Game</button>
        </form>
        </div>
      );
  }

});
