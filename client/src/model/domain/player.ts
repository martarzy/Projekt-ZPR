﻿namespace model {

    /**
     * Simple domain class representing player.
     */
    export class Player {
        private cash_ = 0;
        jailExitCards = 0;
        inJail = false;

        constructor(private username_: string, private color_: string) {
        }

        get username(): string {
            return this.username_;
        }

        get cash(): number {
            return this.cash_;
        }

        get color(): string {
            return this.color_;
        }

        setCash(amount: number): void {
            this.cash_ = amount;
        }
    }
}