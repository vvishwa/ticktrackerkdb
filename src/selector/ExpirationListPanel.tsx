import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '../actions/tickerActions';
import { store } from '../store/store';
import { send } from '@giantmachines/redux-websocket';

type ExpirationProps = {
    selectedTicker: string;
    expirationDates: any[];
    actions: typeof actions;
};


class ExpirationListPanel extends Component<ExpirationProps> {

    constructor(props: ExpirationProps | Readonly<ExpirationProps>) {
        super(props);

        this.onClickHandler = this.onClickHandler.bind(this);
    }

    onClickHandler(e:any) {
        //this.setState({expirationDates: this.props.expirationDates, selectedTicker: this.props.selectedTicker});
        
        const expirationDateSelected = e.target.value;
        console.log('ExpirationListPanel expirationDateSelected ', expirationDateSelected);
        console.log('ExpirationListPanel this.props ', this.props);
        let tmp:string[] = this.props.selectedTicker.split('.');

        store.dispatch(send({ id:123456, func:'.eod.getOption', obj:['2020-12-02',tmp[0], tmp[1], expirationDateSelected]}));
    }

    render() {
        const expLabel = this.props.expirationDates !== undefined? this.props.expirationDates.map((e, i) => { return <option key={i} value={i}>{e}</option> }): <option></option>;
        //this.state.expirationDates !== undefined? this.state.expirationDates.map((e, i) => { return <option key={i} value={i}>{e}</option> }) : <option></option>;

        return (
            <div className="tickerlist">
            <select onChange={this.onClickHandler}>
                <option hidden value="2000-01-01">Call Expiring</option>
                {expLabel}
            </select>
        </div>
        );
    }
}

const mapStateToProps = (state:any) => {
    
    console.log('ExpirationListPanel.mapStateToProps ', state);
    let retValue = {expirationDates: [], selectedTicker:''}
    if (state !== undefined) {
      if (state.expirations !== undefined) {
        retValue = {...retValue, expirationDates: state.expirations}
      } 
      if (state.selectedTicker !== undefined) {
        retValue = {...retValue, selectedTicker: state.selectedTicker.symbol}
      }
    }

    return retValue;
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
)(ExpirationListPanel);