import React, { Component, useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import '../selector/TickPanel.css'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { CellEditingStoppedEvent, GridApi, GridOptions, GridReadyEvent, RowNode } from 'ag-grid-community';
import { quoteColDefs } from './QuoteColumnDefs';
import { Quote } from '../dto/quote'
import { rtstore } from '../store/rtstore';
import { connect as wsconnect, send } from '@giantmachines/redux-websocket/dist';
import { connect } from 'react-redux';

type TickerTabProps = {
    getQuotes_rslt:Quote[];
};

const TickerTabNew = (props:TickerTabProps) => {

    useEffect(() => {
        rtstore.dispatch(wsconnect('ws://apj.local:5001/'));
    })

    const[tickerList, setTickerList] = useState<string[]>([])

    const [gridApi, setGridApi] = useState<GridApi>();
    const [gridOptions, setGridOption] = useState<{gridOption:null|GridOptions}>({ gridOption: null});

    const colDefn = quoteColDefs;
    const colDefaults =  {
            autoHeight: false,
            resizable: true,
            cellRenderer: 'agAnimateSlideCellRenderer'
    }

    const onCellEditingStopped = (event: CellEditingStoppedEvent) => {
        console.log("TickerTabNew: gridOptions "+event+" \n GridApi "+gridApi)
        if (gridApi) {
            const items:string[] = [];
            gridApi.forEachNode((node:RowNode) => {
                items.push(node.data.symbol);
                setTickerList(items);
            })
            if (items[items.length-1] !== '')
                gridApi.applyTransaction({add:[{symbol:''}]})
        }
    }
    

    const onGridReady = (params: GridReadyEvent) => {
        setGridApi(params.api);
        params.columnApi.autoSizeAllColumns();
    }

    const clickToSubscribeTicker = (e:any) => {
        if (gridApi) {
            const tickers:any = [];
            gridApi.forEachNode((node: RowNode) =>{
                //console.log('Node value ', node);
                tickers.push(node.data)
            })
    
            const ll = tickers.filter((v: { symbol: string | undefined; }) => { if (v.symbol !== undefined && v.symbol !== '') return true; else return false}).map((v:any) => {return v.symbol});
    
            console.log('ll = ', ll)
            setTickerList(ll);
            rtstore.dispatch(send({ id:Date.now(), func:'.rt.subscribe', obj:[...ll]}));
        }
    } 

    
    return (
        <div className="ag-theme-alpine" style={ {width: '95%' } } >
            <button className='tickerlist' onClick={clickToSubscribeTicker} >Subscribe</button>
            <div className="ag-theme-alpine" style={ { height: 800, margin: '2%'} } >
                <AgGridReact
                    rowData={props.getQuotes_rslt.length === 0? [{symbol:''}]:props.getQuotes_rslt}
                    columnDefs={colDefn}
                    defaultColDef={colDefaults}
                    //getRowNodeId={(n:Quote) =>{return n.symbol}}
                    
                    ref={(grid: any) => {
                        if (grid) {
                            setGridOption(grid.gridOptions);
                        }
                    }}
                    onCellEditingStopped={onCellEditingStopped}
                    onGridReady={onGridReady}>
                    
                </AgGridReact> 
            </div>     
        </div>
    );
}
const mapStateToProps = (state:any) => {
    console.log('TickerTabNew.mapStateToProps ', state);
    let retValue = {getQuotes_rslt: []}
    if (state !== undefined) {
      if (state.rtResponse !== undefined && state.rtResponse.result !== undefined) {
        retValue = {getQuotes_rslt: state.rtResponse.result}
      } 
    }

    return retValue;
}

// connect our component to the redux store
export default connect(mapStateToProps)(TickerTabNew);
