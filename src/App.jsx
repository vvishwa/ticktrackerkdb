import './App.css';
import './Slider.css'
import React, { PureComponent as Component } from 'react';
//https://react-bootstrap.github.io/components/navbar/
import { Nav, Navbar, NavbarBrand } from 'reactstrap';
//https://reacttraining.com/react-router/core/guides/philosophy
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

import TickerPanel from './selector/TickPanel';
import OptionTab from './viewer/OptionTab';
import PositionTab from './viewer/PositionTab';
import TradeTab from './viewer/TradeTab';

import wsFuncs from './kdbchannel/Funcs';
import BalanceTab from './viewer/BalanceTab';
import { store } from './store/store';
import { connect } from '@giantmachines/redux-websocket';
import { rtstore } from './store/rtstore';
import { Provider } from 'react-redux';
import FuturesTab from "./viewer/FuturesTab";
import NewsTab from "./viewer/NewsTab";
import IRTab from "./viewer/IRTabs";
import TickerTab from './viewer/TickerTab';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      fillConfidencePerc: 0,
      canCorrect:false,
      isNight: false,
      currentTab: 'hidden',
    }

    this.binder = this.binder.bind(this);
    this.binder(wsFuncs); 
    this.tabChange = this.tabChange.bind(this);
  }

  componentDidMount() {
    store.dispatch(connect('ws://apj.local:5001/'));
    this.openWS();
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

  tabChange = () => {
    let currentTab=window.location.pathname;
    this.setState({currentTab: currentTab})
  }

  render() {
    let slider = (<label className="switch">
      <input type="checkbox" checked={this.state.isNight} onChange={this.updateCSS} />
      <span className="slider round"></span>
    </label>);
    let tabs = ["/", "/TickerTab", "/PostionTab", "/TradeTab", "/Futures", "/NewsTab", "/IRTab"];
    return (
      <div className={this.state.isNight ? 'nightMode' : 'dayMode'}>
        <Router>
          <div>
            <div>
              <Navbar>
                <Nav>
                  <NavbarBrand tag={Link} className={this.state.currentTab === 'hidden' ? "active" : ""} to={tabs[0]}>Historical Option</NavbarBrand>
                  <NavbarBrand tag={Link} className={this.state.currentTab === tabs[1] ? "active" : ""} to={tabs[1]}>Delayed Quotes</NavbarBrand>
                  <NavbarBrand tag={Link} className={this.state.currentTab === tabs[2] ? "active" : ""} to={tabs[2]}>Current Position</NavbarBrand>
                  <NavbarBrand tag={Link} className={this.state.currentTab === tabs[3] ? "active" : ""} to={tabs[3]}>Trades</NavbarBrand>
                  <NavbarBrand tag={Link} className={this.state.currentTab === tabs[4] ? "active" : ""} to={tabs[4]}>Futures</NavbarBrand>
                  <NavbarBrand tag={Link} className={this.state.currentTab === tabs[5] ? "active" : ""} to={tabs[5]}>News</NavbarBrand>
                  <NavbarBrand tag={Link} className={this.state.currentTab === tabs[6] ? "active" : ""} to={tabs[6]}>Interest Rate</NavbarBrand>
                  <NavbarBrand className="daynightslide">{slider}</NavbarBrand>
                </Nav>
              </Navbar>
            </div>
            <Routes>
              <Route path={tabs[0]} element={
              <div className="ag-theme-alpine" style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}><TickerPanel
                  tabChange={this.tabChange}
                  canCorrect={this.state.canCorrect}
                  fillIn={this.fillInHandler} /><h4>EOD Feed Date {this.state.datedDate}: Ticker Selected {this.state.ticker}.{this.state.exchange} </h4>
                  <OptionTab
                    tabChange={this.tabChange}
                    fillValue={this.state.fillConfidencePerc}
                    enableCorrection={this.enableCorrectionHandler} /></div>
              }
              />
              <Route path={tabs[1]} element={
              <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                <Provider store={rtstore}>
                  <TickerTab/>
                </Provider>
              </div>
              } />
              <Route path={tabs[2]} element={
              <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                <PositionTab />
                <BalanceTab />
              </div>
              } />
              <Route path={tabs[3]} element={
              <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                <TradeTab />
              </div>
              } />
              <Route path={tabs[4]} element={
                  <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                    <FuturesTab />
                  </div>
              } />
              <Route path={tabs[5]} element={
                  <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                    <NewsTab />
                  </div>
              } />
              <Route path={tabs[6]} element={
                  <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                    <IRTab />
                  </div>
              } />
            </Routes>
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
    let ws = new WebSocket("ws://apj.local:5001/");
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

    if (fArgs['func'] !== null && fArgs['func'] === 'getQuotes') {
      if (fArgs['result'] !== null) {

        const getQuotes_rslt = fArgs['result'].map((r)=> {
          return r;
        });

        console.log('result ', getQuotes_rslt);
        this.setState({getQuotes_rslt:getQuotes_rslt});
      }
    }
  };
}

export default App;
