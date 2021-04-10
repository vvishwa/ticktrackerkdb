import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '../actions/tickerActions';
import { store } from '../store/store';
import { send } from '@giantmachines/redux-websocket';

type TickProps = {
    tickerList: any[];
    actions: typeof actions;
};

type TickerState = {
    tickerList: any[];
    selectedTicker: any;
}

class TickerListPanel extends Component<TickProps, TickerState> {

    constructor(props: TickProps | Readonly<TickProps>) {
        super(props);

        this.state = {
            tickerList:[],
            selectedTicker:''
        }
        this.onClickHandler = this.onClickHandler.bind(this);
    }

    componentDidMount() {
        store.dispatch(send({ id:12345, func:'.eod.getTickers', obj:0.0 }));
    }

    componentDidUpdate(prevProps:TickProps) {
        console.log('TickerListPanel componentDidUpdate prevProps ', prevProps);
        if (prevProps.tickerList.length > 0) {
            this.setState({tickerList: prevProps.tickerList})
        }
    }

    onClickHandler(e:any) {
        const tickerSelected = e.target.value;
        console.log('TickerListPanel tickerSelected ', tickerSelected);
        console.log('TickerListPanel this.state ', this.state);
        this.setState({selectedTicker: tickerSelected})

        this.props.actions.selectTicker(tickerSelected);

        const tmp:string[] = tickerSelected.split(".");
        store.dispatch(send({ id:123455, func:'.eod.getExpirations', obj:[tmp[0], tmp[1]] }));
    }

    render() {
        const tkrLabel = this.props.tickerList.length >0? this.props.tickerList.map(e => { return <option key={e} value={e}>{e}</option> }):
        this.state.tickerList.length > 0? this.state.tickerList.map(e => { return <option key={e} value={e}>{e}</option> }):<option></option>;
        return (
            <div className="tickerlist">
                <select value={this.state.selectedTicker} onChange={this.onClickHandler}>
                    <option hidden value="KKK.KKK">Tickers</option>
                    {tkrLabel}
                </select>
            </div>
        );
    }
}

const mapStateToProps = (state:any) => {
    console.log('TickerListPanel.mapStateToProps ', state);
    if (state !== undefined && state.tickerList !== undefined) {
        return  {tickerList: state.tickerList};
    } else {
        return  {tickerList: []};
    }
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
};

// connect our component to the redux store
export default connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { forwardRef: true } // must be supplied for react/redux when using AgGridReact
)(TickerListPanel);