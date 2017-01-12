var React = require('react');
var Link = require('react-router').Link;

class Wrapper extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<div id="mainContainer">
                    <header>
                        <Link to="/"><h1>WikiLinks</h1></Link>
                    </header>
                    <main>
                        <section id="main-content">
                            {this.props.children}
                        </section>
                    </main>
                    <footer>
                        <p>Copyright &copy; {new Date().getFullYear()} All Right Reserved </p>
                        <p><a href="http://tobyglover.com" target="_blank">Toby Glover</a> and <a href="https://github.com/joelreske" target="_blank">Joel Reske</a> (<a href="https://github.com/joelreske/Wikilinks" target="_blank">Source</a> and <a href="http://comp20.wikilinks.io" target="_blank">Original Version</a>, with help from <a href="https://github.com/rgalbiati" target="_blank">Raina Galbiati</a> and <a href="https://github.com/asmith1" target="_blank">Ashley Smith</a>)</p>
                    </footer>
                </div>);
    }
}

module.exports = Wrapper;