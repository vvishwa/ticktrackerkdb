export interface Position {
    averagePrice: number; 
    longQuantity: number;
    settledLongQuantity: number;
    instrument: {assetType:string, cusip:string, symbol:string};
    marketValue: number;
};

export interface FlattenedPosition {
    averagePrice: number; 
    longQuantity: number;
    settledLongQuantity: number;
    assetType:string;
    cusip:string;
    symbol:string;
    marketValue: number;
}