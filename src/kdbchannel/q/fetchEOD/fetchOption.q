default:.Q.def[`ticker`rootdir!enlist [enlist "AAPL.US"; enlist "/home/vijay/db"]] .Q.opt .z.x
dbdir0:default`rootdir
dbdir:dbdir0[0]
show default

symbol:first default[`ticker]
eodapikey:"OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX"
url:"https://eodhistoricaldata.com/api/options/",symbol, "?api_token=",eodapikey,"&fmt=json"
dataraw:.Q.hg url
datajson:.j.k dataraw
ltd:datajson[`lastTradeDate]
optiondata:select options from datajson`data
lot:enlist select code, exchange, lastTradeDate, lastTradePrice from datajson
lotdir0:`$enlist ":",dbdir,"/refdata/lastoptiontrade/"
lotdir:lotdir0[0]
show lotdir
/`:/home/vijay/db/refdata/lastoptiontrade/ upsert .Q.en[`:/home/vijay/db/refdata;] lot
lotdir upsert .Q.en[`:/home/vijay/db/refdata;] lot
path:`$":",dbdir,"/options/",symbol,"/",ltd,"/"
path set optiondata
todate:{x: "." vs x; x[0],"-",x[1],"-",x[2]} string .z.d
fromdate:{x: "." vs x; x[0],"-",x[1],"-",x[2]} string .z.d - 10
url:"https://eodhistoricaldata.com/api/eod/",symbol,"?from=",fromdate,"&to=",todate,"&api_token=",eodapikey,"&fmt=json"
dataraw:.Q.hg url
datajson:.j.k dataraw
eoddata:select from datajson
path:`$":",dbdir,"/eod/",symbol,"/", ltd,"/"
path set eoddata
exit 0
