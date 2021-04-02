import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import '../selector/TickPanel.css'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { ColDef, ColGroupDef, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { InitialBalance, CurrentBalance, ProjectedBalances } from '../dto/PositionAndBalance';

type BalanceTabProps = {
    initialBalances:InitialBalance,
    currentBalances:CurrentBalance,
    projectedBalances:ProjectedBalances
}

type BalanceTabState = {
    balance:any[2]
}

class BalanceTab extends Component<BalanceTabProps, BalanceTabState> {

    gridApi: GridApi | undefined ;
    gridOptions: GridOptions | undefined;
    
    constructor(props: BalanceTabProps) {
        super(props);

        console.log('BalanceTab.props ', props);

        this.state = {
            balance: [2]
        }
        this.state.balance[0] = props.currentBalances;
        this.state.balance[0]['balanceType'] = 'Current';
        this.state.balance[1] = props.initialBalances;
        this.state.balance[1]['balanceType'] = 'Initial';
    }
    componentDidUpdate(prevProps:BalanceTabProps) {
        console.log('props received ', prevProps);
    }

    render() {
        return (
            <div className="ag-theme-alpine" style={ {width: '95%', height:'100%' } } >
                <div className="ag-theme-alpine" style={ { height: 140, margin: '2%'} } >
                    <AgGridReact
                        rowData={this.state.balance}
                        defaultColDef={this.createDefColDefs()}
                        columnDefs={this.createColunDefs()}
                        getRowNodeId={(n:any) =>{return n.balanceType}}
                        
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
            { field:'balanceType', headerName:'Bal Type'},
            { field:'accountValue', headerName:'Account Value'},
            { field:'moneyMarketFund', headerName:'Money Mkt Fund'},
            { field:'cashAvailableForTrading', headerName:'Cash for Trading'},
            { field:'cashAvailableForWithdrawal', headerName:'Cash for Withdrawl'},
            { field:'cashBalance', headerName:'Cash Balance'},
            { field:'totalCash', headerName:'Total Cash'},

            { field:'accruedInterest', headerName:'Accrued Interest'},
            { field:'bondValue', headerName:'Bond Value'},
            { field:'cashCall', headerName:'Cash Call'},
            { field:'cashDebitCallValue', headerName:'Cash Debit Call Value'},
            { field:'cashReceipts', headerName:'Cash Receipt'},
            { field:'liquidationValue', headerName:'Liquidation Value'},
            { field:'longMarketValue', headerName:'Long Mkt Value'},
            { field:'longNonMarginableMarketValue', headerName:'Long Marginable Market Value'},
            { field:'longOptionMarketValue', headerName:'Long Option Mkt Value'},
            
            { field:'mutualFundValue', headerName:'Mutual Fund Value'},
            { field:'pendingDeposits', headerName:'Pending Deposit'},
            { field:'savings', headerName:'Savings'},
            { field:'shortMarketValue', headerName:'Short Mkt Value'},
            { field:'shortOptionMarketValue', headerName:'Short Option Mkt Value'},
            
            { field:'unsettledCash', headerName:'Unsettled Cash'}
        ]
    }

    createDefColDefs(): (ColDef|ColGroupDef) {
        return {
            resizable: true,
            cellRenderer: 'agAnimateSlideCellRenderer'
        }
    }

    onGridReady = (params: GridReadyEvent) => {
        this.gridApi = params.api;

        params.columnApi.autoSizeAllColumns();
    }
    
};

export default BalanceTab;