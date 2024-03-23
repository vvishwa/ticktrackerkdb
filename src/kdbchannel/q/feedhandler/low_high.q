/ default:.Q.def[`ticker`rootdir!enlist [enlist "TSLA,TSLL"; enlist "/data/td/db"]] .Q.opt .z.x
/ dbdir0:default`rootdir
/ dbdir:dbdir0[0]
/ show default


default:.Q.def[`days`tickers!enlist [enlist 0;enlist "TSLA,TSLL"]] .Q.opt .z.x
days:default[`days][0]
tickerstr:enlist default[`tickers]
tickers:`$ "," vs tickerstr[0][0]
show default
show tickers

\l /data/td/db/daily/all
show "List of partitioned tables"; show .Q.pt
show "For the below dates"; show reverse .Q.pv
/show raze {select ticker:first symbol,high:max lastPrice,low:min lastPrice,maxSize:max lastSize from td_etf_stock where date=.z.D-days,symbol=x} each `TSLS`TSLA`TSLL`NVDA`AMD`SOXL`SOXS`IBIT
show raze {select ticker:first symbol,high:max lastPrice,low:min lastPrice,maxSize:max lastSize from td_etf_stock where date=.z.D-days,symbol=x} each tickers
\\
