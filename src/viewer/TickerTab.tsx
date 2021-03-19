import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { CellEditingStoppedEvent, ColDef, ColGroupDef, GridApi, GridOptions, GridReadyEvent, RowNode } from 'ag-grid-community';

type TickerTabProps = {
    subsHandler: (conf: string) => void;
};

class TickerTab extends Component<TickerTabProps, {}> {

    constructor(props: TickerTabProps | Readonly<TickerTabProps>) {
        super(props);

        this.state = {
            subscription: []
        }

        this.clickToSubscribe = this.clickToSubscribe.bind(this);
    }

    gridApi: GridApi | undefined ;
    gridOptions: GridOptions | undefined;

    clickToSubscribe = (e:any) => {
        if (this.gridApi) {
            const tickerList:any = [];
            this.gridApi.forEachNode((node: RowNode) =>{
                //console.log('Node value ', node);
                tickerList.push(node.data)
            })

            const ll = tickerList.filter((v: { ticker: string | undefined; }) => { if (v.ticker !== undefined && v.ticker !== '') return true; else return false}).map((v:any) => {return v.ticker});

            console.log('ll = ', ll)
            this.setState({tickerList: ll})
            this.props.subsHandler(ll);
        }
    } 

    render() {
        return (
            <div className="ag-theme-alpine" style={ { height: 400, width: '90%' } } >
                <button style={{display: 'flex', fontSize:'10x', border:'3x' }} onClick={this.clickToSubscribe} >Subscribe</button>
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