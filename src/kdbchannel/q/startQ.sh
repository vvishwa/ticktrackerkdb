#!/bin/bash -x
. /home/vijay/td.env
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/home/vijay/miniconda3/lib
/home/vijay/q/l64/q qFiles/start.q -p 5001 -rootdir "/home/vijay/db" -ticker "APPL.US"
