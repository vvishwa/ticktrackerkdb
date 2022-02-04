system"c 20 170";
/https://code.kx.com/q/wp/websockets/
/* subs table to keep track of current subscriptions */
subs:3!flip `handle`id`func`params!"iis*"$\:();
regi:2!flip `handle`id`params!"isf"$\:();
/quote:flip `time`sym`bid`ask!"nsff"$\:();
upd:insert;

/updj:{cnt:x[0]; tab:x[1]; if[cnt=12;`td_quote_raw upsert tab;if[not 0=count key regi; (neg (key regi)[0]`handle).j.j (-999;`td_quote_raw;tab)]]; if[cnt<12; `td_quote_raw upsert (td_quote_raw lj tab); if[not 0=count key regi; (neg (key regi)[0]`handle) .j.j (-9999;`td_quote_raw;tab)]]}

/updj:{cnt:x[0]; tab:x[1];if[cnt=9;`td_quote_raw upsert tab;if[not 0=count key regi; (neg (key regi)[0]`handle).j.j (-999;`td_quote_raw;tab)]]; if[cnt<9; `td_quote_raw upsert (td_quote_raw lj tab); if[not 0=count key regi; (neg (key regi)[0]`handle) .j.j (-9999;`td_quote_raw;tab)]]}

updj:{cnt:x[0]; tab:x[1];if[cnt=9;`td_quote_raw upsert tab;if[not 0=count key regi; (neg (key regi)[0]`handle).j.j (-999;`td_quote_raw;tab)]]; if[cnt<9; show tab; show (td_quote_raw lj tab); if[not 0=count key regi; (neg (key regi)[0]`handle) .j.j (-9999;`td_quote_raw;tab)]]}

upc:{cnt:x[0]; tab:x[1];if[cnt=10;`td_chart upsert tab;if[not 0=count key regi; (neg (key regi)[0]`handle).j.j (-999;`td_chart;tab)]];if[cnt<8; `td_chart upsert (td_chart lj tab); if[not 0=count key regi; (neg (key regi)[0]`handle) .j.j (-9999;`td_chart;tab)]]}

upn:{cnt:x[0]; tab:x[1]; if[cnt=12;`td_news upsert tab;if[not 0=count key regi; (neg (key regi)[0]`handle).j.j (-999;`td_news;tab)]];if[cnt<12; `td_news upsert (td_news lj tab); if[not 0=count key regi; (neg (key regi)[0]`handle) .j.j (-9999;`td_chart;tab)]]}

quote: flip `assetType`assetMainType`cusip`symbol`description`bidPrice`bidSize`bidId`askPrice`askSize`askId`lastPrice`lastSize`lastId`openPrice`highPrice`lowPrice`bidTick`closePrice`netChange`totalVolume`quoteTimeInLong`tradeTimeInLong`mark`exchange`exchangeName`marginable`shortable`volatility`digits`52WkHigh`52WkLow`nAV`peRatio`divAmount`divYield`divDate`securityStatus`regularMarketLastPrice`regularMarketLastSize`regularMarketNetChange`regularMarketTradeTimeInLong`netPercentChangeInDouble`markChangeInDouble`markPercentChangeInDouble`regularMarketPercentChangeInDouble`delayed!"sssssffsffsffsfffsfffiifssbbfiffifffssfiiiffffb"$\:();
td_quote_rt:(flip `ticker`delayed`assetMaintype`cusip`bidPrice`askPrice`lastPrice`bidSize`askSize`askId`bidId`totalVol!())

formatWS:{[x;trap]
 x:.j.k x;
 fname:x`func;
 x:prepSproc[x];
 id:x[0];
 func:x[1];
 arg:x[2];
 if[not trap; :.[func; arg]];
 res:.[func; arg; {`$"'",x}];
 neg[.z.w].j.j (id;fname;res)
 };

prepSproc:{[x]
 id:x`id;
 func: x`func;
 x:x`obj;
 show enlist (.z.p; `$func; x);
 func:value func;
 //If the function is monadic, enlist the argument
 if[1=count value[func][1]; x:enlist x];
 (id; func; x)
 };

.z.ws:{
 .dev.ws:x;
 p:.j.k .dev.ws;
 if[not ((p`func)~".rt.subscribe" or (p`func)~".sod.register");show formatWS[x; 1b]]
 if[(p`func)~".rt.subscribe";.rt.subscribe[x]]
 if[(p`func)~".sod.register";.sod.register[x]]
 };

.z.wc: {delete from `subs where handle=x};
 /*subscribe to something */
.rt.subscribe:{
 rh:neg hopen `:localhost:5002;
 x:.j.k x;
 fname:`getQuotes;
 id:x`id;
 arg:`$x`obj;`subs upsert(.z.w;`int$id;fname;arg);(neg rh)(insert; `tickers; (arg; arg))};

.sod.register:{
 x:.j.k x;
 id:x`id;
 arg:x`obj;`regi upsert(.z.w;`$id;arg)};

getQuotes:{
  filter:$[all raze null x;distinct quote`symbol;raze x];
  res: 0!select last assetType, last assetMainType, last cusip, last description, last bidPrice, last bidSize, last bidId, last askPrice, last askSize, last askId, last lastPrice, last lastSize, last lastId, last openPrice, last highPrice, last lowPrice, last bidTick by symbol, last closePrice, last netChange, last totalVolume, last quoteTimeInLong, last tradeTimeInLong, last mark, last exchange, last exchangeName, last marginable, last shortable, last volatility, last digits, last nAV, last peRatio, last divAmount, last divYield, last divDate, last securityStatus, last regularMarketLastPrice, last regularMarketLastSize, last regularMarketNetChange, last regularMarketTradeTimeInLong, last netPercentChangeInDouble, last markChangeInDouble, last markPercentChangeInDouble, last regularMarketPercentChangeInDouble, last delayed from quote where symbol in filter;
  `func`result!(`getQuotes;res)};

getNews:{
  select from (`ticker`seq`symbol`errorCode`storyDateTime`headLine`status xcol td_news) where not storyDateTime  ~\:"N/A"
  };

/*publish data according to subs table */
pub:{
  row:(0!subs)[x];
  (neg row[`handle]) .j.j (row[`id]; row[`func]; (value row[`func])[row[`params]])
  };

/* trigger refresh every 100ms */
.z.ts:{pub each til count subs};

debug:{
 formatWS[.dev.ws; 0b]
 };

saveFiles:{
 files:(key `:qFiles) except `start.q;
 bools:files like "*.q";
 tabs:files where not bools;
 saveTabs:{(` sv `:qFiles,x) set get x; show enlist(.z.p; `$"Saved table:"; x)};
 @[saveTabs; ; {show enlist(.z.p; `$"Save error"; x)}] each tabs;
 };

.z.exit:saveFiles;

