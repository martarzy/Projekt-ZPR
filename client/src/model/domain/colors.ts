namespace model {

    /**
     * Represents colors available to players.
     */
    export class Colors {
        private colors_: Array<string> = ["#ff9999",
                                          "#85e085",
                                          "#ffff66",
                                          "#99ddff",
                                          "#555555",
                                          "#ff80ff"];
        getColor(index: number): string {
            return this.colors_[index];
        }
    }

}