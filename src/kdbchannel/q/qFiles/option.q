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
