import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import '../selector/TickPanel.css'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { ColDef, ColGroupDef, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';

import { FlattenedTrade, Trade } from '../dto/trade';
import { connect } from 'react-redux';
import {futurColDefs} from "./FuturesColumnDefs";

type FutureTabProps = {
    futures:any[]
}

class FuturesTab extends Component<FutureTabProps> {

    gridApi: GridApi | undefined ;
    gridOptions: GridOptions | undefined;

    componentDidUpdate(prevProps:FutureTabProps) {
        console.log('props received ', prevProps);
    }

    render() {
        console.log('FuturesTab.trade', this.props);
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

const mapStateToProps = (state:any) => {

    console.log('FuturesTab.mapStateToProps ', state);
    let retValue = {futures: []}
    if (state !== undefined && state.td_futures_raw !== undefined) {
        retValue = {futures: state.td_futures_raw}
    }

    return retValue;
};

export default connect(mapStateToProps)(FuturesTab);