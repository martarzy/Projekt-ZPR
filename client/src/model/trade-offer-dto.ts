namespace model {

    export class TradeOfferDTO {
        cashOffered: number;
        cashRequired: number;
        offeredFields: number[];
        requiredFields: number[];

        constructor(cashOff: number, cashReq: number, fieldsOff: number[], fieldsReq: number[]) {
            this.cashOffered = cashOff;
            this.cashRequired = cashReq;
            this.offeredFields = fieldsOff;
            this.requiredFields = fieldsReq;
        }
    }

}