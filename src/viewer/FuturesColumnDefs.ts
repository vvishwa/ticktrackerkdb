import { ColDef, ColGroupDef } from "ag-grid-community";

export const futurColDefs:(ColDef|ColGroupDef)[] = [
    {field: 'ticker', headerName:'Ticker', singleClickEdit:true, editable: true},
    {field: 'bidPrice', headerName:'Bid Price'},
    {field: 'askPrice', headerName:'Ask Price'},
    {field: 'lastPrice', headerName:'Last Price'},
    {field: 'bidSize', headerName:'Bid Size'},
    {field: 'askSize', headerName:'Ask Size'},
    {field: 'totalVol', headerName:'Tot Vol'},
    {field: 'lastSize', headerName:'Last Size'},
    {field: 'quoteTime', headerName:'Quote Time'},
    {field: 'description', headerName:'Descrption'},
    {field: 'netChange', headerName:'Net Chg'},
    {field: 'openInterest', headerName:'Open Int'}]