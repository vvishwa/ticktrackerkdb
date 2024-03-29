let wsFuncs = {};
//On tab-change the functions aren't redefined properly
wsFuncs.q = function (id, func, obj, resolve, reject) {
    console.log(id, func, obj);
    let ws = this.state.ws;
    ws.postQ[id] = { resolve, reject };
    this.setState({ ws });
    return ws.send(JSON.stringify({ id, func, obj }));
};

//Creates a promise, which will be resolved after data is returned from q, and trigger any corresponding .then functions if successful, or .catch if unsuccessful
wsFuncs.qPromise = function (func, q, obj) {
    console.log('Funcs.. qPromise '+this.state)
    let id = this.state.id;
    id += 1;
    this.setState({ id });
    return new Promise(function (resolve, reject) {
        q(id, func, obj, resolve, reject);
    })
};

wsFuncs.formatDate = function (i, d) {
    if (d === undefined) {
        d = new Date();
    } else {
        d = new Date(d);
    };
    wsFuncs.setDate(wsFuncs.getDate() + (i * 7));
    var month = wsFuncs.getMonth();
    var year = wsFuncs.getFullYear();
    const monthNames = ["January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];
    return monthNames[month] + ' ' + year;
};

wsFuncs.error = function (e) {
    alert("Failed due to: " + e)
}

wsFuncs.init = function () {
    //this.qPromise(".eod.getExpirations", this.q, [this.state.ticker, this.state.exchange]).then(this.postGetExpirations).catch(e => console.log(" Does not exist " + e).then(this.getExpirations));
    this.qPromise(".eod.getDatedDates", this.q, 0).then(this.postGetDatedDates).catch(e => console.log(" Does not exist " + e).then(this.getDatedDates));
    this.qPromise(".eod.getTickers", this.q, 0).then(this.postGetTickers).catch(e => console.log(" Does not exist " + e).then(this.getTickers));
    this.qPromise(".sod.getPositions", this.q, 0).then(this.postGetPositions).catch(e => console.log(" Does not exist " + e).then(this.getPositions));
    //this.qPromise(".sod.getTrades", this.q, 0).then(this.postGetTrades).catch(e => console.log(" Does not exist " + e).then(this.getTrades));
    //this.qPromise(".sod.getPositionRaw", this.q, 0).then(this.postGetPositionRaw).catch(e => console.log("Does not exist " + e).then(this.postGetPositionRaw));
}

wsFuncs.getOption = function (indexDate, ticker, exchange, optionIndex) {
    (this.qPromise(".eod.getOption", this.q, [indexDate, ticker, exchange, optionIndex])).then(this.postGetOption).catch(this.error)
}
wsFuncs.postGetOption = function (ot) {
    console.log("func.wsFuncs.postGetOption optionTable " + ot.length)
    //let optionMessage = "";
    this.setState({ optionTable: ot });
}

wsFuncs.getExpirations = function (ticker, exchange) {
    (this.qPromise(".eod.getExpirations", this.q, [ticker, exchange])).then(this.postGetExpirations).catch(this.error)
}
wsFuncs.postGetExpirations = function (expirationDates) {
    console.log((expirationDates + '').split(','))
    this.setState({ expirationDates: (expirationDates + '').split(',') });
}

wsFuncs.getSubscriptions = function (tickers) {
    (this.qPromise(".rt.subscribe", this.q, [...tickers])).then(this.postGetSubscriptions).catch(this.error)
}
wsFuncs.postGetSubscriptions = function (tickers) {
    console.log(( tickers + '').split(','))
    this.setState({ subscription: (tickers + '').split(',') });
}

wsFuncs.getPositions = function () {
    (this.qPromise(".sod.getPositions", this.q, 0)).then(this.postGetPositions).catch(this.error)
}
wsFuncs.postGetPositions = function (tabs) {
    console.log('postGetPositions.', tabs)
    this.setState({ position: tabs });
}

wsFuncs.getPositionRaw = function () {
    (this.qPromise(".sod.getPositionRaw", this.q, 0)).then(this.postGetPositionRaw).catch(this.error)
}
wsFuncs.postGetPositionRaw = function (tabs) {
    //const allTabs = Object.entries(tabs)
    console.log('postGetPositionRaw.', tabs)
    this.setState({ positionraw: tabs });
}

wsFuncs.getTrades = function () {
    (this.qPromise(".sod.getTrades", this.q, 0)).then(this.postGetTrades).catch(this.error)
}
wsFuncs.postGetTrades = function (tabs) {
    console.log('postGetTrades.', tabs)
    this.setState({ trade: tabs });
}

wsFuncs.getDatedDates = function () {
    (this.qPromise(".eod.getDatedDates", this.q, 0)).then(this.postGetExpirations).catch(this.error)
}
wsFuncs.postGetDatedDates = function (datedDates) {
    console.log((datedDates + '').split(','))
    this.setState({ datedDates: (datedDates + '').split(',') });
}

wsFuncs.getTickers = function () {
    (this.qPromise(".eod.getTickers", this.q, 0)).then(this.postGetTickers).catch(this.error)
}
wsFuncs.postGetTickers = function (tickers) {
    console.log((tickers + '').split(','))
    this.setState({ tickerList: (tickers + '').split(',') });
}

wsFuncs.postEditRow = function (data) {
    this.state.edit = undefined;
}

wsFuncs.cellChange = function (e, i, kol) {
    this.state.edit = [i, kol, e.target.value];
}

wsFuncs.updateCSS = function () {
    let isNight = !this.state.isNight;
    this.setState({ isNight });
    let bg = isNight ? '#121212f5' : 'white';
    document.body.style.backgroundColor = bg;
}

wsFuncs.tabChange = function(){
    let currentTab=window.location.pathname;
    //Don't display the scrollbar for the calendar
    let scroll = (currentTab==='/') ? 'hidden' : 'initial';
    document.body.style.overflow = scroll;
    this.setState({currentTab})
}

export default wsFuncs