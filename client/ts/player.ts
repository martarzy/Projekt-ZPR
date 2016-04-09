namespace model {

    export class Player  {
        private username: string;
        private cash: Cash = new Cash();;

        constructor(username: string) {
            this.username = username;
        }

        whatsYourName(): string {
            return this.username;
        }

        earn(amount: number) {
            this.cash.add(amount);
        }

        pay(amount: number) {
            this.cash.remove(amount);
        }
    }

    class Cash {
        private static INITIAL_VALUE = 1500;
        private amount: number;

        constructor() {
            this.amount = Cash.INITIAL_VALUE;
        }

        add(amount: number) {
            this.amount += amount;
        }

        remove(amount: number) {
            this.amount -= amount;
            if (this.amount <= 0)
                throw new PlayerWentBankrupt();
        }
    }

    export class PlayerWentBankrupt { }
}
