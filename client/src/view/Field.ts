namespace view {
    export class Field {
        // statyczna tablica ze wspolrzednymi kolejnych pol
        private static FieldCoords = [
            // pola na dole (od prawej)
            [788, 788],
            [700, 788],
            [630, 788],
            [560, 788],
            [490, 788],
            [420, 788],
            [350, 788],
            [280, 788],
            [210, 788],
            [140, 788],
            [52,  788],
            // pola po lewej (od dolu)
            [52,  700],
            [52,  630],
            [52,  560],
            [52,  490],
            [52,  420],
            [52,  350],
            [52,  280],
            [52,  210],
            [52,  140],
            // pola u gory (od lewej)
            [52,  52],
            [140, 52],
            [210, 52],
            [280, 52],
            [350, 52],
            [420, 52],
            [490, 52],
            [560, 52],
            [630, 52],
            [700, 52],
            [788, 52],
            // pola po prawej (od gory)
            [788, 140],
            [788, 210],
            [788, 280],
            [788, 350],
            [788, 420],
            [788, 490],
            [788, 560],
            [788, 630],
            [788, 700]
        ];

        private static FieldDescription: any[] = [
            { image: "images/go.svg", big: true },                      // nr 0 - pole startowe
            { color: "blueviolet", name: "TODO", cash: "200$" },        // nr 1 - fioletowe
            { image: "images/chance.svg" },                             // nr 2 - szansa
            { color: "blueviolet", name: "TODO", cash: "200$" },        // nr 3 - fioletowe
            { image: "images/income_tax.svg" },                         // nr 4 - podatek
            { image: "images/railroad.svg" },                           // nr 5 - dworzec
            { color: "lightblue", name: "TODO", cash: "200$"},          // nr 6 - niebieske
            { image: "images/chance.svg" },                             // nr 7 - szansa
            { color: "lightblue", name: "TODO", cash: "200$" },         // nr 8 - niebieske
            { color: "lightblue", name: "TODO", cash: "200$" },         // nr 9 - niebieske
            { image: "images/jail.svg", big:true },                     // nr 10 - wiezienie
            { color: "darkred", name: "TODO", cash: "200$"},            // nr 11 - bordowe
            { image: "images/electric_company.svg" },                   // nr 12 - elektorwnia
            { color: "darkred", name: "TODO", cash: "200$"},            // nr 13 - bordowe
            { color: "darkred", name: "TODO", cash: "200$"},            // nr 14 - bordowe
            { image: "images/railroad.svg" },                           // nr 15 - dworzec
            { color: "orange", name: "TODO", cash: "200$" },            // nr 16 - pomaranczowe
            { image: "images/chance.svg" },                             // nr 17 - sznasa
            { color: "orange", name: "TODO", cash: "200$" },            // nr 18 - pomaranczowe
            { color: "orange", name: "TODO", cash: "200$" },            // nr 19 - pomaranczowe
            { image: "images/parking.svg", big:true },                  // nr 20 - parking
            { color: "red", name: "TODO", cash: "200$" },               // nr 21 - czerwone
            { image: "images/chance.svg" },                             // nr 22 - szansa
            { color: "red", name: "TODO", cash: "200$" },               // nr 23 - czerwone
            { color: "red", name: "TODO", cash: "200$" },               // nr 24 - czerwone
            { image: "images/railroad.svg" },                           // nr 25 - dworzec
            { color: "yellow", name: "TODO", cash: "200$" },            // nr 26 - zolte
            { color: "yellow", name: "TODO", cash: "200$" },            // nr 27 - zolte
            { image: "images/water_works.svg" },                        // nr 28 - wodociagi
            { color: "yellow", name: "TODO", cash: "200$" },            // nr 29 - zolte
            { image: "images/goto_jail.svg", big:true },                // nr 30 - idz do wiezienia
            { color: "green", name: "TODO", cash: "200$" },             // nr 31 - zielone
            { color: "green", name: "TODO", cash: "200$" },             // nr 32 - zielone
            { image: "images/chance.svg" },                             // nr 33 - szansa
            { color: "green", name: "TODO", cash: "200$" },             // nr 34 - zielone
            { image: "images/railroad.svg" },                           // nr 35 - dworzec
            { image: "images/chance.svg" },                             // nr 36 - szansa
            { color: "darkblue", name: "TODO", cash: "200$" },          // nr 37 - granatowe
            { image: "images/luxury_tax.svg" },                         // nr 38 - podatek od luksusu
            { color: "darkblue", name: "TODO", cash: "200$" },          // nr 39 - granatowe
        ];

        private fieldId: number;
        // wspolrzedne srodkow pol
        private coordinateX: number;
        private coordinateY: number;

        constructor(fieldId: number) {
            this.fieldId = fieldId;
            this.coordinateX = Field.FieldCoords[fieldId][0];
            this.coordinateY = Field.FieldCoords[fieldId][1];

            var fieldRotation = Math.floor(fieldId / 10) * 90;

            if (fieldId == 5 || fieldId == 15|| fieldId == 25 || fieldId == 35 ||
                fieldId == 12 || fieldId == 28)
            {
                var fieldDesc = Field.FieldDescription[fieldId];
                this.createSpecialImageField(fieldDesc.image, this.coordinateX, this.coordinateY, fieldRotation);
            } else if (Field.FieldDescription[fieldId].image) {
                var fieldDesc = Field.FieldDescription[fieldId];
                this.createImageField(fieldDesc.image, this.coordinateX, this.coordinateY, fieldRotation, fieldDesc.big);
            } else {
                var fieldDesc = Field.FieldDescription[fieldId];
                this.createPlaceField(fieldDesc.name, fieldDesc.cash, fieldDesc.color, this.coordinateX, this.coordinateY, fieldRotation);
            }
        }

        public getCoordX(): number {
            return this.coordinateX;
        }

        public getCoordY(): number {
            return this.coordinateY;
        }

        public getFieldId(): number {
            return this.fieldId;
        }

        public createSpecialImageField(url: string, x: number, y: number, rotation: number) {
            var g = d3.select("svg")
                .append("g");

            g.attr("game-id", this.fieldId);

            g.append("rect")
                .attr("x", -35)
                .attr("y", -53)
                .attr("width", 70)
                .attr("height", 105)
                .attr("fill", "whitesmoke")
                .attr("stroke", "black");

                // kwadracik dla kupujacego
                g.append("rect")
                    .attr("x", +20)
                    .attr("y", -53)
                    .attr("width", 15)
                    .attr("height", 15)
                    .attr("fill", "white")
                    .attr("stroke", "black")
                    .attr("id", "bought-field" + this.fieldId);

                g.append("image")
                    .attr("xlink:href", url)
                    .attr("x", -30)
                    .attr("y", -30)
                    .attr("width", 60)
                    .attr("height", 60);

            g.attr("transform", "translate(" + x + " " + y + "), rotate(" + rotation + ")");
        }

        public createImageField(url: string, x: number, y: number, rotation: number, big: boolean)
        {
            var g = d3.select("svg")
                .append("g");

            g.attr("game-id", this.fieldId);

            if (big) {
                g.append("rect")
                    .attr("x", -53)
                    .attr("y", -53)
                    .attr("width", 105)
                    .attr("height", 105)
                    .attr("fill", "whitesmoke")
                    .attr("stroke", "black");

                g.append("image")
                    .attr("xlink:href", url)
                    .attr("x", -40)
                    .attr("y", -40)
                    .attr("width", 80)
                    .attr("height", 80);
            } else {
                g.append("rect")
                    .attr("x", -35)
                    .attr("y", -53)
                    .attr("width", 70)
                    .attr("height", 105)
                    .attr("fill", "whitesmoke")
                    .attr("stroke", "black");

                g.append("image")
                    .attr("xlink:href", url)
                    .attr("x", -30)
                    .attr("y", -30)
                    .attr("width", 60)
                    .attr("height", 60);
            }
            // obrazek
            g.attr("transform", "translate(" + x + " " + y + "), rotate(" + rotation + ")");
        }

        public createPlaceField(name: string, price: string, color: string, x: number, y: number, rotation: number) {
            var g = d3.select("svg")
                .append("g");

            g.attr("game-id", this.fieldId);

            // kolorowy pasek pola
            g.append("rect")
                .attr("x", -35)
                .attr("y", -53)
                .attr("width", 70)
                .attr("height", 15)
                .attr("fill", color)
                .attr("stroke", "black");                
            
            // glowny prostokat
            g.append("rect")
                .attr("x", -35)
                .attr("y", -38)
                .attr("width", 70)
                .attr("height", 90)
                .attr("fill", "whitesmoke")
                .attr("stroke", "black")
                .attr("id","main-collateralize-field-" + this.fieldId);

            // kwadracik dla kupujacego
            g.append("rect")
                .attr("x", +20)
                .attr("y", -53)
                .attr("width", 15)
                .attr("height", 15)
                .attr("fill", "white")
                .attr("stroke", "black")
                .attr("id", "bought-field" + this.fieldId);

            // kwadraciki dla domow i hotelu
            // pole dla hotelu
            g.append("rect")
                .attr("x", -20)
                .attr("y", -20)
                .attr("width", 40)
                .attr("height", 40)
                .attr("fill", "whitesmoke")
                .attr("id", "hotel-field-" + this.fieldId);
            // nr 1
            g.append("rect")
                .attr("x", -20)
                .attr("y", -20)
                .attr("width", 15)
                .attr("height", 15)
                .attr("fill", "whitesmoke")
                .attr("id", "house-field1-" + this.fieldId);
            // nr 2
            g.append("rect")
                .attr("x", +5)
                .attr("y", -20)
                .attr("width", 15)
                .attr("height", 15)
                .attr("fill", "whitesmoke")
                .attr("id", "house-field2-" + this.fieldId);
            // nr 3
            g.append("rect")
                .attr("x", -20)
                .attr("y", +5)
                .attr("width", 15)
                .attr("height", 15)
                .attr("fill", "whitesmoke")
                .attr("id", "house-field3-" + this.fieldId);
            // nr 4
            g.append("rect")
                .attr("x", +5)
                .attr("y", +5)
                .attr("width", 15)
                .attr("height", 15)
                .attr("fill", "whitesmoke")
                .attr("id", "house-field4-" + this.fieldId);

            g.append("text")
                .attr("text-anchor", "middle")
                .attr("x", 0)
                .attr("y", -25)
                .text(name)
                .attr("fill", "black");

            g.append("text")
                .attr("text-anchor", "middle")
                .attr("x", 0)
                .attr("y", 35)
                .text(price)
                .attr("fill", "black");

            g.attr("transform", "translate("+x+" "+y+"), rotate("+rotation+")");
        }

        public changeBoughtFieldColor(color: string) {
            var rect = document.getElementById("bought-field" + this.fieldId);
            rect.style.fill = color;
        }

        drawHighlightField(x: number, y: number) {
            var fieldRotation = Math.floor(this.fieldId / 10) * 90;
            var g = d3.select("svg").append("g");

            g.append("rect")
                .attr("x", -35)
                .attr("y", -53)
                .attr("width", 70)
                .attr("height", 15)
                .attr("fill", "lime")    
                .attr("stroke", "black")
                .attr("fill-opacity", 0.3)
                .attr("class", "highlighted-field");

            g.append("rect")
                .attr("x", -35)
                .attr("y", -38)
                .attr("width", 70)
                .attr("height", 90)
                .attr("fill", "lime")
                .attr("stroke", "black")
                .attr("fill-opacity", 0.3)
                .attr("class", "highlighted-field");

            g.attr("transform", "translate(" + x + " " + y + "), rotate(" + fieldRotation + ")");
        }

        public sellAllHouses(fieldId: number) {
            $("#house-field4-" + fieldId).attr("stroke", "whitesmoke").attr("fill", "whitesmoke");
            $("#house-field3-" + fieldId).attr("stroke", "whitesmoke").attr("fill", "whitesmoke");
            $("#house-field2-" + fieldId).attr("stroke", "whitesmoke").attr("fill", "whitesmoke");
            $("#house-field1-" + fieldId).attr("stroke", "whitesmoke").attr("fill", "whitesmoke");
            $("#hotel-field-" + fieldId).attr("stroke", "whitesmoke").attr("fill", "whitesmoke");
        }

        public buildHouses(fieldId: number, amount: number) {
            this.sellAllHouses(fieldId);
            switch (amount) {
                case 4:
                    $("#house-field4-" + fieldId).attr("stroke", "black").attr("fill", "green");
                case 3:
                    $("#house-field3-" + fieldId).attr("stroke", "black").attr("fill", "green");
                case 2:
                    $("#house-field2-" + fieldId).attr("stroke", "black").attr("fill", "green");
                case 1:
                    $("#house-field1-" + fieldId).attr("stroke", "black").attr("fill", "green");
                    break;
                case 5:
                    $("#house-field4-" + fieldId).attr("stroke", "red").attr("fill", "red");
                    $("#house-field3-" + fieldId).attr("stroke", "red").attr("fill", "red");
                    $("#house-field2-" + fieldId).attr("stroke", "red").attr("fill", "red");
                    $("#house-field1-" + fieldId).attr("stroke", "red").attr("fill", "red");
                    $("#hotel-field-" + fieldId).attr("stroke",  "red").attr("fill", "red");
            }
        }

        public collateralizeField(fieldId: number) {
            $("#main-collateralize-field-" + fieldId).attr("fill", "gray");
            $("#hotel-field-" +  fieldId).attr("fill", "gray");
            $("#house-field4-" + fieldId).attr("fill", "gray");
            $("#house-field3-" + fieldId).attr("fill", "gray");
            $("#house-field2-" + fieldId).attr("fill", "gray");
            $("#house-field1-" + fieldId).attr("fill", "gray");
        }

        public buyBackField(fieldNumber: number) {
            $("#main-collateralize-field-" + fieldNumber).attr("fill", "whitesmoke");
            $("#hotel-field-" +  fieldNumber).attr("fill", "whitesmoke");
            $("#house-field4-" + fieldNumber).attr("fill", "whitesmoke");
            $("#house-field3-" + fieldNumber).attr("fill", "whitesmoke");
            $("#house-field2-" + fieldNumber).attr("fill", "whitesmoke");
            $("#house-field1-" + fieldNumber).attr("fill", "whitesmoke");
        }
    }
}
