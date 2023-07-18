#!/bin/bash +x
export SSL_VERIFY_SERVER=NO
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/home/vijay/miniconda3/lib
#/home/vijay/ticktrackerkdb/src/kdbchannel/q/feedhandler/daemonize -e /tmp/stderr -o /tmp/stdout -p /tmp/pidfile  /home/vijay/q/l64/q /home/vijay/ticktrackerkdb/src/kdbchannel/q/feedhandler/collect.q -ticker TSLA,TSLL,TSLS
/home/vijay/q/l64/q /home/vijay/ticktrackerkdb/src/kdbchannel/q/feedhandler/collect.q -ticker TSLA,TSLL,TSLS </dev/null > /tmp/collect.log 2>&1
#cron
#00 09 * * 1-5 /home/vijay/ticktrackerkdb/src/kdbchannel/q/feedhandler/collect.sh