#!/bin/bash -x
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/home/vijay/miniconda3/lib
. /home/vijay/td.env
rlwrap /home/vijay/q/l64/q fd.q -p 5002 