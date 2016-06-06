namespace view {

    /**
    * The class which represents dices.
    * Keeps d3 svg element.
    */
    export class Dices {
        private dicesSvg: d3.Selection<any>;

        /**
        * Selects svg from index.html, which has been prepared for dice,
        * and adds two dices images.
        */
        constructor() {
            this.dicesSvg = d3.select("#dices-svg");

            this.dicesSvg
                .append("image")
                .attr("xlink:href", "images/dice1.svg")
                .attr("x", 8)
                .attr("y", 0)
                .attr("width", 64)
                .attr("height", 64)
                .attr("id", "first-dice");

            this.dicesSvg
                .append("image")
                .attr("xlink:href", "images/dice1.svg")
                .attr("x", 79)
                .attr("y", 0)
                .attr("width", 64)
                .attr("height", 64)
                .attr("id", "second-dice");
        }

        /**
         * Sets appropriate dices href attribute.
         * @param firstDice   number on first dice
         * @param secondDice  number on first dice
         */
        setValue(firstDice: number, secondDice: number): void {
            d3.select("#first-dice")
                .attr("xlink:href", "images/dice" + firstDice + ".svg");

            d3.select("#second-dice")
                .attr("xlink:href", "images/dice" + secondDice + ".svg");
        }
    }
}