import React, { useEffect } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { AgChartsReact } from 'ag-charts-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

const OptionTab = (props) => {
    const optionTable = props.optionTable;
    
    useEffect(() => {
        //getOption();
    })

    const rowData =
        optionTable == null ? [] : optionTable.map(e => {
            return {
                Contract: e.Contract, InMoney: e.InMoney, TrdTime: e.TrdTime,
                Expiration: e.Expiration, Strike: e.Strike, LastPrice: e.LastPrice, Bid: e.Bid, Ask: e.Ask, Change: e.Change,
                ChgPerc: e.ChgPerc, Vol: e.Vol, OenInt: e.OenInt, IVOL: e.IVOL, Delta: e.Delta, Gamma: e.Gamma, Theta: e.Theta,
                Vega: e.Vega, Rho: e.Rho, Theoritical: e.Theoritical, Intrinsic: e.Intrinsic, timeValue: e.timeValue,
                updatedAt: e.updatedAt, DaysExpiration: e.DaysExpiration
            }
        })
    
    const chartData =
        optionTable == null ? [] : optionTable.map(e => {
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
        <div className="ag-theme-alpine" style={ { height: 300, width: '98%' } } >
            <AgGridReact
                rowData={rowData}>
                {/*<AgGridColumn field="Contract" filter={true} width='100'></AgGridColumn> */}
                <AgGridColumn field="InMoney" filter={true} width='80'></AgGridColumn>
                <AgGridColumn field="TrdTime" width='200'></AgGridColumn>
                <AgGridColumn field="Expiration" width='130'></AgGridColumn>
                <AgGridColumn field="Strike" filter='agNumberColumnFilter' width='100'></AgGridColumn>
                <AgGridColumn field="LastPrice"  width='100'></AgGridColumn>
                <AgGridColumn field="Bid"  width='100'></AgGridColumn>
                <AgGridColumn field="Ask"  width='100'></AgGridColumn>
                <AgGridColumn field="Change"  width='100'></AgGridColumn>
                <AgGridColumn field="ChgPerc"  width='100'></AgGridColumn>
                <AgGridColumn field="Vol"  width='100'></AgGridColumn>
                <AgGridColumn field="OenInt"  width='100'></AgGridColumn>
                <AgGridColumn field="IVOL"  width='100'></AgGridColumn>
                <AgGridColumn field="Delta"  width='100'></AgGridColumn>
                <AgGridColumn field="Gamma"  width='100'></AgGridColumn>
                <AgGridColumn field="Theta"  width='100'></AgGridColumn>
                <AgGridColumn field="Vega"  width='100'></AgGridColumn>
                <AgGridColumn field="Rho"  width='100'></AgGridColumn>
                <AgGridColumn field="Theoritical"  width='100'></AgGridColumn>
                <AgGridColumn field="Intrinsic"  width='50'></AgGridColumn>
                <AgGridColumn field="timeValue"  width='50'></AgGridColumn>
                <AgGridColumn field="updatedAt"></AgGridColumn>
                <AgGridColumn field="DaysExpiration" width='50'></AgGridColumn>
            </AgGridReact>

            <AgChartsReact options={options} />
        </div>
    );

};

export default OptionTab;