\l /data/td/db/daily/all
show raze {select ticker:first symbol,high:max lastPrice,low:min lastPrice,maxSize:max lastSize from td_etf_stock where date=.z.D-2,symbol=x} each `TSLS`TSLA`TSLL`NVDA`AMD`SOXL`SOXS
