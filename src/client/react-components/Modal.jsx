var React = require('react');

class Modal extends React.Component {
    constructor(props) {
        super(props);
        if (this.props.id == null) {
            this.id = "";
        } else {
            this.id = this.props.id;
        }

        this.close = this.close.bind(this);
    }

    close() {
        this.props.onHide();
    }

    render() {
        if (!this.props.show) {
            return <div></div>;
        }

        return (<div id={this.id}>
                    <div className="modal-background" onClick={this.close}></div>
                    <div className="modal-foreground">
                        <div className="modal-content">
                            {this.props.children}
                        </div>
                        <div className="close">
                            <button onClick={this.close}>Close</button>
                        </div>
                    </div>
                </div>);

    }
}

module.exports = Modal;