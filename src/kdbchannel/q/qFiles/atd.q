default:.Q.def[`ticker1`rootdir1!enlist [enlist "AAL,VISL"; enlist "/home/vijay/td/db"]] .Q.opt .z.x
dbdir0:default`rootdir1
dbdir:dbdir0[0]
show default

symbol:first default[`ticker1]
consumer_key:"NHDTVYJXAMKKRRG4K4HS4SWSBQVUXRX1"
/curl -X GET --header "Authorization: " "https://api.tdameritrade.com/v1/marketdata/quotes?apikey=NHDTVYJXAMKKRRG4K4HS4SWSBQVUXRX1&symbol=VISL"

url:"https://api.tdameritrade.com/v1/marketdata/quotes?apikey=",consumer_key,"&symbol=",symbol
dataraw:.Q.hg url
datajson:.j.k dataraw

tall:enlist datajson
ltd:{x: "." vs x; x[0],"-",x[1],"-",x[2]} string .z.d

{tab:tall[`$x]; path:`$":",dbdir,"/eod/",x,"/", ltd,"/"; path set tab} each "," vs symbol

saveQuotes:{tab:tall[`$x]; path:`$":",dbdir,"/eod/",x,"/", ltd,"/"; path upsert .Q.en[`:/home/vijay/td/db/refd;] tab}

saveAllQuotes:{saveQuotes each "," vs symbol}

loadQuotes:{path:`$":",dbdir,"/eod/",x,"/", ltd,"/"; tab:get path; count tab}

loadAllQuotes:{loadQuotes each "," vs symbol}

tradesraw:raze read0 `$"/home/vijay/td/transaction.json"
trades:.j.k tradesraw
positionsraw:.j.k raze read0 `$"/home/vijay/td/position.json"
positions:select averagePrice,longQuantity,settledLongQuantity, instrument,marketValue from positionsraw[`securitiesAccount;`positions]

.z.ts:saveAllQuotes
/exit 0
