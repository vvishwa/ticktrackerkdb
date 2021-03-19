import './App.css';
import './Slider.css'
import React, { PureComponent as Component } from 'react';
//https://react-bootstrap.github.io/components/navbar/
import { Nav, Navbar, NavbarBrand } from 'reactstrap';
//https://reacttraining.com/react-router/core/guides/philosophy
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

import TickerPanel from './selector/TickPanel';
import OptionTab from './viewer/OptionTab';
import TickerTab from './viewer/TickerTab';

import wsFuncs from './kdbchannel/Funcs';

//import { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      optionIndex: 2,
      tickerList: [],
      datedDates: [],
      expirationDates: [],
      ticker: '',
      exchange: '',
      datedDate: '',
      optionTable: [],
      subscription: [],
      fillConfidencePerc: 0,
      canCorrect:false,
      isNight: false,
      currentTab: 'hidden'
    }

    this.binder = this.binder.bind(this);
    this.binder(wsFuncs);

  }

  componentDidMount() {
    this.openWS();
  }

  toggleTicker = (event) => {
    console.log('Setting ticker to ', event.target.value)
    const tmp = event.target.value.split(".")
    this.setState({
      ticker: tmp[0],
      exchange: tmp[1]
    })
    this.getExpirations(tmp[0], tmp[1]);
  }

  subscribe = (tickers) => {
    console.log('subscribing  to ', tickers)
    this.getSubscriptions(tickers);
  }

  toggleDatedDates = (event) => {
    console.log('Setting dated date to ', event.target.value)
    this.setState({
      datedDate: event.target.value
    })
  }

  toggleExpirationDates = (event) => {
    const dateIndex = event.target.value
    console.log('Setting expiration date index to ', dateIndex)
    this.setState({
      optionIndex: event.target.value
    })
    this.getOption(this.state.datedDate, this.state.ticker, this.state.exchange, dateIndex);
  }

  fillInHandler = (val) => {
    if (val !== this.state.fillConfidencePerc) {
      console.log('About to fillIn with value ', val)
      this.setState({
        fillConfidencePerc: val
      })
    }
  }

  enableCorrectionHandler = (flag) => {
    if (!flag) {
      this.setState({fillConfidencePerc:0.0})
    }
    if (this.state.canCorrect !== flag) {
      this.setState({canCorrect:flag});
      console.log('Changed state to enable correction ', flag)
    }
  }

  render() {
    let slider = (<label className="switch">
      <input type="checkbox" checked={this.state.isNight} onChange={this.updateCSS} />
      <span className="slider round"></span>
    </label>);
    let tabs = ["/", "/OptionTab", "/TickerTab"];
    return (
      <div className={this.state.isNight ? 'nightMode' : 'dayMode'}>
        <Router>
          <div>
            <div>
              <Navbar>
                <Nav>
                  <NavbarBrand tag={Link} className={this.state.currentTab === tabs[0] ? "active" : ""} to={tabs[0]}>OptionTab</NavbarBrand>
                  <NavbarBrand tag={Link} className={this.state.currentTab === tabs[1] ? "active" : ""} to={tabs[1]}>TickerTab</NavbarBrand>
                </Nav>
                {slider}
              </Navbar>
            </div>
            <Switch>
              <Route exact path={tabs[0]} render={(props) => 
              <div className="ag-theme-alpine" style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}><TickerPanel
                  tabChange={this.tabChange}
                  datedDates={this.state.datedDates}
                  tickerList={this.state.tickerList}
                  expirationDates={this.state.expirationDates}
                  changeD={this.toggleDatedDates}
                  changeX={this.toggleExpirationDates}
                  clicked={this.toggleTicker}
                  canCorrect={this.state.canCorrect}
                  fillIn={this.fillInHandler} /><h4>EOD Feed Date {this.state.datedDate}: Ticker Selected {this.state.ticker}.{this.state.exchange} </h4>
                  <OptionTab
                    tabChange={this.tabChange}
                    optionTable={this.state.optionTable}
                    fillValue={this.state.fillConfidencePerc}
                    enableCorrection={this.enableCorrectionHandler} /></div>
              }
              />
              <Route path={tabs[1]} render={(props) => 
              <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', width: '20%'}}>
                <TickerTab
                  subsHandler={this.subscribe}
                />
              </div>
              } />
            </Switch>
          </div>
        </Router>
      </div>
    );
  }

  componentWillUnmount() {
    if (this.ws !== undefined && this.ws !== null)
      this.ws.close();
  }

  openWS = function () {
    let ws = new WebSocket("ws://apj:5001/");
    ws.postQ = {};
    ws.onmessage = this.onmessage.bind(this);
    ws.onopen = this.onopen.bind(this);
    ws.onclose = this.onclose.bind(this);
    // eslint-disable-next-line
    this.state.ws = ws;
  }

  binder = function (dict) {
    let funcs = Object.keys(dict)
    for (let i = 0; i < funcs.length; i++) {
      this[funcs[i]] = dict[funcs[i]].bind(this);
    }
  }

  //After the websocket is opened populate the home page
  onopen = function (e) {
    this.setState({ activeConnection: true })
    this.init()
  };

  //If the connection is lost, display a loading icon and try to reopen the websocket
  onclose = function (e) {
    this.setState({ activeConnection: false });
    this.openWS();
  };

  onmessage = function (e) {
    let tmp = JSON.parse(e.data);
    let id = tmp[0];
    let fName = tmp[1];
    let fArgs = tmp[2];
    console.log("postQ", id, fName, fArgs);
    //If promises have been made, run the resolve or reject functions
    let f = "resolve";
    if (fArgs !== null) {
      if (fArgs[0] === "'") {
        f = "reject";
      }
    };
    this.state.ws.postQ[id][f](fArgs);
    //console.log('here '+this.state.ws.postQ[id][f]);
  };
}

export default App;
