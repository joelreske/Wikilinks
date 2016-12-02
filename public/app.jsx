class NewGame extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <form action="" className ="form">
            Enter Stating Article: <input type="text" ref="firstWord"/>
            Enter Ending Article: <input type="text" ref="secondWord"/>
            <button type="submit"></button>
        );
    }

}

class InGame extends React.Component{
    constructor(props) {
        super(props);

        this.state = {"gameStarted" : false}
    }

    render() {
        return (
            <div>Hello</div>
          );
    }
}

class App extends React.Component {
    constructor() {
        super();
    }

    render(){
        if (true){
            return (
                <InGame gameId="1234"/>
            );
        }else{
            return (
                <NewGame/>
            );
        }
    }
}

ReactDOM.render(<App/>, document.getElementById('app'));
