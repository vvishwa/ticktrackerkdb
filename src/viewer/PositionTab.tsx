import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import '../selector/TickPanel.css'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { ColDef, ColGroupDef, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { FlattenedPosition, Position } from '../dto/position';
import { store } from '../store/store';
import { connect as wsconnect, send } from '@giantmachines/redux-websocket';
import { v1 as uuidv1 } from 'uuid';
import { connect } from 'react-redux';

type PositionTabProps = {
    position:Position[],
    userPrincipals:any
}

type PositionTabState = {
    position:FlattenedPosition[]
}

class PositionTab extends Component<PositionTabProps, PositionTabState> {

    gridApi: GridApi | undefined ;
    gridOptions: GridOptions | undefined;
    
    constructor(props: PositionTabProps) {
        super(props);

        console.log('PositionTab.. ', props);

        const flatPosition:FlattenedPosition[] = props.position.map((v:any) => { return {averagePrice: v.averagePrice, longQuantity: v.longQuantity, 
                settledLongQuantity:v.settledLongQuantity, assetType: v.instrument.assetType, cusip: v.instrument.cusip, marketValue: v.marketValue, symbol:v.instrument.symbol}});
        this.state = {
            position : flatPosition
        }
    }

    componentDidUpdate(prevProps:PositionTabProps) {
        console.log('props received ', prevProps);
        if (prevProps.userPrincipals !== undefined) {
            //Converts ISO-8601 response in snapshot to ms since epoch accepted by Streamer
            let userPrincipalsResponse = prevProps.userPrincipals;
            var tokenTimeStampAsDateObj = new Date(userPrincipalsResponse.streamerInfo.tokenTimestamp);
            var tokenTimeStampAsMs = tokenTimeStampAsDateObj.getTime();

            var credentials = {
                "userid": userPrincipalsResponse.accounts[0].accountId,
                "token": userPrincipalsResponse.streamerInfo.token,
                "company": userPrincipalsResponse.accounts[0].company,
                "segment": userPrincipalsResponse.accounts[0].segment,
                "cddomain": userPrincipalsResponse.accounts[0].accountCdDomainId,
                "usergroup": userPrincipalsResponse.streamerInfo.userGroup,
                "accesslevel": userPrincipalsResponse.streamerInfo.accessLevel,
                "authorized": "Y",
                "timestamp": tokenTimeStampAsMs,
                "appid": userPrincipalsResponse.streamerInfo.appId,
                "acl": userPrincipalsResponse.streamerInfo.acl
            }

            var request = {
                "requests": [
                        {
                            "service": "ADMIN",
                            "command": "LOGIN",
                            "requestid": 0,
                            "account": userPrincipalsResponse.accounts[0].accountId,
                            "source": userPrincipalsResponse.streamerInfo.appId,
                            "parameters": {
                                "credential": jsonToQueryString(credentials),
                                "token": userPrincipalsResponse.streamerInfo.token,
                                "version": "1.0"
                            }
                        }
                ]
            }

            if (this.state.position !== undefined) {
                const websocketUrl = "wss://" + userPrincipalsResponse.streamerInfo.streamerSocketUrl + "/ws";
                //var mySock = new WebSocket(websocketUrl);
                store.dispatch(wsconnect(websocketUrl));
                store.dispatch(send(request));
            }
        
        }
    }

    componentDidMount() {
        store.dispatch(send({ id:uuidv1(), func:'.sod.getUserPrincipal', obj:0}));
    }

    render() {
        return (
            <div className="ag-theme-alpine" style={ {width: '95%', height:'75%' } } >
                <div className="ag-theme-alpine" style={ { height: 750, margin: '2%'} } >
                    <AgGridReact
                        rowData={this.state.position}
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
            { field:'assetType', headerName:'Asset'},
            { field:'cusip', headerName:'Cusip'},
            { field:'symbol', headerName:'Symbol'},
            { field:'averagePrice', headerName:'Avg Price'}, 
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

// Utility
function jsonToQueryString(json:any) {
    return Object.keys(json).map(function(key) {
            return encodeURIComponent(key) + '=' +
                encodeURIComponent(json[key]);
        }).join('&');
}

const mapStateToProps = (state:any) => {
    
    console.log('PositionTab.mapStateToProps ', state);
    let retValue = {userPrincipals: state.userPrincipals}
    
    return retValue;
};

export default connect(mapStateToProps)(PositionTab);
