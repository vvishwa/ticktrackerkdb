system "P 12"
default:.Q.def[`ticker`rootdir!enlist [enlist "AAL,VISL"; enlist "/home/vijay/td/db"]] .Q.opt .z.x
dbdir0:default`rootdir
dbdir:dbdir0[0]
show default

tickers:flip `syms`tkrs!"**"$\:()

getSymbolStr:{ts:flip select tkrs from tickers;"," sv string distinct ts[`tkrs]}

symbol:first default[`ticker]
consumer_key:"NHDTVYJXAMKKRRG4K4HS4SWSBQVUXRX1"
/curl -X GET --header "Authorization: " "https://api.tdameritrade.com/v1/marketdata/quotes?apikey=NHDTVYJXAMKKRRG4K4HS4SWSBQVUXRX1&symbol=VISL"

base_url:"https://api.tdameritrade.com/v1/marketdata/quotes?apikey="
url:base_url,consumer_key,"&symbol=",symbol

ltd:{x: "." vs x; x[0],"-",x[1],"-",x[2]} string .z.d

savePath:{tab:(enlist .j.k .Q.hg url)[`$x]; path:`$":",dbdir,"/eod/",x,"/", ltd,"/"; path set tab}

saveAllPaths:{savePath each "," vs symbol}

saveQuotes:{tab:(enlist .j.k .Q.hg url)[`$x]; path:`$":",dbdir,"/eod/",x,"/", ltd,"/"; path upsert .Q.en[`:/home/vijay/td/db/refd;] tab}

saveAllQuotes:{saveQuotes each "," vs symbol}

loadQuotes:{path:`$":",dbdir,"/eod/",x,"/", ltd,"/"; tab:get path; count tab}

loadAllQuotes:{loadQuotes each "," vs symbol}

/tradesraw:raze read0 `$"/home/vijay/td/transaction.json"
trades:.j.k raze read0 `$"/home/vijay/td/transaction.json"
positionsraw:.j.k raze read0 `$"/home/vijay/td/position.json"
positions:select averagePrice,longQuantity,settledLongQuantity,instrument,marketValue from positionsraw[`securitiesAccount;`positions]

h:neg hopen `:localhost:5001; /* connect to rdb */
h2:hopen `:localhost:5001; /* connect to rdb */
.sod.pt:h2(`.sod.position_tkrs)

feedQuotes:{dataraw:.Q.hg url;datajson:.j.k dataraw;tall:enlist datajson;h(`upd;`quote;select `$assetType,`$assetMainType,`$cusip,`$symbol,`$description,`float$bidPrice,`float$bidSize,`$bidId,`float$askPrice,`float$askSize,`$askId,`float$lastPrice,`float$lastSize,`$lastId,`float$openPrice,`float$highPrice,`float$lowPrice,`$bidTick,`float$closePrice,`float$netChange,`float$totalVolume,`int$quoteTimeInLong,`int$tradeTimeInLong,`float$mark,`$exchange,`$exchangeName,`boolean$marginable,`boolean$shortable,`float$volatility,`int$digits,`int$nAV,`float$peRatio,`float$divAmount,`float$divYield,`$divDate,`$securityStatus,`float$regularMarketLastPrice,`int$regularMarketLastSize,`int$regularMarketNetChange,`int$regularMarketTradeTimeInLong,`float$netPercentChangeInDouble,`float$markChangeInDouble,`float$markPercentChangeInDouble,`float$regularMarketPercentChangeInDouble,`boolean$delayed from tall[x])};

/.z.ts:{saveAllQuotes[];{feedQuotes[`$x]} each "," vs symbol}
/.z.ts:{{feedQuotes[`$x]} each "," vs symbol}
.z.ts:{symbolstr:getSymbolStr[];`url set base_url,consumer_key,"&symbol=",symbolstr;{feedQuotes[`$x]} each "," vs symbolstr}
/exit 0

extractQuotes:{symbolstr:getSymbolStr[];url:base_url,consumer_key,"&symbol=",symbolstr;dataraw:.Q.hg url;datajson:.j.k dataraw;tall:enlist datajson;select `$assetType,`$assetMainType,`$cusip,`$symbol,`$description,`float$bidPrice,`float$bidSize,`$bidId,`float$askPrice,`float$askSize,`$askId,`float$lastPrice,`float$lastSize,`$lastId,`float$openPrice,`float$highPrice,`float$lowPrice,`$bidTick,`float$closePrice,`float$netChange,`float$totalVolume,`int$quoteTimeInLong,`int$tradeTimeInLong,`float$mark,`$exchange,`$exchangeName,`boolean$marginable,`boolean$shortable,`float$volatility,`int$digits,`int$nAV,`float$peRatio,`float$divAmount,`float$divYield,`$divDate,`$securityStatus,`float$regularMarketLastPrice,`int$regularMarketLastSize,`int$regularMarketNetChange,`int$regularMarketTradeTimeInLong,`float$netPercentChangeInDouble,`float$markChangeInDouble,`float$markPercentChangeInDouble,`float$regularMarketPercentChangeInDouble,`boolean$delayed from tall[x]};

system "P 13";
system "c 25 4096";
h1:hopen `:localhost:5001;
upr:h1(`.sod.getUserPrincipal,0);

buildCred:{[upr] userid:upr[`accounts][0][`accountId];token:upr[`streamerInfo][`token];company:upr[`accounts][0][`company];segment:upr[`accounts][0][`segment];cddomain:upr[`accounts][0][`accountCdDomainId];usergroup:upr[`streamerInfo][`userGroup];accesslevel:upr[`streamerInfo][`accessLevel];authorized:"Y";timestamp:(((`long$`timestamp$"Z"$upr[`streamerInfo][`tokenTimestamp]) - (`long$1970.01.01D00:00.000000000)) % 1000000);appid:upr[`streamerInfo][`appId];acl:upr[`streamerInfo][`acl];`userid`token`company`segment`cddomain`usergroup`accesslevel`authorized`timestamp`appid!(userid;token;company;segment;cddomain;usergroup;accesslevel;authorized;string[timestamp];appid)};

buildCredUri:{[upr] userid:upr[`accounts][0][`accountId];token:upr[`streamerInfo][`token];company:upr[`accounts][0][`company];segment:upr[`accounts][0][`segment];cddomain:upr[`accounts][0][`accountCdDomainId];usergroup:upr[`streamerInfo][`userGroup];accesslevel:upr[`streamerInfo][`accessLevel];authorized:"Y";timestamp:(((`long$`timestamp$"Z"$upr[`streamerInfo][`tokenTimestamp]) - (`long$1970.01.01D00:00.000000000)) % 1000000);appid:upr[`streamerInfo][`appId];acl:upr[`streamerInfo][`acl]; "userid=",.h.hu[userid],"&token=",.h.hu[token],"&company=",.h.hu[company],"&segment=",.h.hu[segment],"&cddomain=",.h.hu[cddomain],"&usergroup=",.h.hu[usergroup],"&accesslevel=",.h.hu[accesslevel],"&authorized=",.h.hu[authorized],"&timestamp=",string[timestamp],"&appid=",.h.hu[appid],"&acl=",.h.hu[acl]};

pms:`credential`token`version!(buildCredUri[upr];upr[`streamerInfo][`token];"1.0");
req:`service`command`requestid`account`source`parameters!("ADMIN";"LOGIN";0;upr[`accounts][0][`accountId];upr[`streamerInfo][`appId];pms);
reqs:(enlist `requests)!(enlist enlist req);

.sod.ptmod:{("," sv string (distinct 4#.sod.pt))}

.sod.ptseq:1;
pms_q:{`keys`fields!(`$.sod.ptmod[];`$ "0,1,2,3,4,5,6,7,8")};
req_q:{`service`command`requestid`account`source`parameters!("QUOTE";"SUBS";.sod.ptseq;upr[`accounts][0][`accountId];upr[`streamerInfo][`appId];pms_q[])};
reqs_q:{(enlist `requests)!(enlist enlist req_q[])};

wsurl:"wss://",upr[`streamerInfo][`streamerSocketUrl],"/ws";
\l ws-client_0.2.1.q
.ws.VERBOSE:1b;
.getTdTable:{t:flip(`a`b!(`1`1;`2`2));if[12=count key flip raze (raze x)`content;t:(raze (raze raze x)`content`key)];t1:`ticker`delayed`assetMaintype`cusip`bidPrice`askPrice`lastPrice`bidSize`askSize`askId`bidId`totalVol xcol t;t2:select `$ticker, delayed, `$assetMaintype, `$cusip, bidPrice, askPrice, lastPrice, bidSize, askSize, raze askId, raze bidId, totalVol from t1;t2}

.echo.upd:{[x] show x;if[(enlist `data)~(key .j.k x); h(`upd;`td_quote_rt; .getTdTable[.j.k x])];if[(enlist `notify)~(key .j.k x);if[not (0=count .sod.pt);((show "notified";);.sod.pt: 4_.sod.pt;.sod.ptseq:.sod.ptseq+1;show .sod.pt;system "sleep 5";.echo.h .streamQuote;.streamQuote:.j.j reqs_q[]);show "Already subscribed"];];};
.echo.h:.ws.open[wsurl;`.echo.upd];
.streamLogin:.j.j reqs;
.echo.h .streamLogin;
/.streamQuote:.j.j reqs_q;
