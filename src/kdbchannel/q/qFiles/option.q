/this loads lastoptiontrade table
default:.Q.def[`ticker`rootdir!enlist [enlist "AAPL.US"; enlist "/home/vijay/db"]] .Q.opt .z.x
dbdir0:default`rootdir
dbdir:dbdir0[0]
show default

lotdir0:`$enlist dbdir,"/refdata"
lotdir:lotdir0[0]
show lotdir
.Q.l lotdir
.sod.position_tkrs:`LAZR`SOS
/.sod.position_tkrs:`GOOG`MSFT`ELYS`RTX`TELL`AMD`PLUG`BA`AAPL`RIOT`BNGO`ARVL`HTBX`VLDR`ISEE`RESN`FCEL`NNOX`SOLO`PFE`SNDL`REAL;
/`TSM`ACST`BBD`STM`MT`SYNH

.eod.getOption: {[lottd;ticker;exch;dateIndex]
 allsyms:ticker,".",exch;
 path:`$":",dbdir,"/options/",allsyms,"/",lottd,"/";
 optiondata:get path;
 side:`CALL;
 select Contract:contractSize,InMoney:inTheMoney,TrdTime:lastTradeDateTime,Expiration:expirationDate,Strike:strike,LastPrice:lastPrice,Bid:bid,Ask:ask,Change:change,ChgPerc:changePercent,Vol:volume,OenInt:openInterest,IVOL:impliedVolatility,Delta:delta,Gamma:gamma,Theta:theta,Vega:vega,Rho:rho,Theoritical:theoretical,Intrinsic:intrinsicValue,timeValue,updatedAt,DaysExpiration:daysBeforeExpiration from optiondata[`options]["J"$dateIndex[0]][side]}

.eod.getTickers:{
 symexchg:flip select distinct code,exchange from lastoptiontrade;
 allsyms:symexchg[`code],'".",'symexchg[`exchange];
 allsyms}

.eod.getExpiration:{[ticker;exch;x]
 allsyms:ticker,".",exch;
 /lot:select lastTradeDate,code from lastoptiontrade where code~\:"AAPL",exchange~\:"US";
 lot:select lastTradeDate,code from lastoptiontrade where code~\:ticker,exchange~\:exch;
 lottd:last lot[`lastTradeDate];
 path:`$":",dbdir,"/options/",allsyms,"/",lottd,"/";
 optiondata:get path;
 value flip select first expirationDate from optiondata[`options][x][`CALL]}

.eod.getExpirations:{[ticker;exch]
 allsyms:ticker,".",exch;
 lot:select lastTradeDate,code from lastoptiontrade where code~\:ticker;
 lottd:last lot[`lastTradeDate];
 path:`$":",dbdir,"/options/",allsyms,"/",lottd,"/";
 optiondata:get path;
 optionchainlength:select count options from optiondata; .eod.getExpiration[ticker;exch] each til first optionchainlength`options}

.eod.getTrade:{[] lot:select lastTradeDate,code from lastoptiontrade where code~\:"AAPL",exchange~\:"US";
  lottd:last lot[`lastTradeDate];
  path:`$":",dbdir,"/eod/AAPL.US/",lottd,"/";
  eodtrade:get path; select from eodtrade }

.eod.getDatedDates:{system "ls -1 ",dbdir,"/options/AAPL.US"}

.sod.getPositions:{
 positionsraw:.j.k raze read0 `$"/home/vijay/td/position.json";
 positions:select averagePrice,longQuantity,settledLongQuantity,instrument,marketValue from positionsraw[`securitiesAccount;`positions];
 positions}

.sod.getPositionRaw:{
 .req.def["Content-Type"]:"application/x-www-form-urlencoded";
 .req.def:enlist ["Authorization"] _ .req.def;
 refresh_token_encoded:system "echo $TD_REFRESH_TOKEN_ENCODED";
 oauth2_payload:"grant_type=refresh_token&refresh_token=",refresh_token_encoded[0],"&access_type=&code=&client_id=NHDTVYJXAMKKRRG4K4HS4SWSBQVUXRX1&redirect_uri=";
 access_dict:.req.post["https://api.tdameritrade.com/v1/oauth2/token";()!();oauth2_payload];
 refreshed_access_token:access_dict[`access_token];
 .req.def["Authorization"]:"Bearer ",refreshed_access_token;
 positionsraw:.req.get["https://api.tdameritrade.com/v1/accounts/489682556?fields=positions";()!()];
 `.sod.position_tkrs upsert {`$x`symbol}each ((positionsraw`securitiesAccount)`positions)`instrument;
 sp:{syms:`$(x`instrument)`symbol; prices:x`averagePrice;(syms,prices)} each ((positionsraw`securitiesAccount)`positions);
 {tab:distinct 5#.sod.callSch[x[0];neg x[1];0.1*x[1]];if[not 1=count tab;`.sod.option_tkrs upsert tab]} each sp;
 {tab:distinct 5#.sod.putSch[x[0];neg x[1];0.1*x[1]];if[not 1=count tab;`.sod.option_tkrs upsert tab]} each sp;
 positionsraw}

.sod.extractOption:{[opttype;sym;stkprice;moneyin];
 base_url_option:"https://api.tdameritrade.com/v1/marketdata/chains?apikey=";
 consumer_key:"NHDTVYJXAMKKRRG4K4HS4SWSBQVUXRX1";
 url:base_url_option,consumer_key,"&symbol=",(string sym);dataraw:.Q.hg url;datajson:.j.k dataraw;tall:enlist datajson;
 if[opttype=`call;chain:(raze (raze tall)`callExpDateMap);];
 if[opttype=`put;chain:(raze (raze tall)`putExpDateMap);];
 if[not `FAILED~(`$tall`status)[0];
 strikes:(key chain)[where moneyin> stkprice+\: -9h $ string key chain];];
 if[`FAILED~(`$tall`status)[0];
 strikes:`0.0;
 dt:([] symbol:();description:();strikePrice:();daysToExpiration:();sch:();intrinsicValue:();openInterest:();inTheMoney:());
 chain:enlist (enlist strikes)!(enlist dt);];
 select from raze chain[strikes]
 };

.sod.callSch:{[ticker;price;deltaPrice];
 cs:select symbol,description,strikePrice,daysToExpiration,
 sch:{({mm:2#x;dd:2# 2 _ x;yy:"20",2# 4 _ x; dateformatted:yy,".",mm,".",dd;"D"$dateformatted}("C" vs ("_" vs x)[1])[0])} each symbol,intrinsicValue,openInterest,inTheMoney from .sod.extractOption[`call;ticker;price;deltaPrice];
 cs iasc cs[;`sch]
 };

.sod.putSch:{[ticker;price;deltaPrice];
 ps:select symbol,description,strikePrice,daysToExpiration,
 sch:{({mm:2#x;dd:2# 2 _ x;yy:"20",2# 4 _ x; dateformatted:yy,".",mm,".",dd;"D"$dateformatted}("P" vs ("_" vs x)[1])[0])} each symbol,intrinsicValue,openInterest,inTheMoney from .sod.extractOption[`put;ticker;price;deltaPrice];
 ps iasc ps[;`sch]
 };

.sod.getTrades:{
 /trades:.j.k raze read0 `$"/home/vijay/td/transaction.json";
 .req.def["Content-Type"]:"application/x-www-form-urlencoded";
 .req.def:enlist ["Authorization"] _ .req.def;
 refresh_token_encoded:system "echo $TD_REFRESH_TOKEN_ENCODED";
 oauth2_payload:"grant_type=refresh_token&refresh_token=",refresh_token_encoded[0],"&access_type=&code=&client_id=NHDTVYJXAMKKRRG4K4HS4SWSBQVUXRX1&redirect_uri=";
 access_dict:.req.post["https://api.tdameritrade.com/v1/oauth2/token";()!();oauth2_payload];
 refreshed_access_token:access_dict[`access_token];
 .req.def["Authorization"]:"Bearer ",refreshed_access_token;
 trades:.req.get["https://api.tdameritrade.com/v1/accounts/489682556/transactions?type=TRADE";()!()];
 trades
 }

.sod.getUserPrincipal:{
 .req.def["Content-Type"]:"application/x-www-form-urlencoded";
 .req.def:enlist ["Authorization"] _ .req.def;
 refresh_token_encoded:system "echo $TD_REFRESH_TOKEN_ENCODED";
 oauth2_payload:"grant_type=refresh_token&refresh_token=",refresh_token_encoded[0],"&access_type=&code=&client_id=NHDTVYJXAMKKRRG4K4HS4SWSBQVUXRX1&redirect_uri=";
 access_dict:.req.post["https://api.tdameritrade.com/v1/oauth2/token";()!();oauth2_payload];
 refreshed_access_token:access_dict[`access_token];
 .req.def["Authorization"]:"Bearer ",refreshed_access_token;
 userprincipal:.req.get["https://api.tdameritrade.com/v1/userprincipals?fields=streamerSubscriptionKeys%2CstreamerConnectionInfo";()!()];
 select from userprincipal
 }
