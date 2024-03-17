import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import '../selector/TickPanel.css'

import {
    CellEditingStoppedEvent,
    ColDef,
    ColGroupDef,
    GridApi,
    GridOptions,
    GridReadyEvent,
    IRowNode,
    RowNode
} from 'ag-grid-community';
import { quoteColDefs } from './QuoteColumnDefs';
import { Quote } from '../dto/quote'

type TickerTabProps = {
    subsHandler: (conf: string) => void;
    getQuotes_rslt:Quote[];
};

type TickerTabState = {
    subscription:any[];
    tickerList:string[];
};

class TickerTab extends Component<TickerTabProps, TickerTabState> {

    constructor(props: TickerTabProps | Readonly<TickerTabProps>) {
        super(props);

        this.state = {
            tickerList: [],
            subscription: [],
        }

        this.clickToSubscribe = this.clickToSubscribe.bind(this);
    }

    gridApi: GridApi | undefined ;
    gridOptions: GridOptions | undefined;

    clickToSubscribe = (e:any) => {
        if (this.gridApi) {
            const tickerList:any = [];
            this.gridApi.forEachNode((node: IRowNode) =>{
                //console.log('Node value ', node);
                tickerList.push(node.data)
            })

            const ll = tickerList.filter((v: { symbol: string | undefined; }) => { if (v.symbol !== undefined && v.symbol !== '') return true; else return false}).map((v:any) => {return v.symbol});

            console.log('ll = ', ll)
            this.setState({tickerList: ll})
            this.props.subsHandler(ll);
        }
    } 

    render() {
        return (
            <div className="ag-theme-quartz" style={ {width: '95%' } } >
                <button className='tickerlist' onClick={this.clickToSubscribe} >Subscribe</button>
                <div className="ag-theme-quartz" style={ { height: 800, margin: '2%'} } >
                    <AgGridReact
                        rowData={this.props.getQuotes_rslt.length === 0? [{symbol:''}]:this.props.getQuotes_rslt}
                        columnDefs={this.createColunDefs()}
                        defaultColDef={this.createDefColDefs()}
                        //getRowId={(n:Quote) =>{return n.symbol}}
                        
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
        return quoteColDefs
    }

    createDefColDefs(): (ColDef|ColGroupDef) {
        return {
            autoHeight: false,
            resizable: true,
            cellRenderer: 'agAnimateSlideCellRenderer'
        }
    }

    onGridReady = (params: GridReadyEvent) => {
        this.gridApi = params.api;
        params.columnApi.autoSizeAllColumns();
        this.addEventHandlers();
    }
    
    addEventHandlers() {
        if(this.gridOptions) {
            this.gridOptions.onCellEditingStopped = (event: CellEditingStoppedEvent) => {
                if (this.gridApi) {
                    const items:string[] = [];
                    this.gridApi.forEachNode((node:IRowNode) => {
                        items.push(node.data.symbol);
                    })
                    if (items[items.length-1] !== '')
                        this.gridApi.applyTransaction({add:[{symbol:''}]})
                }
            }
        }
    }
};

export default TickerTab;