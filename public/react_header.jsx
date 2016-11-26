var Logo = React.createClass({
    render : function(){
        return <div>WikiLinks</div>;
    } 
});


//timer counts to 10
var CountupTimer = React.createClass({
  getInitialState: function() {
    return {
      total: 0
    };
  },
  tick: function() {
    this.setState({total_time: this.state.total_time - 1});
    if (this.state.total_time <= -10) {
      clearInterval(this.interval);
    }
  },
  componentDidMount: function() {
    this.setState({ total_time: this.props.total_time });
    this.interval = setInterval(this.tick, 1000);
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },
  render: function() {
    return (
      <div>Total Time Elapsed: {this.state.total_time * -1}</div>
    );
  }
});

ReactDOM.render(<CountupTimer total_time="0" />, document.getElementById('timer'));


ReactDOM.render(<Logo/>, document.getElementById('header'));



