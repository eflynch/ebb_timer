var React = require('react');
var ReactDOM = require('react-dom');
var FontAwesome = require('react-fontawesome');

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
            preventDelete: true,
            fading: false,
            html: "",
            state: 'init',
            wordCount: null
        };
    },
    handleChange: function (e){
        this.setState({html: e.target.value});
        if (this.state.wordCount !== null){
            var numWords = e.target.value.split(' ').length;
            if (numWords >= this.state.wordCount){
                this.done();
                return;
            }
        }
        this.stoke();
    },
    handleKeyDown: function (e){
        if (this.state.preventDelete && e.key === 'Backspace'){
            e.preventDefault();
        }
    },
    stoke: function (){
        this.clearTimeouts();
        this.setState({fading: false});
        this.setTimeout(function (){this.setState({fading: true});}.bind(this), 500);
        this.setTimeout(function (){this.clear();}.bind(this), 7000);
    },
    start: function (time){
        this.setState({state: 'writing', wordCount: null});
        var duration = time * 60 * 1000;
        this.mainTimer = setTimeout(function (){
            this.done();
        }.bind(this), duration);
        this.stoke();
    },
    startWord: function (wordCount){
        this.setState({state: 'writing', wordCount: wordCount});
        this.stoke();
    },
    done: function (){
        this.clearTimeouts();
        this.setState({state: 'init'});
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
                    <div className={this.state.fading ? "ebb_show" : "ebb_giveup"}><FontAwesome name='frown-o'/></div>
                    <div className={this.state.fading ? "ebb_fade" : ""}>
                        <ContentEditable ref={function(input){
                            if (input === null){return;}
                            ReactDOM.findDOMNode(input).focus();
                        }} onKeyDown={this.handleKeyDown} className="ebb" onChange={this.handleChange} html={this.state.html}/>
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
                    <h1 className="ebb_unselectable">Select Word Count </h1>
                    <div className="ebb_num" onClick={function(){this.startWord(100);}.bind(this)}><span>100</span></div>
                    <div className="ebb_num" onClick={function(){this.startWord(200);}.bind(this)}><span>200</span></div>
                    <div className="ebb_num" onClick={function(){this.startWord(400);}.bind(this)}><span>400</span></div>
                    <div className="ebb_num" onClick={function(){this.startWord(800);}.bind(this)}><span>800</span></div>
                    <div className="ebb_num" onClick={function(){this.startWord(1600);}.bind(this)}><span>1600</span></div>
                    <div className="ebb_num" onClick={function(){this.startWord(3200);}.bind(this)}><span>3200</span></div>
                    <div className="ebb_num" onClick={function(){this.startWord(6400);}.bind(this)}><span>6400</span></div>
                </div>
            );
        } else if (this.state.state === 'init'){
            return (
                <div>
                    <div className="ebb_done">
                        <FontAwesome onClick={this.copy} name='clipboard'/>
                        <FontAwesome onClick={this.reset} name='pencil'/>
                        <FontAwesome onClick={function (){
                            this.setState({preventDelete: !this.state.preventDelete});
                        }.bind(this)} name='eraser' className={this.state.preventDelete ? 'disabled' : ''}/>
                    </div> 
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
