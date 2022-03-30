import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import '../selector/TickPanel.css'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { ColDef, ColGroupDef, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';

import { connect } from 'react-redux';
import { newsColDefs} from "./FuturesColumnDefs";
import {store} from "../store/store";
import {send} from "@giantmachines/redux-websocket";
import {v1 as uuidv1} from "uuid";

type NewsTabProps = {
    news:any[]
}

class NewsTab extends Component<NewsTabProps> {

    gridApi: GridApi | undefined ;
    gridOptions: GridOptions | undefined;

    componentDidMount() {
        store.dispatch(send({ id:uuidv1(), func:'getNews', obj:0}));
    }

    componentDidUpdate(prevProps:NewsTabProps) {
        console.log('props received ', prevProps);
    }

    render() {
        console.log('NewsTab.news', this.props);
        return (
            <div className="ag-theme-alpine" style={ {width: '95%' } } >
                <div className="ag-theme-alpine" style={ { height: 800, margin: '2%'} } >
                    <AgGridReact
                        //modules={this.state.modules}
                        rowData={this.props.news}
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
        return newsColDefs;
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

    console.log('NewsTab.mapStateToProps ', state);
    let retValue = {news: []}
    if (state !== undefined && state.news !== undefined) {
        retValue = {news: state.news}
    }

    return retValue;
};

export default connect(mapStateToProps)(NewsTab);