module View {
    export class Pawn {
        private field: Field;
        private element: d3.Selection<any>;

        constructor(startField: Field) {
            this.field = startField;
            this.element = d3.select("svg").append("circle");
            this.element
                .attr("r", 10)
                .attr("cx", this.field.getCoordX() + "px")
                .attr("cy", this.field.getCoordY() + "px")
                .style("fill", "lightblue");
        }

        public move(target: Field) {
            this.field = target;
            this.element
                .transition()
                .duration(100)
                .attr("cx", this.field.getCoordX() + "px")
                .attr("cy", this.field.getCoordY() + "px");
        }

        public getPawnField(): Field {
            return this.field;
        }
    }
}