system "P 13";
system "c 25 1024";

default:.Q.def[`ticker`rootdir!enlist [enlist "AAL,VISL"; enlist "/home/vijay/td/db"]] .Q.opt .z.x
dbdir0:default`rootdir
dbdir:dbdir0[0]
show default

tickers:flip `syms`tkrs!"**"$\:()

getSymbolStr:{ts:flip select tkrs from tickers;"," sv string distinct ts[`tkrs]}

logWrite:{[para] h:hopen`:stderr.log; neg[h] para;hclose h;};
symbol:first default[`ticker]
consumer_key:"NHDTVYJXAMKKRRG4K4HS4SWSBQVUXRX1"
/curl -X GET --header "Authorization: " "https://api.tdameritrade.com/v1/marketdata/quotes?apikey=NHDTVYJXAMKKRRG4K4HS4SWSBQVUXRX1&symbol=VISL"

base_url:"https://api.tdameritrade.com/v1/marketdata/quotes?apikey="
base_url_option:"https://api.tdameritrade.com/v1/marketdata/chains?apikey="
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
.sod.ot:distinct (flip select `$symbol from h2(`.sod.option_tkrs))`symbol
.sod.arft:"/CL,/ES,/RTY,/ZN,/GC,/NQ";
.sod.ft:`$ "," vs .sod.arft;

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

showhb:0b
pms:`credential`token`version!(buildCredUri[upr];upr[`streamerInfo][`token];"1.0");
req:`service`command`requestid`account`source`parameters!("ADMIN";"LOGIN";0;upr[`accounts][0][`accountId];upr[`streamerInfo][`appId];pms);
reqs:(enlist `requests)!(enlist enlist req);

.sod.ptmod:{("," sv string (distinct 4#.sod.pt))}
.sod.otmod:{("," sv string (distinct 4#.sod.ot))}
.sod.ftmod:{("," sv string (distinct 4#.sod.ft))}; 

/{"/ES,/CL,/RTY"}

.sod.ptseq:1;.sod.otseq:1;.sod.ftseq:1;
pms_q:{`keys`fields!(`$.sod.ptmod[];`$ "0,1,2,3,4,5,6,7,8,29,30,31")};
pms_n:{`keys`fields!(`$.sod.ptmod[];`$ "0,1,2,3,4,5,6,7,8,9,10")};
pms_f:{`keys`fields!(`$.sod.ftmod[];`$ "0,1,2,3,4,5,8,9,10,16,19,23")};
pms_o:{`keys`fields!(`$.sod.otmod[];`$ "0,1,2,3,4,5,6,7,8,9,10,11,12,13,23,24,31,32,33,34,35,36")};
req_q:{`service`command`requestid`account`source`parameters!("QUOTE";"SUBS";.sod.ptseq;upr[`accounts][0][`accountId];upr[`streamerInfo][`appId];pms_q[])};
req_o:{`service`command`requestid`account`source`parameters!("OPTION";"SUBS";.sod.otseq+1;upr[`accounts][0][`accountId];upr[`streamerInfo][`appId];pms_o[])};
req_c:{`service`command`requestid`account`source`parameters!("CHART_EQUITY";"SUBS";.sod.ptseq+1;upr[`accounts][0][`accountId];upr[`streamerInfo][`appId];pms_q[])};
req_f:{`service`command`requestid`account`source`parameters!("LEVELONE_FUTURES";"SUBS";.sod.ftseq+1;upr[`accounts][0][`accountId];upr[`streamerInfo][`appId];pms_f[])};
req_n:{`service`command`requestid`account`source`parameters!("NEWS_HEADLINE";"SUBS";.sod.ptseq+1;upr[`accounts][0][`accountId];upr[`streamerInfo][`appId];pms_n[])};

reqs_q:{(enlist `requests)!(enlist enlist req_q[])};
reqs_o:{(enlist `requests)!(enlist enlist req_o[])};
reqs_c:{(enlist `requests)!(enlist enlist req_c[])};
reqs_f:{(enlist `requests)!(enlist enlist req_f[])};
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

.getTdTableRaw1:{t:raze x[0];t0:t[where {(not `assetSubType in key x) and (12=count x)} each t];
 /show `t0, t0;
 t1:`ticker`delayed`assetMaintype`cusip`bidPrice`askPrice`lastPrice`bidSize`askSize`askId`bidId`totalVol xcol t0;
 t2:select `$ticker, delayed, `$assetMaintype, `$cusip, bidPrice, askPrice, lastPrice, bidSize, askSize, raze askId,
 raze bidId, totalVol from t1;
 t0_adr:t[where {(13=count x) and `assetSubType in key x} each t];
 if[not 0=count t0_adr;
 t1_adr:`ticker`delayed`assetMaintype`assetSubType`cusip`bidPrice`askPrice`lastPrice`bidSize`askSize`askId`bidId`totalVol
 xcol t0_adr;
 t2_adr:select `$ticker, delayed, `$assetMaintype, `$cusip, bidPrice, askPrice, lastPrice, bidSize, askSize, raze askId,
 raze bidId, totalVol from t1_adr;
 t_all:(t2 uj t2_adr);];
 if[0=count t0_adr;t_all:t2];
 (count cols t_all;`ticker xkey t_all)
 }

.getTdTableQuote:{t:raze x[0];
 tab:{ddef:(`4;`5)!(0f;0f);val:`key`1`2`3`4`5`6`7`8`29`30`31!(ddef^x)[`key`1`2`3`4`5`6`7`8`29`30`31]} each t;
 tabl:`ticker`bidPrice`askPrice`lastPrice`bidSize`askSize`askId`bidId`totalVol`netChange`week52High`week52Low xcol tab;
 table:select `$ticker, bidPrice, askPrice, lastPrice, bidSize, askSize, askId, bidId, totalVol, netChange, week52High, week52Low from tabl;
 (count cols table;`ticker xkey table)
 }

.getTdTableFutures:{t:raze x[0];
 tab:{ddef:(`4;`5)!(0f;0f);val:`key`1`2`3`4`5`8`9`10`16`19`23!(ddef^x)[`key`1`2`3`4`5`8`9`10`16`19`23]} each t;
 tabl:`ticker`bidPrice`askPrice`lastPrice`bidSize`askSize`totalVol`lastSize`quoteTime`description`netChange`openInterest xcol tab;
 table:select `$ticker, bidPrice, askPrice, lastPrice, bidSize, askSize, totalVol, lastSize, quoteTime, description, netChange, openInterest from tabl;
 (count cols table;`ticker xkey table)
 }

.getTdTableOption:{t:raze x[0];
 tab:{ddef:(`2;`3;`4;`5;`6;`7;`8;`9;`10;`11;`12;`13)!(0f;0f;0f;0f;0f;0f;0f;0f;0f;0f;0f;0f);val:`key`delayed`0`1`2`3`4`5`6`7`8`9`10`11`12`13`23`24`31`32`33`34`35`36!(ddef^x)[`key`delayed`0`1`2`3`4`5`6`7`8`9`10`11`12`13`23`24`31`32`33`34`35`36]} each t;
 tab: `delayed`0`1 _ tab;
 tabl:`ticker`bidPrice`askPrice`lastPrice`highPrice`lowPrice`closePrice`totalVol`openInt`vol`quoteTime`tradeTime`intrinsicValue`netChange`strikePrice`daysToExpiration`delta`gamma`theta`vega`rho xcol tab;
 table:select `$ticker,bidPrice,askPrice,lastPrice,highPrice,lowPrice,closePrice,totalVol,openInt,vol,quoteTime,tradeTime,intrinsicValue,netChange,strikePrice,daysToExpiration,delta,gamma,theta,vega,rho from tabl;
 (count cols table;`ticker xkey table)
 }

.getTdTableNews:{t:raze x[0];t;t1:`seq`ticker xcol t;(count cols t1;`ticker xkey t1)}

.getTdTableChart:{t:raze x[0];
 t1:`seq`ticker`openPrice`highPrice`lowPrice`closePrice`volume xcol t;
 (count cols t1;`ticker xkey t1)
 }

.echo.upd:{[x];if[(enlist `data)~(key .j.k x); show x; logWrite[x];
 {t:enlist x; h(`updj; .getTdTableQuote[t])} each (select content from (raze .j.k x) where service~\:"QUOTE");
 {t:enlist x; h(`updf; .getTdTableFutures[t])} each (select content from (raze .j.k x) where service~\:"LEVELONE_FUTURES");
 {t:enlist x; h(`updo; .getTdTableOption[t])} each (select content from (raze .j.k x) where service~\:"OPTION");
 {t:enlist x; h(`upc; .getTdTableChart[t])} each (select content from (raze .j.k x) where service~\:"CHART_EQUITY");
 {t:enlist x; h(`upn; .getTdTableNews[t])} each (select content from (raze .j.k x) where service~\:"NEWS_HEADLINE")];
 if[(enlist `notify)~(key .j.k x); if[showhb;show ltime 1970.01.01+0D00:00:00.001*(enlist "J"$(raze value .j.k x)`heartbeat)];
 if[not (0=count .sod.pt);.sod.pt: 4_.sod.pt;.sod.ptseq:.sod.ptseq+1;show .sod.pt;]
 if[not (0=count .sod.ft);.sod.ft: 4_.sod.ft;.sod.ftseq:.sod.ftseq+1;show .sod.ft;]
 if[not (0=count .sod.ot);((show "notified";);.sod.ot: 4_.sod.ot;.sod.otseq:.sod.otseq+1;show .sod.ot;system "sleep 5";
 .echo.h .streamChart;.echo.h .streamQuote;.echo.h .streamFutures;.echo.h .streamOption;.echo.h .streamNews;
 .streamQuote:.j.j reqs_q[];.streamFutures:.j.j reqs_f[];.streamOption:.j.j reqs_o[];.streamChart:.j.j reqs_c[];.streamNews:
 .j.j reqs_n[]);show "Already subscribed"];];
 };

.echo.h:.ws.open[wsurl;`.echo.upd];
.streamLogin:.j.j reqs;
.echo.h .streamLogin;
