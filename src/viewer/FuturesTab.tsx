import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import '../selector/TickPanel.css'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { actions } from '../actions/tickerActions';
import { ColDef, ColGroupDef, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';

import {connect} from 'react-redux';
import {futurColDefs} from "./FuturesColumnDefs";
import {bindActionCreators} from "redux";

type FutureTabProps = {
    futures:any[],
    actions: typeof actions;
}

type FutureTabState = {
    futures:any[]
}

class FuturesTab extends Component<FutureTabProps, FutureTabState> {

    gridApi: GridApi | undefined ;
    gridOptions: GridOptions | undefined;

    constructor(props: FutureTabProps) {
        super(props);
        this.state = {
            futures: []
        }
    }
    componentDidUpdate(prevProps:FutureTabProps) {
        console.log('FuturesTab.trade props.futures prev ', prevProps.futures);
        /*
        this.setState({
            futures : this.props.futures
        })
        
        prevProps.futures.forEach(value => {
            this.props.actions.selectFutures(value);
        });
        */
    }

    render() {
        console.log('FuturesTab.trade props.futures -> ', this.props.futures, ' state.futures ->', this.state.futures);
        

        return (
            <div className="ag-theme-alpine" style={ {width: '95%' } } >
                <div className="ag-theme-alpine" style={ { height: 800, margin: '2%'} } >
                    <AgGridReact
                        //modules={this.state.modules}
                        rowData={this.props.futures}
                        defaultColDef={this.createDefColDefs()}
                        columnDefs={this.createColunDefs()}
                        getRowNodeId={(n:any) =>{return n.ticker}}

                        ref={(grid: any) => {
                            if (grid) {
                                this.gridOptions = grid.gridOptions;
                            }
                        }}
                        onGridReady={this.onGridReady}>

                    </AgGridReact>
                </div>
            </div>
        );
    }

    createColunDefs(): (ColDef|ColGroupDef)[] {
        return futurColDefs;
    }

    createDefColDefs(): (ColDef|ColGroupDef) {
        return {
            autoHeight: false,
            resizable: true,
            filter: true,
            menuTabs: ['generalMenuTab', 'filterMenuTab','columnsMenuTab']
        }
    }

    onGridReady = (params: GridReadyEvent) => {
        this.gridApi = params.api;

        params.columnApi.autoSizeAllColumns();
    }

};

const mapDispatchToProps = (dispatch: any) => {
    console.log("calling with ", dispatch)
    //dispatch(actions)
    return {
        actions: bindActionCreators(actions, dispatch)
    }
};

const mapStateToProps = (state:any, ownProps:FutureTabState) => {

    console.log('FuturesTab.mapStateToProps state', state);
    let retValue = {futures: []}
    if (state !== undefined && state.td_futures_raw !== undefined) {
        retValue = {futures: state.td_futures_raw}
    }

    return retValue;
};

export default connect(mapStateToProps, mapDispatchToProps)(FuturesTab);