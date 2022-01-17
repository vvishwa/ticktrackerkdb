import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import '../selector/TickPanel.css'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { ColDef, ColGroupDef, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { InitialBalance, CurrentBalance, ProjectedBalances } from '../dto/PositionAndBalance';
import {connect} from "react-redux";

type BalanceTabProps = {
    initialBalances:InitialBalance,
    currentBalances:CurrentBalance,
    projectedBalances:ProjectedBalances
}

class BalanceTab extends Component<BalanceTabProps> {

    gridApi: GridApi | undefined ;
    gridOptions: GridOptions | undefined;
    
    constructor(props: BalanceTabProps) {
        super(props);

        console.log('BalanceTab.props ', props);
    }

    componentDidUpdate(prevProps:BalanceTabProps) {
        console.log('props received ', prevProps);
    }

    render() {
        console.log('render() BalanceTab.props ', this.props);

        const balance = []
        if (this.props.initialBalances !== undefined && this.props.initialBalances !== undefined) {
            balance.push({...this.props.currentBalances, balanceType:'Current'});
            balance.push({...this.props.initialBalances, balanceType:'Initial'});
        }

        return (
            <div className="ag-theme-alpine" style={ {width: '95%', height:'100%' } } >
                <div className="ag-theme-alpine" style={ { height: 140, margin: '2%'} } >
                    <AgGridReact
                        rowData={balance}
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

const mapStateToProps = (state:any) => {
    if(state.securitiesAccount !== undefined) {
        let retValue = {initialBalances: state.securitiesAccount !== undefined? state.securitiesAccount.initialBalances:undefined,
            currentBalances: state.securitiesAccount !== undefined? state.securitiesAccount.currentBalances:undefined,
            projectedBalances: state.securitiesAccount !== undefined? state.securitiesAccount.projectedBalances:undefined}
        console.log('BalanceTab.mapStateToProps retValue', retValue);
        return retValue;
    }
};

export default connect(mapStateToProps)(BalanceTab);
