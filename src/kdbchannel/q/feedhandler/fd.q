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
.sod.pt:distinct h2(`.sod.position_tkrs)

feedQuotes:{dataraw:.Q.hg url;datajson:.j.k dataraw;tall:enlist datajson;
 h(`upd;`quote;select `$assetType,`$assetMainType,`$cusip,`$symbol,`$description,`float$bidPrice,
 `float$bidSize,`$bidId,`float$askPrice,`float$askSize,`$askId,`float$lastPrice,`float$lastSize,`$lastId,`float$openPrice,
 `float$highPrice,`float$lowPrice,`$bidTick,`float$closePrice,`float$netChange,`float$totalVolume,`int$quoteTimeInLong,
 `int$tradeTimeInLong,`float$mark,`$exchange,`$exchangeName,`boolean$marginable,`boolean$shortable,`float$volatility,
 `int$digits,`int$nAV,`float$peRatio,`float$divAmount,`float$divYield,`$divDate,`$securityStatus,`float$regularMarketLastPrice,
 `int$regularMarketLastSize,`int$regularMarketNetChange,`int$regularMarketTradeTimeInLong,`float$netPercentChangeInDouble,
 `float$markChangeInDouble,`float$markPercentChangeInDouble,`float$regularMarketPercentChangeInDouble,`boolean$delayed 
 from tall[x])
 };

.z.ts:{symbolstr:getSymbolStr[];`url set base_url,consumer_key,"&symbol=",symbolstr;
 {if[not `=`$x;feedQuotes[`$x];]} each "," vs symbolstr
 }

extractQuotes:{symbolstr:getSymbolStr[];url:base_url,consumer_key,"&symbol=",symbolstr;dataraw:.Q.hg url;datajson:.j.k dataraw;tall:enlist datajson;
 select `$assetType,`$assetMainType,`$cusip,`$symbol,`$description,`float$bidPrice,
 `float$bidSize,`$bidId,`float$askPrice,`float$askSize,`$askId,`float$lastPrice,`float$lastSize,`$lastId,`float$openPrice,
 `float$highPrice,`float$lowPrice,`$bidTick,`float$closePrice,`float$netChange,`float$totalVolume,`int$quoteTimeInLong,
 `int$tradeTimeInLong,`float$mark,`$exchange,`$exchangeName,`boolean$marginable,`boolean$shortable,`float$volatility,
 `int$digits,`int$nAV,`float$peRatio,`float$divAmount,`float$divYield,`$divDate,`$securityStatus,`float$regularMarketLastPrice,
 `int$regularMarketLastSize,`int$regularMarketNetChange,`int$regularMarketTradeTimeInLong,`float$netPercentChangeInDouble,
 `float$markChangeInDouble,`float$markPercentChangeInDouble,`float$regularMarketPercentChangeInDouble,`boolean$delayed
  from tall[x]
 };

system "P 13";
system "c 25 4096";
h1:hopen `:localhost:5001;
upr:h1(`.sod.getUserPrincipal,0);

buildCred:{[upr] userid:upr[`accounts][0][`accountId];token:upr[`streamerInfo][`token];
 company:upr[`accounts][0][`company];segment:upr[`accounts][0][`segment];cddomain:upr[`accounts][0][`accountCdDomainId];
 usergroup:upr[`streamerInfo][`userGroup];accesslevel:upr[`streamerInfo][`accessLevel];authorized:"Y";
 timestamp:(((`long$`timestamp$"Z"$upr[`streamerInfo][`tokenTimestamp]) - (`long$1970.01.01D00:00.000000000)) % 1000000);
 appid:upr[`streamerInfo][`appId];acl:upr[`streamerInfo][`acl];
 `userid`token`company`segment`cddomain`usergroup`accesslevel`authorized`timestamp`appid!
 (userid;token;company;segment;cddomain;usergroup;accesslevel;authorized;string[timestamp];appid)
 };

buildCredUri:{[upr] userid:upr[`accounts][0][`accountId];token:upr[`streamerInfo][`token];
 company:upr[`accounts][0][`company];segment:upr[`accounts][0][`segment];cddomain:upr[`accounts][0][`accountCdDomainId];
 usergroup:upr[`streamerInfo][`userGroup];accesslevel:upr[`streamerInfo][`accessLevel];authorized:"Y";
 timestamp:(((`long$`timestamp$"Z"$upr[`streamerInfo][`tokenTimestamp]) - (`long$1970.01.01D00:00.000000000)) % 1000000);
 appid:upr[`streamerInfo][`appId];acl:upr[`streamerInfo][`acl]; "userid=",.h.hu[userid],"&token=",.h.hu[token],
 "&company=",.h.hu[company],"&segment=",.h.hu[segment],"&cddomain=",.h.hu[cddomain],"&usergroup=",.h.hu[usergroup],
 "&accesslevel=",.h.hu[accesslevel],"&authorized=",.h.hu[authorized],"&timestamp=",
 string[timestamp],"&appid=",.h.hu[appid],"&acl=",.h.hu[acl]
 };

showhb:1b
pms:`credential`token`version!(buildCredUri[upr];upr[`streamerInfo][`token];"1.0");
req:`service`command`requestid`account`source`parameters!("ADMIN";"LOGIN";0;upr[`accounts][0][`accountId];upr[`streamerInfo][`appId];pms);
reqs:(enlist `requests)!(enlist enlist req);

.sod.ptmod:{("," sv string (distinct 4#.sod.pt))}

.sod.ptseq:1;
pms_q:{`keys`fields!(`$.sod.ptmod[];`$ "0,1,2,3,4,5,6,7,8")};
req_q:{`service`command`requestid`account`source`parameters!("QUOTE";"SUBS";.sod.ptseq;upr[`accounts][0][`accountId];upr[`streamerInfo][`appId];pms_q[])};
req_c:{`service`command`requestid`account`source`parameters!("CHART_EQUITY";"SUBS";.sod.ptseq+1;upr[`accounts][0][`accountId];upr[`streamerInfo][`appId];pms_q[])};
req_n:{`service`command`requestid`account`source`parameters!("NEWS_HEADLINE";"SUBS";.sod.ptseq+1;upr[`accounts][0][`accountId];upr[`streamerInfo][`appId];pms_q[])};

reqs_q:{(enlist `requests)!(enlist enlist req_q[])};
reqs_c:{(enlist `requests)!(enlist enlist req_c[])};
reqs_n:{(enlist `requests)!(enlist enlist req_n[])};

wsurl:"wss://",upr[`streamerInfo][`streamerSocketUrl],"/ws";
\l ws-client_0.2.1.q
.ws.VERBOSE:1b;
.getTdTable:
 {t:flip(`a`b!(`1`1;`2`2));if[12=count key flip raze (raze x)`content;
 t:(raze (raze raze x)`content`key)];
 t1:`ticker`delayed`assetMaintype`cusip`bidPrice`askPrice`lastPrice`bidSize`askSize`askId`bidId`totalVol xcol t;
 t2:select `$ticker, delayed, `$assetMaintype, `$cusip, bidPrice, askPrice, lastPrice, bidSize, askSize, raze askId, 
 raze bidId, totalVol from t1;t2
 }

.getTdTableRaw:{t:raze x[0];t0:t[where 12=count each t];
 t1:`ticker`delayed`assetMaintype`cusip`bidPrice`askPrice`lastPrice`bidSize`askSize`askId`bidId`totalVol xcol t0;
 t2:select `$ticker, delayed, `$assetMaintype, `$cusip, bidPrice, askPrice, lastPrice, bidSize, askSize, raze askId,
 raze bidId, totalVol from t1;
 (count cols t1;`ticker xkey t2)
 }
.getTdTableNews:{t:raze x[0];t1:`seq`ticker xcol t;(count cols t1;`ticker xkey t1)}

.getTdTableChart:{t:raze x[0];
 t1:`seq`ticker`openPrice`highPrice`lowPrice`closePrice`volume xcol t;
 (count cols t1;`ticker xkey t1)
 }

.echo.upd:{[x];if[(enlist `data)~(key .j.k x); show x; 
 {t:enlist x; h(`updj; .getTdTableRaw[t])} each (select content from (raze .j.k x) where service~\:"QUOTE");
 {t:enlist x; h(`upc; .getTdTableChart[t])} each (select content from (raze .j.k x) where service~\:"CHART_EQUITY");
 {t:enlist x; h(`upn; .getTdTableNews[t])} each (select content from (raze .j.k x) where service~\:"NEWS_HEADLINE")];
 if[(enlist `notify)~(key .j.k x); if[showhb;show ltime 1970.01.01+0D00:00:00.001*(enlist "J"$(raze value .j.k x)`heartbeat)];
 if[not (0=count .sod.pt);((show "notified";);.sod.pt: 4_.sod.pt;.sod.ptseq:.sod.ptseq+1;show .sod.pt;system "sleep 5";
 .echo.h .streamChart;.echo.h .streamQuote;.echo.h .streamNews;
 .streamQuote:.j.j reqs_q[];.streamChart:.j.j reqs_c[];.streamNews: 
 .j.j reqs_n[]);show "Already subscribed"];];
 };

.echo.h:.ws.open[wsurl;`.echo.upd];
.streamLogin:.j.j reqs;
.echo.h .streamLogin;
