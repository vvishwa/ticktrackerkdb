/this loads lastoptiontrade table
default:.Q.def[`ticker`rootdir!enlist [enlist "AAPL.US"; enlist "/home/vijay/db"]] .Q.opt .z.x
dbdir0:default`rootdir
dbdir:dbdir0[0]
show default

lotdir0:`$enlist dbdir,"/refdata"
lotdir:lotdir0[0]
show lotdir
.Q.l lotdir

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
 /positionsraw:.j.k raze read0 `$"/home/vijay/td/position.json";
 .req.def:enlist ["Authorization"] _ .req.def
 .req.def["Content-Type"]:"application/x-www-form-urlencoded";
 refresh_token_encoded:system "echo $TD_REFRESH_TOKEN_ENCODED";
 oauth2_payload:"grant_type=refresh_token&refresh_token=",refresh_token_encoded[0],"&access_type=&code=&client_id=NHDTVYJXAMKKRRG4K4HS4SWSBQVUXRX1&redirect_uri=";
 access_dict:.req.post["https://api.tdameritrade.com/v1/oauth2/token";()!();oauth2_payload];
 refreshed_access_token:access_dict[`access_token];
 .req.def["Authorization"]:"Bearer ",refreshed_access_token;
 positionsraw:.req.get["https://api.tdameritrade.com/v1/accounts/489682556?fields=positions";()!()];
 positionsraw}

.sod.getTrades:{
 trades:.j.k raze read0 `$"/home/vijay/td/transaction.json";
 select from trades
 }
