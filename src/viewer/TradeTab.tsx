import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import '../selector/TickPanel.css'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { ColDef, ColGroupDef, GridApi, GridOptions, GridReadyEvent, RowClassParams } from 'ag-grid-community';
//import { MenuModule } from '@ag-grid-enterprise/menu';
import { store } from '../store/store';
import { send } from '@giantmachines/redux-websocket';
import { v1 as uuidv1 } from 'uuid';

import { FlattenedTrade, Trade } from '../dto/trade';
import { tradeColDefs } from './TradeColumnDefs';
import { connect } from 'react-redux';

type TradeTabProps = {
    trade:Trade[],
    isDark:boolean
}

// set background colour on every row, this is probably bad, should be using CSS classes
const rowStyle = { background: 'cyan' };

// set background colour on even rows again, this looks bad, should be using CSS classes
const getRowStyle = (params:RowClassParams) => {
    if (params.node.rowIndex !==null && params.node.rowIndex % 2 === 0) {
        return { background: 'white' };
    }
};


class TradeTab extends Component<TradeTabProps> {

    gridApi: GridApi | undefined ;
    gridOptions: GridOptions | undefined;
    
    
    private flattendTrade(props: TradeTabProps): FlattenedTrade[] {
        return props.trade !== undefined && props.trade.length !== 0 ? props.trade.filter((v=>{return v.type==='TRADE'})).map((v) => {
            return {
                accountId: v.transactionItem.accountId, additionalFee: v.fees.additionalFee, amount: v.transactionItem.amount, assetType: v.transactionItem.instrument.assetType,
                cashBalanceEffectFlag: v.cashBalanceEffectFlag, cdscFee: v.fees.cdscFee, commission: v.fees.commission, cost: v.transactionItem.cost,
                cusip: v.transactionItem.instrument.cusip, description: v.description, instruction: v.transactionItem.instruction, netAmount: v.netAmount,
                optRegFee: v.fees.optRegFee, orderDate: v.orderDate, orderId: v.orderId, otherCharges: v.fees.otherCharges, price: v.transactionItem.price,
                rFee: v.fees.rFee, regFee: v.fees.regFee, secFee: v.fees.secFee, settlementDate: v.settlementDate, subAccount: v.subAccount,
                symbol: v.transactionItem.instrument.symbol, transactionDate: v.transactionDate, transactionId: v.transactionId, transactionSubType: v.transactionSubType, type: v.type
            };
        }) : [];
    }

    componentDidMount() {
        store.dispatch(send({ id:uuidv1(), func:'.sod.getTrades', obj:0}));
    }

    componentDidUpdate(prevProps:TradeTabProps) {
        console.log('props received ', prevProps);
    }

    render() {
        return (
            <div className="ag-theme-alpine" style={ {width: '95%' } } >
                <div className="ag-theme-alpine" style={ { height: 800, margin: '2%'} } >
                    <AgGridReact
                        //modules={this.state.modules}
                        rowStyle={rowStyle}
                        getRowStyle={getRowStyle}
                        rowData={this.flattendTrade(this.props)}
                        defaultColDef={this.createDefColDefs()}
                        columnDefs={this.createColunDefs()}
                        getRowNodeId={(n:FlattenedTrade) =>{return String(n.orderId)}}
                        
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
        return tradeColDefs;
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
    
    console.log('TradeTab.mapStateToProps ', state);
    //let retValue = {trade: []}
    if (state !== undefined) {
      if (state.trades !== undefined) {
        return {trade: state.trades}
      }
    }

    //return retValue;
};

export default connect(mapStateToProps)(TradeTab);