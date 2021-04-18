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

wsFuncs.error = function (e) {
    alert("Failed due to: " + e)
}

wsFuncs.init = function () {
    this.qPromise(".sod.getPositions", this.q, 0).then(this.postGetPositions).catch(e => console.log(" Does not exist " + e).then(this.getPositions));
    this.qPromise(".sod.getPositionRaw", this.q, 0).then(this.postGetPositionRaw).catch(e => console.log("Does not exist " + e).then(this.postGetPositionRaw));
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

export default wsFuncs