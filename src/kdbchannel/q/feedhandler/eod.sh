#!/bin/bash +x
export SSL_VERIFY_SERVER=NO
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/home/vijay/miniconda3/lib
/home/vijay/q/l64/q /home/vijay/ticktrackerkdb/src/kdbchannel/q/feedhandler/eod.q </dev/null > /tmp/eod.log 2>&1
#cron
#05 22 * * 1-5 /home/vijay/ticktrackerkdb/src/kdbchannel/q/feedhandler/eod.sh