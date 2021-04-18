import React, { useEffect, useState } from 'react';
import { AgGridReact } from '@ag-grid-community/react';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { RangeSelectionModule } from '@ag-grid-enterprise/range-selection';
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-alpine.css';

import { AgChartsReact } from 'ag-charts-react';
import { CellRange, GridApi, RangeSelectionChangedEvent } from 'ag-grid-community';
import { connect } from 'react-redux';


const OptionTab = (props: { optionTable: any, fillValue: any, tabChange: Function, enableCorrection:Function}) => {
    const optionTable = props.optionTable;
    const fillValue = props.fillValue;
    const enableCorrection = props.enableCorrection;

    const [gridApi, setGridApi] = useState<{gridApi:null|GridApi}>({ gridApi: null});

    console.log('OptionTab: fillValue ', fillValue);

    if (gridApi.gridApi !== null && fillValue !== 0) {
        const cells:CellRange[] = gridApi.gridApi.getCellRanges();
                
        if (cells.length > 0) {
            const startRowIndex:number = cells[0].startRow?.rowIndex === undefined? 0: cells[0].startRow?.rowIndex;
            const endRowIndex:number = cells[0].endRow?.rowIndex === undefined? 0:cells[0].endRow?.rowIndex;
            const columnDef = cells[0].columns[0].getColDef();
            const isEditable = columnDef.editable;
            
            //console.log('Cells selected with startRowIndex ', startRowIndex, ', endRowIndex ', endRowIndex, ', isEdtable ', isEditable, ', field ', field);
            if (startRowIndex !== null && endRowIndex !== null && startRowIndex !== endRowIndex) {
                for(let indx=startRowIndex; indx <= endRowIndex; indx++) {
                    if (isEditable) {
                        gridApi.gridApi?.getDisplayedRowAtIndex(indx).setDataValue(cells[0].columns[0], fillValue);
                    }
                }
            gridApi.gridApi.clearRangeSelection(); 
            enableCorrection(false);
            }
        }
    }

    const [tabActive] = useState(props);
    tabActive.tabChange();

    if (gridApi.gridApi !== null) {
        gridApi.gridApi.addEventListener('rangeSelectionChanged', (event: RangeSelectionChangedEvent) => {
            if (event.finished) {
                
                const cells:CellRange[] = event.api.getCellRanges();
                
                if (cells.length > 0) {
                    const startRowIndex:number = cells[0].startRow?.rowIndex === undefined? 0: cells[0].startRow?.rowIndex;
                    const endRowIndex:number = cells[0].endRow?.rowIndex === undefined? 0:cells[0].endRow?.rowIndex;
                    const columnDef = cells[0].columns[0].getColDef();
                    const isEditable = columnDef.editable;
                    
                    //console.log('Cells selected with startRowIndex ', startRowIndex, ', endRowIndex ', endRowIndex, ', isEdtable ', isEditable, ', field ', field);
                    if (startRowIndex !== null && endRowIndex !== null && startRowIndex !== endRowIndex) {
                        for(let indx=startRowIndex; indx <= endRowIndex; indx++) {
                            if (isEditable) enableCorrection(true);
                        }
                    } else {
                        enableCorrection(false);
                    }
                }
            }
        });
        
    }   

    useEffect(() => {
        //getOption();
    })

    type OptionType = {
        Contract: any;
        InMoney: any;
        TrdTime: any;
        Expiration: any;
        Strike: any;
        LastPrice: any;
        Bid: any;
        Ask: any;
        Change: any;
        ChgPerc: any;
        Vol: any;
        OenInt: any;
        IVOL: any;
        Delta: any;
        Gamma: any;
        Theta: any;
        Vega: any;
        Rho: any;
        Theoritical: any;
        Intrinsic: any;
        timeValue: any;
        updatedAt: any;
        DaysExpiration: any;
    };

    const rowData =
        optionTable == null ? [] : optionTable.map((e: OptionType) => {
            return {
                Contract: e.Contract, InMoney: e.InMoney, TrdTime: e.TrdTime,
                Expiration: e.Expiration, Strike: e.Strike, LastPrice: e.LastPrice, Bid: e.Bid, Ask: e.Ask, Change: e.Change,
                ChgPerc: e.ChgPerc, Vol: e.Vol, OenInt: e.OenInt, IVOL: e.IVOL, Delta: e.Delta, Gamma: e.Gamma, Theta: e.Theta,
                Vega: e.Vega, Rho: e.Rho, Theoritical: e.Theoritical, Intrinsic: e.Intrinsic, timeValue: e.timeValue,
                updatedAt: e.updatedAt, DaysExpiration: e.DaysExpiration
            }
        })
    
    const onGridReady = (params: { api: any; }) => {
        setGridApi({gridApi: params.api});
        const gridOption = params.api.option;
        console.log('..gridoption.. ', gridOption)        
    };

    const columnDefs = 
            [
            { field:"InMoney", filter:true, width:80},
            { field:"ConfPerc", width:100, editable:true},
            { field:"TrdTime", width:200},
            { field:"Expiration", width:130},
            { field:"Strike", filter:'agNumberColumnFilter', width:100},
            { field:"LastPrice",  width:100},
            { field:"Bid",  width:100},
            { field:"Ask",  width:100},
            { field:"Change",  width:100},
            { field:"ChgPerc",  width:100},
            { field:"Vol",  width:100},
            { field:"OenInt",  width:100},
            { field:"IVOL",  width:100},
            { field:"Delta",  width:100},
            { field:"Gamma",  width:100},
            { field:"Theta",  width:100},
            { field:"Vega",  width:100},
            { field:"Rho",  width:100},
            { field:"Theoritical",  width:100},
            { field:"Intrinsic",  width:50},
            { field:"timeValue",  width:50},
            { field:"updatedAt"},
            { field:"DaysExpiration", width:50},
        ]
        

    const gridOptions = {
        pagination: true,
        rowSelection: 'single',
        enableRangeSelection: true,
        singleClickEdit: true,
        getRowStyle : (params:any) => {
            if (params.data.InMoney === 'TRUE') {
                return { background: 'cyan' };
            }
        }
    }

    const modules= [ClientSideRowModelModule, RangeSelectionModule]
    const chartData =
        optionTable == null ? [] : optionTable.map((e: { Strike: string; IVOL: any; }) => {
            return {
                Strike: e.Strike+'', IVOL: e.IVOL
            }
        })

    //console.log('OptionTab.optionTable.rowData = ' + JSON.stringify(chartData));

    const options = {
            data: chartData,
            series: [{
                xKey: 'Strike',
                yKey: 'IVOL',
                yName: 'Implied Volatility'
            }],
            legend: {
                position: 'bottom'
            }
        };
    
    return (
        <div className="ag-theme-alpine" style={ { height: 800, width: '98%' } } >
            <div style={{ height: '60%'}}>
                <AgGridReact
                    modules={modules}
                    
                    columnDefs={columnDefs}
                    rowData={rowData}
                    onGridReady={onGridReady}
                    gridOptions={gridOptions}
                    
                    >
                    {/*{ field:"Contract" filter={true} width:100}, */}
                    
                </AgGridReact>
            </div>

            <div style={{ height: '40%'}}>
                <AgChartsReact options={options} />
            </div>
        </div>
    );

};


const mapStateToProps = (state:any) => {
    console.log('OptionTab.mapStateToProps ', state);
    if (state !== undefined && state.options !== undefined) {
        return  {optionTable: state.options};
    } else {
        return  {optionTable: []};
    }
};


// connect our component to the redux store
export default connect(
    mapStateToProps,
    null,
    null,
    { forwardRef: true } // must be supplied for react/redux when using AgGridReact
)(OptionTab);

