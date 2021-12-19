import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import '../selector/TickPanel.css'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { CellEditingStoppedEvent, ColDef, ColGroupDef, GridApi, GridOptions, GridReadyEvent, RowNode } from 'ag-grid-community';
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

    clickToSubscribe = (e:any) => {
        if (this.gridApi) {
            const tickerList:any = [];
            this.gridApi.forEachNode((node: RowNode) =>{
                //console.log('Node value ', node);
                tickerList.push(node.data)
            })

            const ll = tickerList.filter((v: { symbol: string | undefined; }) => { if (v.symbol !== undefined && v.symbol !== '') return true; else return false}).map((v:any) => {return v.symbol});

            console.log('ll = ', ll)
            this.setState({tickerList: ll})
            rtstore.dispatch(send({ id:Date.now(), func:'.rt.subscribe', obj:[...ll]}));
        }
    } 

    render() {
        return (
            <div className="ag-theme-alpine" style={ {width: '95%' } } >
                <button className='tickerlist' onClick={this.clickToSubscribe} >Subscribe</button>
                <div className="ag-theme-alpine" style={ { height: 800, margin: '2%'} } >
                    <AgGridReact
                        rowData={this.props.getQuotes_rslt.length === 0? [{symbol:''}]:this.props.getQuotes_rslt}
                        columnDefs={this.createColunDefs()}
                        defaultColDef={this.createDefColDefs()}
                        getRowNodeId={(n:Quote) =>{return n.symbol}}
                        
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
                    this.gridApi.forEachNode((node:RowNode) => {
                        items.push(node.data.symbol);
                    })
                    if (items[items.length-1] !== '')
                        this.gridApi.applyTransaction({add:[{symbol:''}]})
                }
            }
        }
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
