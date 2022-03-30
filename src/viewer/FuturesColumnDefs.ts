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
    {field: 'description', headerName:'Description'},
    {field: 'netChange', headerName:'Net Chg'},
    {field: 'openInterest', headerName:'Open Int'}]

export const newsColDefs:(ColDef|ColGroupDef)[] = [
    {field: 'ticker', headerName:'Ticker',},
    {field: 'storyDateAndTime', headerName:'Date Time',},
    {field: 'headline', headerName:'Head line', wrapText:true, width:1024},
    {field: 'isHot', headerName:'Is Hot?', sortable:true},
    {field: 'countKW', headerName:'Hit Count', sortable:true},
    {field: 'storySource', headerName:'Source',}
]