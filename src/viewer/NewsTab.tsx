import React, { useEffect, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import '../selector/TickPanel.css'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { ColDef } from 'ag-grid-community';

import { connect } from 'react-redux';
import { newsColDefs} from "./FuturesColumnDefs";
import {store} from "../store/store";
import {send} from "@giantmachines/redux-websocket";
import {v1 as uuidv1} from "uuid";

type NewsTabProps = {
    news:any[]
}

const NewsTab = (props:NewsTabProps) => {
    useEffect(()=> {
        store.dispatch(send({ id:uuidv1(), func:'getNews', obj:0}));
    }, []);

    const [news, setNews] = useState<any[]>([]);

    const columnDefs = newsColDefs;

    const defaultColDef = useMemo<ColDef>(() => {
        return {
            flex: 1,
            resizable: true,
            filter: true,
            sortable: true,
            menuTabs: ['generalMenuTab', 'filterMenuTab','columnsMenuTab'],
        };
    }, []);
    
    if (props.news.length > 0) {
       // setNews(props.news);        
    }

    return (   
        <div className="ag-theme-alpine" style={ {width: '95%' } } >
            <div className="ag-theme-alpine" style={ { height: 800, margin: '2%'} } >
                <AgGridReact
                    //modules={this.state.modules}
                    rowData={props.news}
                    defaultColDef={defaultColDef}
                    columnDefs={columnDefs}
                    getRowNodeId={(n:any) =>{return n.ticker}}>

                </AgGridReact>
            </div>
        </div>
    );
}

const mapStateToProps = (state:any) => {

    console.log('NewsTab.mapStateToProps ', state);
    let retValue = {news: []}
    if (state !== undefined && state.news !== undefined) {
        retValue = {news: state.news}
    }

    return retValue;
};

const mergeProps = (ownProps:any, mapProps:any) => {
    const { news } = ownProps
    console.log('NewsTab.ownProps ', ownProps, 'mapProps ', mapProps);
    return {
      news:news
    }
  }
  

export default connect(mapStateToProps, null, mergeProps)(NewsTab);