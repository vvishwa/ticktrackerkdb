import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import '../selector/TickPanel.css'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { ColDef, ColGroupDef, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { Position } from '../dto/position';
import { store } from '../store/store';
import { send } from '@giantmachines/redux-websocket/dist';
import { v1 as uuidv1 } from 'uuid';
import { connect } from 'react-redux';

type PositionTabProps = {
    td_chart: Map<string, object>;
    position:Position[],
    td_quote_raw:Map<string, object>,
    userPrincipals:any
}

type PositionTabState = {
    positionRows:any[]
}

class PositionTab extends Component<PositionTabProps, PositionTabState> {

    gridApi: GridApi | undefined ;
    gridOptions: GridOptions | undefined;

    constructor(props: PositionTabProps) {
        super(props);
        this.state = {
            positionRows:[]
        }
        console.log('PositionTab.. ', props);
    }

    componentDidUpdate(prevProps:PositionTabProps, prevState:PositionTabState) {
        //console.log('prevProps received ', prevProps);

        if(prevProps.position !== undefined && this.state.positionRows.length === 0)
            this.setState({positionRows: prevProps.position})

        let positionRowsOriginal = [...this.state.positionRows]
        prevProps.td_quote_raw.forEach((v,k,m) => {
            let posOriginal = this.state.positionRows.find(value => {return value.instrument.symbol === k?value:undefined})
            const posIndex = this.state.positionRows.findIndex(value => {return value.instrument.symbol === k?value:undefined})

            if(posOriginal !== undefined) {
                const lastPrices = v;

                const pos = {...posOriginal, ...lastPrices}
                if(JSON.stringify(pos) !== JSON.stringify(positionRowsOriginal[posIndex])) {
                    positionRowsOriginal[posIndex] = pos
                    this.setState({positionRows: positionRowsOriginal})
                }
            }
        })

        prevProps.td_chart.forEach((v,k,m) => {
            let posOriginal = this.state.positionRows.find(value => {return value.instrument.symbol === k?value:undefined})
            const posIndex = this.state.positionRows.findIndex(value => {return value.instrument.symbol === k?value:undefined})

            if(posOriginal !== undefined) {
                const lastPrices = v;
                //console.log('k, prevProps.td_chart, lastPrices1m ',k, prevProps.td_chart,lastPrices)
                const pos = {...posOriginal, ...lastPrices}

                if(JSON.stringify(pos) !== JSON.stringify(positionRowsOriginal[posIndex])) {
                    positionRowsOriginal[posIndex] = pos
                    this.setState({positionRows: positionRowsOriginal})
                }
            }
        })
    }

    componentDidMount() {
        store.dispatch(send({id: uuidv1(), func:'.sod.getPositionRaw', obj:0}));
        store.dispatch(send({id: uuidv1(), func:'.sod.register', obj:0}));
    }

    render() {
        //console.log("this.state ", this.state)

        return (
            <div className="ag-theme-alpine" style={ {width: '95%', height:'75%' } } >
                <div className="ag-theme-alpine" style={ { height: 750, margin: '2%'} } >
                    <AgGridReact
                        immutableData={true}
                        rowData={this.state.positionRows}
                        defaultColDef={this.createDefColDefs()}
                        columnDefs={this.createColunDefs()}
                        getRowNodeId={(n:Position) =>{return n.instrument.symbol}}
                        
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
            //{ field:'assetType', headerName:'Asset'},
            //{ field:'cusip', headerName:'Cusip'},
            { field:'instrument.symbol', headerName:'Symbol'},
            { field:'averagePrice', headerName:'Avg Price'},
            { field:'lastPrice', headerName:'Last Price'},
            { field:'longQuantity', headerName:'Qty'},
            { field:'settledLongQuantity', headerName:'Settled Qty'},
            { field: 'marketValue', headerName:'Mkt Value'},
            { valueGetter:param => {return (param.data.marketValue - param.data.averagePrice*param.data.longQuantity);},
                                            cellStyle:p=>{return p.value>0?{color: 'green'}:{color: 'red'};},
                                            valueFormatter:number=>{return (Math.round(number.value * 100) / 100).toFixed(2);}, headerName: 'P/L Open'},
            { field: 'totalVolume', headerName:'Tot Vol'},
            { field: 'openPrice1m', headerName: '1M Open'},
            { field: 'closePrice1m', headerName: '1M Close'},
            { field: 'highPrice1m', headerName: '1M High'},
            { field: 'lowPrice1m', headerName: '1M Low'},
            { field: 'volume1m', headerName: '1M Vol'},
            { field: 'bidPrice', headerName:'Bid'},
            { field: 'bidSize', headerName:'Bid Size'},
            { field: 'askPrice', headerName:'Ask'},
            { field: 'askSize', headerName:'Ask Size'},
            { field: 'netChange', headerName: 'Net Chg'},
            { field: 'week52High', headerName: '52W High'},
            { field: 'week52Low', headerName: '52W Low'},
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


const mapStateToProps = (state:any, ownProps:PositionTabProps) => {
    const td_raw:any[] = state.td_quote_raw;

    const td_chart:any[] = state.td_chart;

    const td_raw_map:Map<string, object> = td_raw !== undefined? new Map(td_raw.map(obj => [obj.ticker, {bidPrice:obj["bidPrice"], askPrice:obj["askPrice"], lastPrice:obj["lastPrice"], bidSize:obj["bidSize"],
        askSize:obj["askSize"], totalVolume:obj["totalVol"], lastSize:obj["9"], highPrice:obj["12"], lowPrice:obj["13"], closePrice:obj["15"], openPrice:obj["28"], netChange:obj["netChange"],
        week52High:obj["week52High"], week52Low:obj["week52Low"]}])):new Map();

    console.log('td_raw_map', td_raw_map)

    const td_chart_map:Map<string, object> = td_chart !== undefined? new Map(td_chart.map(obj => [obj.ticker, {openPrice1m:obj["openPrice"], highPrice1m:obj["highPrice"], lowPrice1m:obj["lowPrice"],
        closePrice1m:obj["closePrice"], volume1m:obj["volume"]}])):new Map();

    const retValue = {userPrincipals: state.userPrincipals,
        position: state.securitiesAccount !== undefined? state.securitiesAccount.positions:undefined,
        td_quote_raw: state.td_quote_raw !==undefined? td_raw_map:new Map(),
        td_chart: state.td_chart !== undefined? td_chart_map:new Map()}

    return retValue;
};

export default connect(mapStateToProps, null)(PositionTab);
