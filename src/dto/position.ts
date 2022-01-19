export interface Position {
    averagePrice: number; 
    longQuantity: number;
    settledLongQuantity: number;
    instrument: {assetType:string, cusip:string, symbol:string};
    marketValue: number;
};
