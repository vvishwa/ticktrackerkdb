import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '../actions/tickerActions';
import { store } from '../store/store';
import { send } from '@giantmachines/redux-websocket';
import { v1 as uuidv1 } from 'uuid';

type DatedListProps = {
    datedList: any[];
    actions: typeof actions;
};

type DatedListState = {
    datedList: any[];
    selectedDatedDate: any;
}

class datedListPanel extends Component<DatedListProps, DatedListState> {

    constructor(props: DatedListProps | Readonly<DatedListProps>) {
        super(props);

        this.state = {
            datedList:[],
            selectedDatedDate:''
        }
        this.onClickHandler = this.onClickHandler.bind(this);
    }

    componentDidMount() {
        store.dispatch(send({ id:uuidv1(), func:'.eod.getDatedDates', obj:0.0 }));
    }

    onClickHandler(e:any) {
        const dateSelected = e.target.value;
        console.log('datedListPanel datedDateSelected ', dateSelected);
        console.log('datedListPanel last this.state ', this.state);
        this.setState({selectedDatedDate: dateSelected})

        this.props.actions.selectDatedDate(dateSelected);

    }

    render() {
        const feedDateLabel = this.props.datedList.length >0? this.props.datedList.map(e => { return <option key={e} value={e}>{e}</option> }):<option></option>;
        return (
            <div className="tickerlist">
                <select value={this.state.selectedDatedDate} onChange={this.onClickHandler}>
                    <option hidden value="2000-01-01">Feed Date</option>
                    {feedDateLabel}
                </select>
            </div>
        );
    }
}

const mapStateToProps = (state:any) => {
    console.log('datedListPanel.mapStateToProps ', state);
    if (state !== undefined && state.datedList !== undefined) {
        return  {datedList: state.datedList};
    } else {
        return  {datedList: []};
    }
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(datedListPanel);