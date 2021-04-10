import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '../actions/tickerActions';
import { store } from '../store/store';
import { send } from '@giantmachines/redux-websocket';

type ExpirationProps = {
    selectedTicker: string;
    expirationDates: any[];
    //changeX: ((event: React.ChangeEvent<HTMLSelectElement>) => void) | undefined;
    actions: typeof actions;
};

type ExpirationState = {
    selectedTicker: any;
    expirationDates: any[];
}

class ExpirationListPanel extends Component<ExpirationProps, ExpirationState> {

    constructor(props: ExpirationProps | Readonly<ExpirationProps>) {
        super(props);

        this.state = {
            selectedTicker:{symbol:''},
            expirationDates: []
        }
        this.onClickHandler = this.onClickHandler.bind(this);
    }

    componentDidUpdate(prevProps: ExpirationProps) {
        
        console.log('ExpirationListPanel.componentDidUpdate prevProps', prevProps);
        console.log('ExpirationListPanel.componentDidUpdate this.state', this.state);

        if (prevProps !== undefined) {
            if (prevProps.expirationDates !== undefined && this.state.expirationDates === null) {
                this.setState({expirationDates: prevProps.expirationDates})
            } else if (prevProps.selectedTicker !== undefined && this.state.selectedTicker === null) {
                this.setState({selectedTicker: prevProps.selectedTicker})
            }
        }
        
    }

    onClickHandler(e:any) {
        //this.setState({expirationDates: this.props.expirationDates, selectedTicker: this.props.selectedTicker});
        
        const expirationDateSelected = e.target.value;
        console.log('ExpirationListPanel expirationDateSelected ', expirationDateSelected);
        console.log('ExpirationListPanel this.state ', this.state);
        let tmp:string[] = this.state.selectedTicker.symbol.split('.');

        //.eod.getOption["2021-01-08";"AAPL";"US";enlist "6"]
        store.dispatch(send({ id:123456, func:'.eod.getOption', obj:['AAPL', 'US'], expirationDateSelected}));
    }

    render() {
        const expLabel = this.props.expirationDates !== undefined? this.props.expirationDates.map((e, i) => { return <option key={i} value={i}>{e}</option> }):
        this.state.expirationDates !== undefined? this.state.expirationDates.map((e, i) => { return <option key={i} value={i}>{e}</option> }) : <option></option>;

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
    if (state !== undefined) {
      if (state.expirations !== undefined) {
        return  {expirationDates: state.expirations};
      } else if (state.selectedTicker !== undefined) {
        return {selectedTicker: state.selectedTicker}
      }
    } else {
      return  {expirationDates: [], selectedTicker:''};
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
)(ExpirationListPanel);