var React = require('react');
var ReactDOM = require('react-dom');

var ContentEditable = require('react-contenteditable').default;

var SetTimeoutMixin = {
    componentWillMount: function() {
        this.timeouts = [];
    },
    setTimeout: function() {
        this.timeouts.push(setTimeout.apply(null, arguments));
    },

    clearTimeouts: function() {
        this.timeouts.forEach(clearTimeout);
    },

    componentWillUnmount: function() {
        this.clearTimeouts();
    }
};

function copyToClipboard(text) {
    window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
}

var Main = React.createClass({
    mixins: [SetTimeoutMixin],
    getInitialState() {
        return {
            fading: false,
            html: "",
            state: 'init',
        };
    },
    handleChange: function (e){
        this.setState({html: e.target.value});
        this.stoke();
    },
    stoke: function (){
        this.clearTimeouts();
        this.setState({fading: false});
        this.setTimeout(function (){this.setState({fading: true});}.bind(this), 500);
        this.setTimeout(function (){this.clear();}.bind(this), 7000);
    },
    start: function (time){
        this.setState({state: 'writing'});
        var duration = time * 60 * 1000;
        this.mainTimer = setTimeout(function (){
            this.setState({state: 'init'});
            this.clearTimeouts();
        }.bind(this), duration);
        this.stoke();
    },
    clear: function (){
        this.setState({
            html: ""
        });
    },
    copy: function (){
        copyToClipboard(this.state.html)
    },
    reset: function (){
        this.setState({
            html: "",
            state: "prepare"
        });
    },
    render: function (){
        if (this.state.state === 'writing'){
            return (
                <div>
                    <div className={this.state.fading ? "ebb_show" : "ebb_giveup"}>☹</div>
                    <div className={this.state.fading ? "ebb_fade" : ""}>
                        <ContentEditable className="ebb" onChange={this.handleChange} html={this.state.html}/>
                    </div>
                </div>
            );
        } else if (this.state.state === 'prepare') {
            return (
                <div>
                    <h1 className="ebb_unselectable">Select Duration </h1>
                    <div className="ebb_num" onClick={function(){this.start(1);}.bind(this)}><span>1</span></div>
                    <div className="ebb_num" onClick={function(){this.start(5);}.bind(this)}><span>5</span></div>
                    <div className="ebb_num" onClick={function(){this.start(10);}.bind(this)}><span>10</span></div>
                    <div className="ebb_num" onClick={function(){this.start(20);}.bind(this)}><span>20</span></div>
                    <div className="ebb_num" onClick={function(){this.start(40);}.bind(this)}><span>40</span></div>
                    <div className="ebb_num" onClick={function(){this.start(80);}.bind(this)}><span>80</span></div>
                    <div className="ebb_num" onClick={function(){this.start(160);}.bind(this)}><span>160</span></div>
                </div>
            );
        } else if (this.state.state === 'init'){
            return (
                <div>
                    <div className="ebb_done"><span onClick={this.copy}>☺</span>︎ <span onClick={this.reset}>✍</span></div> 
                    <ContentEditable disabled={true} className="ebb" onChange={this.handleChange} html={this.state.html}/>
                </div>
            );
        }
    }
});

document.addEventListener("DOMContentLoaded", function (){
    var content = document.getElementById("content");
    ReactDOM.render(<Main/>, content);
});
