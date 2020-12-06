import React from 'react';
import './TickPanel.css'

const TickerPanel = (props) => {
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
        </div>
    )
}

export default TickerPanel;