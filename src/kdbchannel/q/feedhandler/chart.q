system "P 13";
system "c 25 4096";

default:.Q.def[`ticker`rootdir!enlist [enlist "AAL,VISL"; enlist "/home/vijay/td/db"]] .Q.opt .z.x
dbdir0:default`rootdir
dbdir:dbdir0[0]
show default


h:neg hopen `:localhost:5001; /* connect to rdb */
h2:hopen `:localhost:5001; /* connect to rdb */
.sod.pt:h2(`.sod.position_tkrs)

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
req_q:{`service`command`requestid`account`source`parameters!("CHART_EQUITY";"SUBS";.sod.ptseq;upr[`accounts][0][`accountId];upr[`streamerInfo][`appId];pms_q[])};
reqs_q:{(enlist `requests)!(enlist enlist req_q[])};

wsurl:"wss://",upr[`streamerInfo][`streamerSocketUrl],"/ws";
\l ws-client_0.2.1.q
.ws.VERBOSE:1b;

.getTdTableRaw:{t:x;t1:`ticker xcol t;(count cols t1;`ticker xkey t1)}

.echo.upd:{[x];show x ;if[(enlist `data)~(key .j.k x); show x;{t:enlist x; h(`updk; .getTdTableRaw[t])} each ((raze .j.k x)`content)0];if[(enlist `notify)~(key .j.k x); show ltime 1970.01.01+0D00:00:00.001*(enlist "J"$(raze value .j.k x)`heartbeat);if[not (0=count .sod.pt);((show "notified";);.sod.pt: 4_.sod.pt;.sod.ptseq:.sod.ptseq+1;show .sod.pt;system "sleep 5";.echo.h .streamQuote;.streamQuote:.j.j reqs_q[]);show "Already subscribed"];];};

.echo.h:.ws.open[wsurl;`.echo.upd];
.streamLogin:.j.j reqs;
.echo.h .streamLogin;
/.streamQuote:.j.j reqs_q[];
/.echo.h .streamQuote;

