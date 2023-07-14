default:.Q.def[`ticker`rootdir!enlist [enlist "TSLA,TSLL"; enlist "/data/td/db"]] .Q.opt .z.x
dbdir0:default`rootdir
dbdir:dbdir0[0]
show default

consumer_key:"NHDTVYJXAMKKRRG4K4HS4SWSBQVUXRX1"
symbolstr:default[`ticker][0] /"TSLA,TSLL"
show symbolstr
base_url:"https://api.tdameritrade.com/v1/marketdata/quotes?apikey="
`url set base_url,consumer_key,"&symbol=",symbolstr
dataraw:.Q.hg url
datajson:.j.k dataraw;tall:enlist datajson;

\t 10000
\p 5053

path:`$":",dbdir,"/daily/stocks/"
tab: (flip `assetType`assetMainType`assetSubType`cusip`symbol`description`bidPrice`bidSize`bidId`askPrice`askSize`askId`lastPrice`lastSize`lastId`openPrice`highPrice`lowPrice`bidTick`closePrice`netChange`totalVolume`quoteTime`tradeTime`mark`exchange`exchangeName`marginable`shortable`volatility`digits`nAV`peRatio`divAmount`divYield`divDate`securityStatus`regularMarketLastPrice`regularMarketLastSize`regularMarketNetChange`tradeDate`regularMarketTradeTime`netPercentChangeInDouble`markChangeInDouble`markPercentChangeInDouble`regularMarketPercentChangeInDouble`delayed!())

show tab

collectQuotes:{dataraw:.Q.hg url;datajson:.j.k dataraw;tall:enlist datajson;
 `tab insert select `$assetType,`$assetMainType,`$assetSubType,`$cusip,`$symbol,`$description,`float$bidPrice,
 `float$bidSize,`$bidId,`float$askPrice,`float$askSize,`$askId,`float$lastPrice,`float$lastSize,`$lastId,`float$openPrice,
 `float$highPrice,`float$lowPrice,`$bidTick,`float$closePrice,`float$netChange,`float$totalVolume,
 quoteTime:1970.01.01+0D00:00:00.001*(`long$quoteTimeInLong),tradeTime:1970.01.01+0D00:00:00.001*(`long$tradeTimeInLong),
 `float$mark,`$exchange,`$exchangeName,`boolean$marginable,`boolean$shortable,`float$volatility,
 `int$digits,`int$nAV,`float$peRatio,`float$divAmount,`float$divYield,`$divDate,`$securityStatus,`float$regularMarketLastPrice,
 `int$regularMarketLastSize,`int$regularMarketNetChange,
 tradeDate:`date$1970.01.01+0D00:00:00.001*(`long$regularMarketTradeTimeInLong),
 regularMarketTradeTime:1970.01.01+0D00:00:00.001*(`long$regularMarketTradeTimeInLong),
 `float$netPercentChangeInDouble, `float$markChangeInDouble,`float$markPercentChangeInDouble,
 `float$regularMarketPercentChangeInDouble, `boolean$delayed
 from tall[`$x]}

collectAllQuotes:{collectQuotes[x]} each "," vs symbolstr

.z.ts:{$[.z.T < 20:00:00.000;{collectQuotes[x]} each "," vs symbolstr; (exit 0; .Q.dpft[path;.z.D;`symbol;`tab])]; show count tab}

show tab
\t 10000
/create splayed table into path

/path upsert .Q.en[`:/data/td/db/refd;] tab

/load path, it only maps splayed table into memory
/t:load path
/ts:tab[0][`tradeTime]
/show `date$ts
/show 1970.01.01+0D00:00:00.001*(`long$ts)

/.Q.dpft[path;.z.d;`symbol;`tab]