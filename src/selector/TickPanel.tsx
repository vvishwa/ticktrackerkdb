import React, { useState } from 'react';
import './TickPanel.css'

type TickProps = {
    datedDates: any[];
    tickerList: any[];
    expirationDates: any[];
    changeD: ((event: React.ChangeEvent<HTMLSelectElement>) => void) | undefined;
    clicked: ((event: React.ChangeEvent<HTMLSelectElement>) => void) | undefined;
    changeX: ((event: React.ChangeEvent<HTMLSelectElement>) => void) | undefined;
    fillIn: (conf: string) => void;
    tabChange: () => void;
};

const TickerPanel = (props: TickProps) => {

    const [param, setParam] = useState<{conf:string}>({ conf: ''});

    const [tabActive] = useState(props);
    tabActive.tabChange();

    const dateddates = props.datedDates.map(e => { return <option key={e} value={e}>{e}</option> });
    const tkrLabel = props.tickerList.map(e => { return <option key={e} value={e}>{e}</option> });
    const expLabel = props.expirationDates.map((e, i) => { return <option key={i} value={i}>{e}</option> });

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
                <div className="tickerlist">
                    <select onChange={props.clicked}>
                        <option hidden value="KKK.KKK">Tickers</option>
                        {tkrLabel}
                    </select>
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="tickerlist">
                    <label>Expiration Dates</label>
                </div>
                <div className="tickerlist">
                    <select onChange={props.changeX}>
                        <option hidden value="2000-01-01">Call Expiring</option>
                        {expLabel}
                    </select>
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column'}}>
                <div className="tickerlist">
                    <label>Conf % :</label>
                    <input onChange={(v) => setParam({conf: v.target.value})} value={param.conf}/>
                </div>
                <div className="tickerlist">
                    <button onClick={() => { props.fillIn(param.conf)}}>Repeat</button>
                </div>
            </div>
        </div>
    )
}

export default TickerPanel;