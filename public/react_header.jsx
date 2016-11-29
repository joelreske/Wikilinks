var Logo = React.createClass({
    render : function(){
        return <div>WikiLinks</div>;
    } 
});

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

ReactDOM.render(<Logo/>, document.getElementById('header'));

ReactDOM.render(<StartGame/>, document.getElementById('startgame'));



// //timer counts to 10
// var CountupTimer = React.createClass({
//   getInitialState: function() {
//     return {
//       total: 0
//     };
//   },
//   tick: function() {
//     this.setState({total_time: this.state.total_time - 1});
//     if (this.state.total_time <= -10) {
//       clearInterval(this.interval);
//     }
//   },
//   componentDidMount: function() {
//     this.setState({ total_time: this.props.total_time });
//     this.interval = setInterval(this.tick, 1000);
//   },
//   componentWillUnmount: function() {
//     clearInterval(this.interval);
//   },
//   render: function() {
//     return (
//       <div>Total Time Elapsed: {this.state.total_time * -1}</div>
//     );
//   }
// });

// var Stops = React.createClass({
//     getInitialState: function() {
//         return {
//             total: 0
//         };
//     },
//     increment: function() {
//         this.setState({total_stops: this.state.total_stops + 1});
//     },
//     componentDidMount: function() {
//         this.setState({ total_time: this.props.total_time });
//     },
//     render: function() {
//         return (
//             <div>Stops: {this.state.total_stops}</div>
//         );
//     }
// });

// var TopBar= React.createClass({
//     render: function () {
//         return (
//             <div>
//                 <p><u>Go Back</u></p>
//                 <CountupTimer total_time="0" /> 
//                 <Stops total_stops="0"/>
//             </div>
//             );
//     }
// });

// ReactDOM.render(<TopBar />, document.getElementById('top-bar'));






