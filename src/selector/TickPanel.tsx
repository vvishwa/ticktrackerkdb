import React, { useState } from 'react';
import ExpirationListPanel from './ExpirationListPanel';
import TickerListPanel from './TickerListPanel';

import './TickPanel.css'

type TickProps = {
    datedDates: any[];
    expirationDates: any[];
    canCorrect:boolean;
    changeD: ((event: React.ChangeEvent<HTMLSelectElement>) => void) | undefined;
    changeX: ((event: React.ChangeEvent<HTMLSelectElement>) => void) | undefined;
    fillIn: (conf: string) => void;
    tabChange: () => void;
};

const TickerPanel = (props: TickProps) => {

    const [param, setParam] = useState<{conf:string}>({ conf: ''});
    
    const canCorrect = !props.canCorrect;
    console.log('TickPanel. confEnabled? ', canCorrect);

    const [tabActive] = useState(props);
    tabActive.tabChange();

    const dateddates = props.datedDates.map(e => { return <option key={e} value={e}>{e}</option> });
    
    return (
        <div className="tickerPanel">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="tickerlist">
                    <label>Dated Dates</label>
                </div>
                <div className="tickerlist">
                    <select onChange={props.changeD}>
                        <option hidden value="2000-01-01">Feed Date</option>
                        {dateddates}
                    </select>
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="tickerlist">
                    <label>Tickers</label>
                </div>
                <TickerListPanel/>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="tickerlist">
                    <label>Expiration Dates</label>
                </div>
                <ExpirationListPanel />
                
            </div>
            <div style={{ display: 'flex', flexDirection: 'column'}}>
                <div className="tickerlist">
                    <label>Conf % :</label>
                    <input onChange={(v) => setParam({conf: v.target.value})} value={param.conf}/>
                </div>
                <div className="tickerlist">
                    <button disabled={canCorrect} onClick={() => { props.fillIn(param.conf)}}>Repeat</button>
                </div>
            </div>
        </div>        
    )
}

export default TickerPanel;

