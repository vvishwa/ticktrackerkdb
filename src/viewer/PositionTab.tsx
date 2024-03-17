import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import '../selector/TickPanel.css'

import { ColDef, ColGroupDef, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { FlattenedPosition, Position } from '../dto/position';

type PositionTabProps = {
    position:Position[]
}

type PositionTabState = {
    position:FlattenedPosition[]
}

class PositionTab extends Component<PositionTabProps, PositionTabState> {

    gridApi: GridApi | undefined ;
    gridOptions: GridOptions | undefined;
    
    constructor(props: PositionTabProps) {
        super(props);

        console.log('PositionTab.. ', props);

        const flatPosition:FlattenedPosition[] = props.position.map((v:any) => { return {averagePrice: v.averagePrice, longQuantity: v.longQuantity, 
                settledLongQuantity:v.settledLongQuantity, assetType: v.instrument.assetType, cusip: v.instrument.cusip, marketValue: v.marketValue, symbol:v.instrument.symbol}});
        this.state = {
            position : flatPosition
        }
    }
    componentDidUpdate(prevProps:PositionTabProps) {
        console.log('props received ', prevProps);
    }

    render() {
        return (
            <div className="ag-theme-alpine" style={ {width: '95%', height:'75%' } } >
                <div className="ag-theme-alpine" style={ { height: 750, margin: '2%'} } >
                    <AgGridReact
                        rowData={this.state.position}
                        defaultColDef={this.createDefColDefs()}
                        columnDefs={this.createColunDefs()}
                        //gridApi.getRowNode={(n:FlattenedPosition) =>{return n.symbol}}

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
        return [
            { field:'assetType', headerName:'Asset'},
            { field:'cusip', headerName:'Cusip'},
            { field:'symbol', headerName:'Symbol'},
            { field:'averagePrice', headerName:'Avg Price'}, 
            { field:'longQuantity', headerName:'Qty'},
            { field:'settledLongQuantity', headerName:'Settled Qty'},
            { field: 'marketValue', headerName:'Mkt Value'}
        ]
    }

    createDefColDefs(): (ColDef|ColGroupDef) {
        return {
            autoHeight: false,
            resizable: true,
            filter: true,
            //cellRenderer: 'agAnimateSlideCellRenderer'
        }
    }

    onGridReady = (params: GridReadyEvent) => {
        this.gridApi = params.api;

        params.columnApi.autoSizeAllColumns();
    }
    
};

export default PositionTab;