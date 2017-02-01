var React = require('react');

class CircularCountdownTimer extends React.Component {
    constructor(props) {
        super(props);
        this.initialOffset = 440;
        this.time = 3;
        this.i = 0;

        this.tick = this.tick.bind(this);
    }

    componentDidMount() {
        this.circle.style.strokeDashoffset = this.initialOffset;
        this.timer = setInterval(this.tick, 1000);
    }

    tick() {
        if (this.i == this.time) {
            this.header.innerHTML = "GO";
            clearInterval(this.timer);
            this.props.countdownDoneCallback();
        } else {
            this.header.innerHTML = this.time - this.i;
            this.circle.style.strokeDashoffset = this.initialOffset - (this.i + 1) * (this.initialOffset / this.time);
            this.i++;
        }
    }

    render() {
        return (
            <div id="CircularCountdownTimer">
                <h2 ref={(elm) => {this.header = elm;}}></h2>
                <svg width="160" height="160" xmlns="http://www.w3.org/2000/svg">
                    <circle id="circle_animation" r="69.85699" cy="81" cx="81" ref={(elm) => {this.circle = elm;}}/>
                </svg>
            </div>
        );
    }
}

module.exports = CircularCountdownTimer;