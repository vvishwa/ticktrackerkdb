\l /data/td/db/daily/all
show "List of partitioned tables"; show .Q.pt
show "For the below dates"; show reverse .Q.pv
show raze {select ticker:first symbol,high:max lastPrice,low:min lastPrice,maxSize:max lastSize from td_etf_stock where date=.z.D,symbol=x} each `TSLS`TSLA`TSLL`NVDA`AMD`SOXL`SOXS`IBIT
\\
