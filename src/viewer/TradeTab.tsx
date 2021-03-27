import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import '../selector/TickPanel.css'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { ColDef, ColGroupDef, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { FlattenedTrade, Trade } from '../dto/trade';
import { tradeColDefs } from './TradeColumnDefs';

type TradeTabProps = {
    trade:Trade[]
}

type TradeTabState = {
    trade:FlattenedTrade[]
}

class TradeTab extends Component<TradeTabProps, TradeTabState> {

    gridApi: GridApi | undefined ;
    gridOptions: GridOptions | undefined;
    
    constructor(props: TradeTabProps) {
        super(props);

        console.log('TradeTab.props ', props)

        const flatTrade:FlattenedTrade[] = props.trade.length !==0? props.trade.map((v) => { return {
            accountId: v.transactionItem.accountId, additionalFee: v.fees.additionalFee, amount: v.transactionItem.amount, assetType: v.transactionItem.instrument.assetType,
            cashBalanceEffectFlag: v.cashBalanceEffectFlag, cdscFee: v.fees.cdscFee, commission: v.fees.commission, cost: v.transactionItem.cost, 
            cusip: v.transactionItem.instrument.cusip, description: v.description, instruction: v.transactionItem.instruction, netAmount: v.netAmount,
            optRegFee: v.fees.optRegFee, orderDate: v.orderDate, orderId: v.orderId, otherCharges: v.fees.otherCharges, price: v.transactionItem.price,
            rFee: v.fees.rFee, regFee: v.fees.regFee, secFee: v.fees.secFee, settlementDate: v.settlementDate, subAccount: v.subAccount, 
            symbol: v.transactionItem.instrument.symbol, transactionDate: v.transactionDate, transactionId: v.transactionId, transactionSubType: v.transactionSubType, type: v.type
        }}):[];
        this.state = {
            trade : flatTrade
        }
    }
    componentDidUpdate(prevProps:TradeTabProps) {
        console.log('props received ', prevProps);
    }

    render() {
        return (
            <div className="ag-theme-alpine" style={ {width: '95%' } } >
                <div className="ag-theme-alpine" style={ { height: 800, margin: '2%'} } >
                    <AgGridReact
                        rowData={this.state.trade}
                        defaultColDef={this.createDefColDefs()}
                        columnDefs={this.createColunDefs()}
                        getRowNodeId={(n:FlattenedTrade) =>{return n.symbol}}
                        
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
            autoHeight: true,
            resizable: true,
        }
    }

    onGridReady = (params: GridReadyEvent) => {
        this.gridApi = params.api;

        params.columnApi.autoSizeAllColumns();
    }
    
};

export default TradeTab;