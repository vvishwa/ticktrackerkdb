import { Position } from "./position"

export interface PositionAndBalance {
    accountId: string;
    currentPosition: Position;
    currentBalance: CurrentBalance;
    isClosingOnlyRestricted: boolean;
    isDayTrader: boolean;
    initialBalance: InitialBalance;
    projectedBalances: ProjectedBalances;
}

export interface CurrentBalance {
    accruedInterest: number;
    bondValue: number;
    cashAvailableForTrading: number;
    cashAvailableForWithdrawal: number;
    cashBalance: number;
    cashCall: number;
    cashDebitCallValue: number;
    cashReceipts: number;
    liquidationValue: number;
    longMarketValue: number;
    longNonMarginableMarketValue: number;
    longOptionMarketValue: number;
    moneyMarketFund: number;
    mutualFundValue: number;
    pendingDeposits: number;
    savings: number;
    shortMarketValue: number;
    shortOptionMarketValue: number;
    totalCash: number;
    unsettledCash: number;
}


export interface InitialBalance {
    accountValue: number;
    accruedInterest: number;
    bondValue: number;
    cashAvailableForTrading: number;
    cashAvailableForWithdrawal: number;
    cashBalance: number;
    cashDebitCallValue: number;
    cashReceipts: number;
    isInCall: boolean;
    liquidationValue: number;
    longOptionMarketValue: number;
    longStockValue: number;
    moneyMarketFund: number;
    mutualFundValue: number;
    pendingDeposits: number;
    shortOptionMarketValue: number;
    shortStockValue: number;
    unsettledCash: number;
}

export interface ProjectedBalances {
    cashAvailableForTrading: number;
    cashAvailableForWithdrawal: number;
}
