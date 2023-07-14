import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import '../selector/TickPanel.css'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { CellEditingStoppedEvent, ColDef, ColGroupDef, GetRowIdFunc, GridApi, GridOptions, GridReadyEvent, RowClassParams, RowNode } from 'ag-grid-community';
import { quoteColDefs } from './QuoteColumnDefs';
import { Quote } from '../dto/quote'
import { rtstore } from '../store/rtstore';
import { connect as wsconnect, send } from '@giantmachines/redux-websocket/dist';
import { connect } from 'react-redux';

type TickerTabProps = {
    getQuotes_rslt:Quote[];
};

type TickerTabState = {
    subscription:any[];
    tickerList:string[];
};

class TickerTab extends Component<TickerTabProps, TickerTabState> {
    getRowId: GetRowIdFunc = (params:any) =>{return params.data.symbol};

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


    componentDidMount() {
        rtstore.dispatch(wsconnect('ws://apj.local:5001/'));
    }

    onCellEditingStopped = (event: CellEditingStoppedEvent) => {
        if (this.gridApi) {
            const items:string[] = [];
            this.gridApi.forEachNode((node:RowNode) => {
                items.push(node.data.symbol);
                this.state.tickerList.push(node.data.symbol);
            })
            
            if (items[items.length-1] !== '')
                this.gridApi.applyTransaction({add:[{symbol:''}]})
        }
    }
    
    clickToSubscribe = (e:any) => {
        if (this.gridApi) {
            const tickerList:any = [];
            this.gridApi.forEachNode((node: RowNode) =>{
                tickerList.push(node.data)
            })

            const ll = tickerList.filter((v: { symbol: string | undefined; }) => { if (v.symbol !== undefined && v.symbol !== '') return true; else return false}).map((v:any) => {return v.symbol});

            console.log('ll = ', ll)
            this.setState({tickerList: ll})
            rtstore.dispatch(send({ id:Date.now(), func:'.rt.subscribe', obj:[...ll]}));
        }
    } 

    rowStyle = { background: 'cyan' };

    getRowStyle = (params:RowClassParams) => {
        if (params.node.rowIndex !==null && params.node.rowIndex % 2 === 0) {
            return { background: 'pink' };
        }
    };

    render() {
        return (
            <div className="ag-theme-alpine" style={ {width: '95%' } } >
                <button className='tickerlist' onClick={this.clickToSubscribe} >Subscribe</button>
                <div className="ag-theme-alpine" style={ { height: 800, margin: '2%', width: '95%'} } >
                    <AgGridReact
                        rowData={this.props.getQuotes_rslt.length === 0? [{symbol:''}]:this.props.getQuotes_rslt}
                        columnDefs={this.createColunDefs()}
                        defaultColDef={this.createDefColDefs()}
                        //getRowNodeId={(n:Quote) =>{return n.symbol}}
                        //getRowId={this.getRowId}
                        rowStyle={this.rowStyle}
                        getRowStyle={this.getRowStyle}
                        ref={(grid: any) => {
                            if (grid && (!this.gridOptions)) {
                                this.gridOptions = grid.gridOptions;
                            }
                        }}

                        onCellEditingStopped={this.onCellEditingStopped}
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
        params.api.sizeColumnsToFit();
        params.columnApi.autoSizeAllColumns();
    }
};

const mapStateToProps = (state:any) => {
    console.log('TickerTab.mapStateToProps ', state);
    let retValue = {getQuotes_rslt: []}
    if (state !== undefined) {
      if (state.rtResponse !== undefined && state.rtResponse.result !== undefined) {
        retValue = {getQuotes_rslt: state.rtResponse.result}
      } 
    }

    return retValue;
}

// connect our component to the redux store
export default connect(mapStateToProps)(TickerTab);
