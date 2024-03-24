import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import React, { useCallback, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
    ColDef,
    GridReadyEvent,
    ICellRendererParams,
    IDatasource,
} from 'ag-grid-community';

const IRTab = () => {
    //const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
    //const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);

    const [columnDefs, ] = useState<ColDef[]>([
        // this row shows the row index, doesn't use any data from the row
        {
            headerName: 'ID',
            maxWidth: 100,
            // it is important to have node.id here, so that when the id changes (which happens
            // when the row is loaded) then the cell is refreshed.
            valueGetter: 'node.id',
            cellRenderer: (props: ICellRendererParams) => {
                
                if (props?.value !== undefined ) {
                    return props?.value;
                } else {
                    return (
                        <img src="https://www.ag-grid.com/example-assets/loading.gif" alt={"test"}/>
                    );
                }
            },
        },
        { field: 'athlete', minWidth: 150 },
        { field: 'age' },
        { field: 'country', minWidth: 150 },
        { field: 'year' },
        { field: 'date', minWidth: 150 },
        { field: 'sport', minWidth: 150 },
        { field: 'gold' },
        { field: 'silver' },
        { field: 'bronze' },
        { field: 'total' },
    ]);
    const defaultColDef = useMemo<ColDef>(() => {
        return {
            flex: 1,
            resizable: true,
            minWidth: 100,
        };
    }, []);

    const onGridReady = useCallback((params: GridReadyEvent) => {
        fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
            .then((resp) => resp.json())
            .then((data) => {
                const dataSource: IDatasource = {
                    rowCount: undefined,
                    getRows: (params) => {
                        console.log(
                            'asking for ' + params.startRow + ' to ' + params.endRow
                        );
                        // At this point in your code, you would call the server.
                        // To make the demo look real, wait for 500ms before returning
                        setTimeout(function () {
                            // take a slice of the total rows
                            const rowsThisPage = data.slice(params.startRow, params.endRow);
                            // if on or after the last page, work out the last row.
                            let lastRow = -1;
                            if (data.length <= params.endRow) {
                                lastRow = data.length;
                            }
                            // call the success callback
                            params.successCallback(rowsThisPage, lastRow);
                        }, 400);
                    },
                };
                params.api.setDatasource(dataSource);
            });
    }, []);

    return (
        <div className="ag-theme-alpine" style={ {width: '95%' } } >
            <div className="ag-theme-alpine" style={ { height: 800, margin: '2%'} } >
                <AgGridReact
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    rowBuffer={0}
                    rowSelection={'multiple'}
                    rowModelType={'infinite'}
                    cacheBlockSize={100}
                    cacheOverflowSize={2}
                    maxConcurrentDatasourceRequests={1}
                    infiniteInitialRowCount={1000}
                    maxBlocksInCache={10}
                    onGridReady={onGridReady}
                ></AgGridReact>
            </div>
        </div>
    );
};

export default IRTab;