var React = require('react');
var TextInput = require('./TextInput');
var Ajax = require('../helpers/Ajax');

class ArticleSelect extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            history: [],
            searchString: ""
        };

        this.showLinks = this.showLinks.bind(this);
        this.search = this.search.bind(this);
    }

    componentWillMount() {
        this.nextPage(this.props.start);

        window.addEventListener("keydown", function(e) {
            if ((e.ctrlKey || e.metaKey) && e.keyCode === 70) {
                e.preventDefault();
                document.getElementById("search").focus();
            }
        })
    }

    nextPage(page) {
        this.state.history.push(page);

        if (page == this.props.end) {
            this.props.onWin(this.state.history);
        } else {
            Ajax.run("GET", "/api/getLinksForPage", {
                "page": page
            }, true, this.showLinks);
        }
    }

    showLinks(data, error) {
        this.refs.search.setVal("");

        this.setState({
            article: data,
            searchString: ""
        });
    }

    search(text) {
        this.setState({
            searchString: text
        });
    }

    render() {
        var data = this.state.article;
        var searchString = this.state.searchString;

        var links = [];

        for (var i in data) {
            (function(i, obj) {
                var articleName = data[i];
                var searchRegex;
                if (searchString.length < 2) {
                    searchRegex = new RegExp("^" + searchString + ".*", "i");
                } else {
                    searchRegex = new RegExp("" + searchString + "", "i");
                }

                if (searchRegex.test(articleName) || articleName == obj.props.end) {
                    if (articleName == obj.props.end) {
                        var btn = <button key={i} className="winlinkbtn" onClick={() => obj.nextPage(articleName)}>{articleName}</button>;
                    } else {
                        var btn = <button key={i} onClick={() => obj.nextPage(articleName)}>{articleName}</button>;
                    }

                    links.push(btn);
                }
            })(i, this);
        }
        // <PathDisplay path={this.state.history}/>
        return (
            <div>
                <h2>You are on <b>{this.state.history[this.state.history.length - 1]}</b></h2>
                <TextInput id="search" focus={true} placeholder="Search" onTextChange={this.search} ref="search"/>
                <div>{links}</div>
            </div>
        );
    }
}

module.exports = ArticleSelect;