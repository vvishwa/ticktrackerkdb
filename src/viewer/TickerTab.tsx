import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { CellEditingStoppedEvent, ColDef, ColGroupDef, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';

class TickerTab extends Component {

    gridApi: GridApi | undefined ;
    gridOptions: GridOptions | undefined;

    render() {
        return (
            <div className="ag-theme-alpine" style={ { height: 400, width: '98%' } } >
                <AgGridReact
                    rowData={[{ticker: ''}]}
                    columnDefs={this.createColunDefs()}
                    
                    ref={(grid: any) => {
                        if (grid) {
                            this.gridOptions = grid.gridOptions;
                        }
                    }}
                    onGridReady={this.onGridReady}>
                    
                </AgGridReact>
            </div>
        );
    }    

    createColunDefs(): (ColDef|ColGroupDef)[] {
        return [
            {field: 'ticker', headerName:'Ticker', singleClickEdit:true, editable: true}
        ]
    }

    onGridReady = (params: GridReadyEvent) => {
        this.gridApi = params.api;
        
        this.addEventHandlers();
    }
    
    addEventHandlers() {
        console.log('addEventHandlers...')
        if (this.gridOptions) {
            console.log('gridoptions....')
        }

        if(this.gridOptions) {
            console.log('gridApi...')
            this.gridOptions.onCellEditingStopped = (event: CellEditingStoppedEvent) => {
                console.log('cell editing stopped ', event)
                if (this.gridApi) {
                    this.gridApi.applyTransaction({add:[{ticker:''}]})
                }
            }
        }
    }
};

export default TickerTab;