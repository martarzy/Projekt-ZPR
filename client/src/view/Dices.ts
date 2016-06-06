namespace view {
    export class Dices {
        private dicesSvg: d3.Selection<any>;

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

        public setValue(firstDice: number, secondDice: number) {
            d3.select("#first-dice")
                .attr("xlink:href", "images/dice" + firstDice + ".svg");

            d3.select("#second-dice")
                .attr("xlink:href", "images/dice" + secondDice + ".svg");
        }
    }
}