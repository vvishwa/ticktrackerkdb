# Prerequisite
kdb: It is tested with KDB+ 4.0. For license and download visit at https://www.kx.com

EODHistoryData: This project uses https://eodhistoricaldata.com/ to get option and trae data. The key used is for free uses of single ticker AAPL. However, one can use any ticker provided key is upated mentioned in fecthOption.q
Ag-Gid: This is one of great API for table and graph and more can be learnt at https://www.ag-grid.com/, for this project ag-grid community addition is used.

# Reference
For websocket and its integration with ReactJS has be referred at white page/kx blog referred is from link https://kx.com/blog/single-page-applications-and-kdb-react/

# Getting Started

1. git clone <project_root>
2. cd ~/ticktrackerkdb/src/kdbchannel/q
3. ./startQ.sh
4. cd ~/ticktrackerkdb/
5. sudo npm install
    Below are acceptable warnings

npm WARN ag-charts-react@2.1.0 requires a peer of react@^16.3.0 but none is installed. You must install peer dependencies yourself.

npm WARN ag-charts-react@2.1.0 requires a peer of react-dom@^16.3.0 but none is installed. You must install peer dependencies yourself.

npm WARN ag-grid-react@24.1.1 requires a peer of react@^16.3.0 but none is installed. You must install peer dependencies yourself.

npm WARN ag-grid-react@24.1.1 requires a peer of react-dom@^16.3.0 but none is installed. You must install peer dependencies yourself.

npm WARN tsutils@3.17.1 requires a peer of typescript@>=2.8.0 || >= 3.2.0-dev || >= 3.3.0-dev || >= 3.4.0-dev || >= 3.5.0-dev || >= 3.6.0-dev || >= 3.6.0-beta || >= 3.7.0-dev || >= 3.7.0-beta but none is installed. You must install peer dependencies yourself.

npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@2.1.3 (node_modules/chokidar/node_modules/fsevents):

npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@2.1.3: wanted {"os":"darwin","arch":"any"} (current: {"os":"linux","arch":"x64"})

npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@2.2.1 (node_modules/fsevents):

npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@2.2.1: wanted {"os":"darwin","arch":"any"} (current: {"os":"linux","arch":"x64"})

npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@1.2.13 (node_modules/watchpack-chokidar2/node_modules/fsevents):

npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@1.2.13: wanted {"os":"darwin","arch":"any"} (current: {"os":"linux","arch":"x64"})

npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@1.2.13 (node_modules/webpack-dev-server/node_modules/fsevents):

npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@1.2.13: wanted {"os":"darwin","arch":"any"} (current: {"os":"linux","arch":"x64"})

6. sudo npm start
    Save the output showing url 

# Play

1. Point your browser to the url is previous step
2. If this is your first time, you need to build table by running script at ~/ticktrackerkdb/src/kdbchannel/q/fetchEOD/crontab.txt . See below for explantion
    export SSL_VERIFY_SERVER=NO;/home/$USER/q/l64/q /home/$USER/kxblogs/fetchOption.q -rootdir \"/home/$USER/db\" > /tmp/fetchOption.q.log 2>&1
    Upon successful run, it should build Option and trade related few tables. Install crontab from  ~/ticktrackerkdb/src/kdbchannel/q/fetchEOD/crontab.txt
3. The drop down will have Dated Date, Ticker and expiration date populated and show table. You shold also see graph showing volatility changes with strike as below
    ![Implied Volatilty](https://github.com/vvishwa/ticktrackerkdb/blob/main/public/OptionIVOL.png?raw=true)
4. After few run of days, you can select a particular dated date and see change in IVOL (Implied Volatility) for each expiration to build and track your expectation for price movement of your ticker.

# TODO

1. Add methodolgy to calculate IVOL based on trade history
2. EODHistory may have outliers and cleansing technique.