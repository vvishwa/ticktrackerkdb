export interface Trade {
    type:string;//                 | "TRADE"
    subAccount:string;//           | ,"1"
    settlementDate:string;//       | "2021-02-26"
    orderId:number;//              | "2174082157"
    netAmount:number;//            | 25.77
    transactionDate:string;//      | "2021-02-24T16:19:50+0000"
    orderDate:string;//            | "2021-02-24T16:14:21+0000"
    transactionSubType:string;//   | "SL"
    transactionId:number;//        | 3.288085e+10
    cashBalanceEffectFlag:boolean;//| 1b
    description:string;//          | "SELL TRADE"
    fees: {
        rFee:number,//         | 0
        additionalFee:number,//| 0
        cdscFee:number,      //| 0
        regFee:number,       //| 0.48
        otherCharges:number, //| 0
        commission:number,   //| 6.95
        optRegFee:number,    //| 0
        secFee:number,       //| 0
    };
    transactionItem: {
        accountId:number,//  | 4.896826e+08
        amount:number,//     | 4000f
        price:number,//      | 0.0083
        cost:number,//       | 33.2
        instruction:string,//| "SELL"
        instrument: {assetType:string, cusip:string, symbol:string};
    }    
}

export interface FlattenedTrade {
    type:string;
    subAccount:string;
    settlementDate:string;
    orderId:number;
    netAmount:number;
    transactionDate:string;
    orderDate:string;
    transactionSubType:string;
    transactionId:number;
    cashBalanceEffectFlag:boolean;
    description:string;
    
    rFee:number;
    additionalFee:number;
    cdscFee:number;
    regFee:number;
    otherCharges:number;
    commission:number;
    optRegFee:number;
    secFee:number;
        
    accountId:number;
    amount:number;
    price:number;
    cost:number;
    instruction:string;
    assetType:string; 
    cusip:string; 
    symbol:string;

}
