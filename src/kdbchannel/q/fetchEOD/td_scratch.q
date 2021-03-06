default:.Q.def[`ticker`rootdir!enlist [enlist "AAL,VISL"; enlist "/home/vijay/td/db"]] .Q.opt .z.x
dbdir0:default`rootdir
dbdir:dbdir0[0]
show default

symbol:first default[`ticker]
consumer_key:"NHDTVYJXAMKKRRG4K4HS4SWSBQVUXRX1"
/curl -X GET --header "Authorization: " "https://api.tdameritrade.com/v1/marketdata/quotes?apikey=NHDTVYJXAMKKRRG4K4HS4SWSBQVUXRX1&symbol=VISL"

url:"https://api.tdameritrade.com/v1/marketdata/quotes?apikey=",consumer_key,"&symbol=",symbol
dataraw:.Q.hg url
datajson:.j.k dataraw

tall:enlist datajson
ltd:{x: "." vs x; x[0],"-",x[1],"-",x[2]} string .z.d

saveQuotes:{tab:tall[`$x]; path:`$":",dbdir,"/eod/",x,"/", ltd,"/"; path upsert .Q.en[`:/home/vijay/td/db/refd;] tab}

saveAllQuotes:{saveQuotes each "," vs symbol}

loadQuotes:{path:`$":",dbdir,"/eod/",x,"/", ltd,"/"; tab:get path; count tab}

loadAllQuotes:{loadQuotes each "," vs symbol}

.z.ts:saveAllQuotes
/exit 0

tradesraw:raze read0 `$"/home/vijay/td/transaction.json"
trades:.j.k tradesraw
trades

positionsraw:.j.k raze read0 `$"/home/vijay/td/position.json"

getSymbol:{a:":" vs x; a[3]}

str:"{\"assetType\":\"EQUITY\",\"cusip\":\"874039100\",\"symbol\":\"TSM\"}"

.j.k str

positions:select averagePrice,longQuantity,settledLongQuantity, instrument,marketValue from positionsraw[`securitiesAccount;`positions]

positions

curl -X GET --header "Authorization: " --header "Authorization: Bearer wxa0QKVyewjydETNXkQgIa8pMqpegS7L5n/5MLF55FdLlMT6bJUUsAgt6n4XZR3ZgifSTL7O56Cb+wuvnVdSsBYj89Jfpg6dEA9fjB3G15Z3Gcl/Cb5q5K6E92wEhg3Q0ntxDJk1r3MZZ+8oigGcbAa6NUsg8XQuYEeDS8QgtG2b6eCLzRjxvs4qMKj2e8NTFSLF0QAAzeiwxsD+5Nwe1wOwc1l9D59bDDqie3Dwv0eTdEFrekdM/QfrLEE8wQdNJbEdhN34UL2E7S3cSivd613XbmaNunv6akZ4I8tFStuHEKH+R7n2wJS3DsHOk/dIP1kY3uv5mmaCREH9UKSeLaxITz2M+jjk29jxHAPkCFfkOwsIVV+B6WsWtpQNe+5EHzld+kr7+K90V67yKbCTQmNlX/27oqb8Dk1mM00Bfm7c/kkLeMiEXqNYTD19mPjXCzJFG5pgtreusGzYsqu116Kl7IaklSNC0u2mVCKHlegRS/WQxcmBxZvEZubySg/XBK+1/27L458151hD0wASHrJNJ7T100MQuG4LYrgoVi/JHHvlyHBbhGqy4xtlUKkMomXzYBAT+mawEsFqP7ntA8rdEO2qJ6z5yTGl+PZaUtjwwk4wkQ8+oO7Nmr9FGH4qVhD3NLjaBykYXRdjEbaC5WS8eBpOe5DVzD5G7ujPks/JANXb8g7uc97CcTeG66kyNle2QR/WCQxc4qwNz2IlTwPUniPTfzvqPA4tz0Ll4LgnNlADPy1VwGyMZC8rLm8++JTiucoMkbIbzXlmcqcdddN5u9+tulO5l3GSga/fBBDs2UaGB93K2q7QfPxrr53DNPTOkfZqMzumeUgQwPcG0XYJZNeKMGIO52WVqFG3oz2rMXmOBaUKGSaG4QhcXevdNVF5yb77fhH83Hdb+6JCZ/IhF6bjkkQu7mzYYBoJyY5ymD0NujtM5acBL/xX1l97ls7STdkk6rocazel2tfxG7edg8G496BM1PJ1JWGF3XxP9FBtSgL1RIlGvFLV6ZbscLGrRPNgpExR+4S+F1dH5wsc0MQOnANaub8sBBa7kNTzxUJkgDrYL3E5FmIeTqfYvnw/YC+Zkk0=212FD3x19z9sWBHDJACbC00B75E" "https://api.tdameritrade.com/v1/accounts/489682556/transactions"


url1:`$"https://api.tdameritrade.com"
auth:.h.hu "Bearer f980p7jE8YcG4/h5WwwpIVCmjMZfV6VyMjlemcGy9cU5Ar7OyFH0YGjuGN3e24MJpY4iLq0QqV8ZR/Nwm1kQnZchcE9fUisutmSUzbM9JrYcJhcADuLPVjVrIteNpBEVJ+9V0OKUr27jaoeDc2iUrtJZfARwp9/ZY2ysCNAEIGcKqwuj2qcyzIzDr6UYgqT0EPh1QSSF3p6WUHVuJy8zEIgEI7eySPPsAAIUp7Nqn8pYVIlovz09Nl+lgHBgIFTQUsk4fcq7AoUSFy8DVBUanMSsTGYk4MKSiG3wqmaHZfcMsIH4+NIvGY19tELjWUU7KvuWxi1g/KMwZyuUC9OzjIlj6fFIy8oYwHhuGz4eFnjCkboOxfLs87XJq7HZywH6qt8vS181O2xH70SEv46qXxuADVBWs/z1lcbhpwAFebgVN1ykwIcGUUD8k9vVg7WuRCZEBDQNF9hMslSTLL5aBThZKRzMK5Atf1s1HQHqbBPaQpw55sjrtDc6tRJBSUR+0aLHu/e8Ft0Kdbse+wnUA9jioTBScIzgLLV+G100MQuG4LYrgoVi/JHHvlYE4iiZF+Q/vmDLyK/qeco3Ysya8UXpyB1tXBsqkR5yytAcoe7J/XUyoJW8FmlVWgvjJOdngxaohLh+dktZ5RwZ9FZTFkY/9Mwu9ESpjtN/jyA6jntAVj4HK3d22pO12QpOd3qmKKyAvVVOaM2YdFnP4URFekjd5Eo/HSdaP22hwD4QaEFg1EBx7oj27bMB5yDGyZBLWXOp+XYQabPDsxYftrOKiZ+LkIN9+qkGwgxwyZljWiAnhBY6dxdXGJ4UEy9JruoQ7cx7d3868Pri2Zvwr41W6USCle61UAeaPkJJ2LvB1qxEd0KfVImaadutqOwG32aoSX+V/hH/0a0/yapcUO8aO0DnJfmNn9kFM0ksR7b8DLKIC/gI3Vx+XML6UOrhNJ1WeYwKAMn5dcQ0XGN4cRf1QMRc3ZbG20j1T14ZVqd82ZwVBpFgGYv7ePPai2g388taNRSIivHqQWSfNtdx6++l1xmYQ1R8dIp3JAKJpY4rdqKCXfqeU0bUddf3nj8WzGyhder35bZ9gnrM2Z5SFxIM4GSJpk9Vparf212FD3x19z9sWBHDJACbC00B75E"

posraw:.Q.hg "https://api.tdameritrade.com/v1/accounts/489682556?transactions&Authorization=",auth

posraw


s2s:"GET /mmz4281/1314/E0.csv HTTP/1.0\r\nhost:www.football-data.co.uk\r\n\r\n"
s2s:"GET /v1/accounts/489682556/transactions/ Authorization: Bearer wxa0QKVyewjydETNXkQgIa8pMqpegS7L5n/5MLF55FdLlMT6bJUUsAgt6n4XZR3ZgifSTL7O56Cb+wuvnVdSsBYj89Jfpg6dEA9fjB3G15Z3Gcl/Cb5q5K6E92wEhg3Q0ntxDJk1r3MZZ+8oigGcbAa6NUsg8XQuYEeDS8QgtG2b6eCLzRjxvs4qMKj2e8NTFSLF0QAAzeiwxsD+5Nwe1wOwc1l9D59bDDqie3Dwv0eTdEFrekdM/QfrLEE8wQdNJbEdhN34UL2E7S3cSivd613XbmaNunv6akZ4I8tFStuHEKH+R7n2wJS3DsHOk/dIP1kY3uv5mmaCREH9UKSeLaxITz2M+jjk29jxHAPkCFfkOwsIVV+B6WsWtpQNe+5EHzld+kr7+K90V67yKbCTQmNlX/27oqb8Dk1mM00Bfm7c/kkLeMiEXqNYTD19mPjXCzJFG5pgtreusGzYsqu116Kl7IaklSNC0u2mVCKHlegRS/WQxcmBxZvEZubySg/XBK+1/27L458151hD0wASHrJNJ7T100MQuG4LYrgoVi/JHHvlyHBbhGqy4xtlUKkMomXzYBAT+mawEsFqP7ntA8rdEO2qJ6z5yTGl+PZaUtjwwk4wkQ8+oO7Nmr9FGH4qVhD3NLjaBykYXRdjEbaC5WS8eBpOe5DVzD5G7ujPks/JANXb8g7uc97CcTeG66kyNle2QR/WCQxc4qwNz2IlTwPUniPTfzvqPA4tz0Ll4LgnNlADPy1VwGyMZC8rLm8++JTiucoMkbIbzXlmcqcdddN5u9+tulO5l3GSga/fBBDs2UaGB93K2q7QfPxrr53DNPTOkfZqMzumeUgQwPcG0XYJZNeKMGIO52WVqFG3oz2rMXmOBaUKGSaG4QhcXevdNVF5yb77fhH83Hdb+6JCZ/IhF6bjkkQu7mzYYBoJyY5ymD0NujtM5acBL/xX1l97ls7STdkk6rocazel2tfxG7edg8G496BM1PJ1JWGF3XxP9FBtSgL1RIlGvFLV6ZbscLGrRPNgpExR+4S+F1dH5wsc0MQOnANaub8sBBa7kNTzxUJkgDrYL3E5FmIeTqfYvnw/YC+Zkk0=212FD3x19z9sWBHDJACbC00B75E\r\n HTTP/1.0\r\nhost:api.tdameritrade.com\r\n\r\n"


data:(`$":http://www.football-data.co.uk") s2s
data:(`$":https://api.tdameritrade.com") s2s

(" SSSIIIIII IIIIIIIIIIII"; ",")0:data

.Q.hp["https://google.com";.h.ty`json]"my question"



https://api.tdameritrade.com/v1/accounts/489682556/transactions?Authorization=Authorization: Bearer XvNt3ECEtE8uDe+Nv2bNV3ijXKX8k84yuw3He38N53Fi0hfXJaITpQPOLL8JCnx9XEEFzHQuTVcyAqHivCD9OB/EIdBCga1PxBZcuUxr+H9EkIViaJe5opmUV/uYXiBVFzR0Ei779ucSdoxNR4khpCmdJ4MzdVQBfiYq81X0R5DVnuhehjutAnRYOZ5U0+S+NkaDmSHo+KCNd6KPUKzOUuIwDHF32zs2yAtuQCz2ET5h2aB4CG1ZVEo/RA63DXPFNrMM8Qd5FCvdY77QM8/OCWp7pcWecFkeUN/+5Nd1dJ9jhFyQCfRTwEtFysIDYPwAJfwNKe8AFBbXxIvj0zuseBfiGJOADHZui7rGDfCkmf+vwxgpCYM/WD61PlCGrqoY6pCJVjyO56agVgixLMFhm1PtHOh0SQcTcD5Up1lC5TNj44xkR5rDlMrWUD13ceoPAzBo74ccs7JZUhxdi4UOPOrvz0dve2C8R56nTM7urU/Udo0FtmvTOm91BPnr7yM1eMFz0NRI/EdcHMvKsdMC5GGmnB3100MQuG4LYrgoVi/JHHvlJSvx+KbmdG0bZWwHOvEZg+2Z9WYxuMqknCrIRQVkd/he1Jjv+0ucTr/Tfu85MN8a/c/AP9drhjcMi3sycOWdU7wer/5P/mvm+yz1NIgqencWlIIPjHokokYKhqGsRQVQg82WYMarVLy6ibCIhSalUt3Q10EmA3LUkkvnsvjOB0rabS4Nuvf4ps61UUeCWsVNXbu9cVmUUz23GLmOExOthoTBceh7QZlwR++gzQfHKZ5jfPrb6AovXz6EvyS5KYYHxJR7FoSRUUdWzsfHL6JAQLaUsljr8D++D21MM47eSl9Xku+zeDGpTEx0v8Br1d6hZn3QeNldJzIgF2StCHkfuvc1Q/f2/s7uyvlJGRN+irX8gYJwjEockWrK4FUKz6FWUJHG/KJGKwGDsqEDv6UWn/JSbldULiBGph3/MhF+jGB4ofJ5LASt2EduwDuZGICK1l2UXVM7lXzlC5xDLB4uJ8DUjz8f7XNziai4Wqqq1hlOj5ASPfs0r/QnlbsoNk+EKQd7A9AB4tl370egSHtAfLUxtCE=212FD3x19z9sWBHDJACbC00B75E"


Authorization%3A%20Bearer%20XvNt3ECEtE8uDe%2BNv2bNV3ijXKX8k84yuw3He38N53Fi0hfXJaITpQPOLL8JCnx9XEEFzHQuTVcyAqHivCD9OB%2FEIdBCga1PxBZcuUxr%2BH9EkIViaJe5opmUV%2FuYXiBVFzR0Ei779ucSdoxNR4khpCmdJ4MzdVQBfiYq81X0R5DVnuhehjutAnRYOZ5U0%2BS%2BNkaDmSHo%2BKCNd6KPUKzOUuIwDHF32zs2yAtuQCz2ET5h2aB4CG1ZVEo%2FRA63DXPFNrMM8Qd5FCvdY77QM8%2FOCWp7pcWecFkeUN%2F%2B5Nd1dJ9jhFyQCfRTwEtFysIDYPwAJfwNKe8AFBbXxIvj0zuseBfiGJOADHZui7rGDfCkmf%2BvwxgpCYM%2FWD61PlCGrqoY6pCJVjyO56agVgixLMFhm1PtHOh0SQcTcD5Up1lC5TNj44xkR5rDlMrWUD13ceoPAzBo74ccs7JZUhxdi4UOPOrvz0dve2C8R56nTM7urU%2FUdo0FtmvTOm91BPnr7yM1eMFz0NRI%2FEdcHMvKsdMC5GGmnB3100MQuG4LYrgoVi%2FJHHvlJSvx%2BKbmdG0bZWwHOvEZg%2B2Z9WYxuMqknCrIRQVkd%2Fhe1Jjv%2B0ucTr%2FTfu85MN8a%2Fc%2FAP9drhjcMi3sycOWdU7wer%2F5P%2Fmvm%2Byz1NIgqencWlIIPjHokokYKhqGsRQVQg82WYMarVLy6ibCIhSalUt3Q10EmA3LUkkvnsvjOB0rabS4Nuvf4ps61UUeCWsVNXbu9cVmUUz23GLmOExOthoTBceh7QZlwR%2B%2BgzQfHKZ5jfPrb6AovXz6EvyS5KYYHxJR7FoSRUUdWzsfHL6JAQLaUsljr8D%2B%2BD21MM47eSl9Xku%2BzeDGpTEx0v8Br1d6hZn3QeNldJzIgF2StCHkfuvc1Q%2Ff2%2Fs7uyvlJGRN%2BirX8gYJwjEockWrK4FUKz6FWUJHG%2FKJGKwGDsqEDv6UWn%2FJSbldULiBGph3%2FMhF%2BjGB4ofJ5LASt2EduwDuZGICK1l2UXVM7lXzlC5xDLB4uJ8DUjz8f7XNziai4Wqqq1hlOj5ASPfs0r%2FQnlbsoNk%2BEKQd7A9AB4tl370egSHtAfLUxtCE%3D212FD3x19z9sWBHDJACbC00B75E%22


.td.url