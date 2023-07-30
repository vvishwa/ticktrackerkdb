h:hopen `:localhost:5001;
h2:hopen `:localhost:5002;
h(`.Q.dpft;`:/data/td/db/daily/all;.z.D;`underlying;`td_option_table)
h(`.Q.dpft;`:/data/td/db/daily/all;.z.D;`ticker;`td_quote_table)
h(`.Q.dpft;`:/data/td/db/daily/all;.z.D;`ticker;`td_chart_table)

h"td_option_table:delete from td_option_table"
h"td_quote_table:delete from td_quote_table"
h"td_chart_table:delete from td_chart_table"

h2 "exit 0"
h "exit 0"
