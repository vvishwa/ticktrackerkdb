import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import '../selector/TickPanel.css'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { ColDef, ColGroupDef, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { FlattenedPosition, Position } from '../dto/position';
import { store } from '../store/store';
import { send } from '@giantmachines/redux-websocket/dist';
import { v1 as uuidv1 } from 'uuid';
import { connect } from 'react-redux';

type PositionTabProps = {
    position:Position[],
    td_quote_raw:any,
    userPrincipals:any
}

class PositionTab extends Component<PositionTabProps> {

    gridApi: GridApi | undefined ;
    gridOptions: GridOptions | undefined;
    
    constructor(props: PositionTabProps) {
        super(props);

        console.log('PositionTab.. ', props);

    }

    componentDidUpdate(prevProps:PositionTabProps) {
        console.log('prevProps received ', prevProps);
        //store.dispatch(send({ id:uuidv1(), func:'.sod.getUserPrincipal', obj:0}));
    }

    componentDidMount() {
        store.dispatch(send({id: uuidv1(), func:'.sod.getPositionRaw', obj:0}));
        store.dispatch(send({id: uuidv1(), func:'.sod.register', obj:0}));
    }

    render() {
        const flatPosition:FlattenedPosition[] = this.props.position !== undefined? this.props.position.map((v:any) => { return {averagePrice: v.averagePrice, longQuantity: v.longQuantity,
               settledLongQuantity:v.settledLongQuantity, assetType: v.instrument.assetType, cusip: v.instrument.cusip, marketValue: v.marketValue, symbol:v.instrument.symbol, currentPrice:v.currentPrice}}):[];

        return (
            <div className="ag-theme-alpine" style={ {width: '95%', height:'75%' } } >
                <div className="ag-theme-alpine" style={ { height: 750, margin: '2%'} } >
                    <AgGridReact
                        immutableData={true}
                        rowData={flatPosition}
                        defaultColDef={this.createDefColDefs()}
                        columnDefs={this.createColunDefs()}
                        getRowNodeId={(n:FlattenedPosition) =>{return n.symbol}}
                        
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
            { field:'symbol', headerName:'Symbol'},
            { field:'averagePrice', headerName:'Avg Price'},
            { field: 'currentPrice', headerName:'Current Price'},
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


const mapStateToProps = (state:any) => {
    const td_raw:any[] = state.td_quote_raw;

    const map = td_raw !== undefined? new Map(td_raw.map(obj => [obj.ticker, obj["3"]])):new Map();
    console.log(map);

    const flatPosition = state.securitiesAccount !== undefined? state.securitiesAccount.positions.map((value: { currentPrice: any; instrument: { symbol: any; }; }) => {value.currentPrice= map.get(value.instrument.symbol) !== undefined? map.get(value.instrument.symbol):value.currentPrice; return value}):undefined;
    //console.log(flatPosition);
    let retValue = {userPrincipals: state.userPrincipals, position: flatPosition, td_quote_raw: state.td_quote_raw !==undefined? state.td_quote_raw:undefined}
    //console.log('PositionTab.mapStateToProps retValue', retValue);
    return retValue;
};

export default connect(mapStateToProps)(PositionTab);
