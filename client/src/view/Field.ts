namespace view {
    /**
     * Represents a field.
     */
    export class Field {
        /**
        * Static table with fields coordinates.
        */
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
            // left side (from bottom)
            [52,  700],
            [52,  630],
            [52,  560],
            [52,  490],
            [52,  420],
            [52,  350],
            [52,  280],
            [52,  210],
            [52,  140],
            // top (from left side)
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
            // right (from top)
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

        /**
        * Static table with fields data (images, colors, names, all prices).
        */
        public static FieldDescription: any[] = [
            { image: "images/go.svg", big: true },                                    // nr 0 - pole startowe
            {
                color: "blueviolet", name: "Tczew", cash: "60$", buildHouse: "50",
                rent: "2", oneHouse: "10", twoHouses: "30", threeHouses: "90", fourHouses: "160", hotel: "250"
            },                      // nr 1 - fioletowe
            { image: "images/chance.svg" },                                           // nr 2 - szansa
            {
                color: "blueviolet", name: "Malbork", cash: "60$", buildHouse: "50",
                rent: "4", oneHouse: "20", twoHouses: "60", threeHouses: "180", fourHouses: "320", hotel: "450"
            },                    // nr 3 - fioletowe
            { image: "images/income_tax.svg" },                                       // nr 4 - podatek
            { image: "images/railroad.svg" , name: "Centralny", cash: "200$"},        // nr 5 - dworzec
            {
                color: "lightblue", name: "Ostrołęka", cash: "100$", buildHouse: "50",
                rent: "6", oneHouse: "30", twoHouses: "90", threeHouses: "270", fourHouses: "400", hotel: "550"
            },                   // nr 6 - niebieske
            { image: "images/chance.svg" },                                           // nr 7 - szansa
            {
                color: "lightblue", name: "Łomża", cash: "100$", buildHouse: "50",
                rent: "6", oneHouse: "30", twoHouses: "90", threeHouses: "270", fourHouses: "400", hotel: "550"
            },                      // nr 8 - niebieske
            {
                color: "lightblue", name: "Białystok", cash: "120$", buildHouse: "50",
                rent: "8", oneHouse: "40", twoHouses: "100", threeHouses: "300", fourHouses: "450", hotel: "600"
            },                  // nr 9 - niebieske
            { image: "images/jail.svg", big:true },                                   // nr 10 - wiezienie
            {
                color: "darkred", name: "Grudziądz", cash: "140$", buildHouse: "100",
                rent: "10", oneHouse: "50", twoHouses: "150", threeHouses: "450", fourHouses: "625", hotel: "750"
            },                     // nr 11 - bordowe
            { image: "images/electric_company.svg", name: "Elektrownia", cash: "150"},// nr 12 - elektorwnia
            {
                color: "darkred", name: "Elbląg", cash: "140$", buildHouse: "100",
                rent: "10", oneHouse: "50", twoHouses: "150", threeHouses: "450", fourHouses: "625", hotel: "750"
            },                        // nr 13 - bordowe
            {
                color: "darkred", name: "Olsztyn", cash: "160$", buildHouse: "100",
                rent: "12", oneHouse: "60", twoHouses: "180", threeHouses: "500", fourHouses: "700", hotel: "900"
            },                       // nr 14 - bordowe
            { image: "images/railroad.svg", name: "Zachodni", cash: "200$"},          // nr 15 - dworzec
            {
                color: "orange", name: "Konin", cash: "160$", buildHouse: "100",
                rent: "14", oneHouse: "70", twoHouses: "200", threeHouses: "550", fourHouses: "750", hotel: "950"
            },                         // nr 16 - pomaranczowe
            { image: "images/chance.svg" },                                           // nr 17 - sznasa
            {
                color: "orange", name: "Toruń", cash: "160$", buildHouse: "100",
                rent: "14", oneHouse: "70", twoHouses: "200", threeHouses: "550", fourHouses: "750", hotel: "950"
            },                         // nr 18 - pomaranczowe
            {
                color: "orange", name: "Bydgoszcz", cash: "180$", buildHouse: "100",
                rent: "16", oneHouse: "80", twoHouses: "220", threeHouses: "600", fourHouses: "800", hotel: "1000"
            },                     // nr 19 - pomaranczowe
            { image: "images/parking.svg", big:true },                                // nr 20 - parking
            {
                color: "red", name: "Rybnik", cash: "220$", buildHouse: "150",
                rent: "18", oneHouse: "90", twoHouses: "250", threeHouses: "700", fourHouses: "875", hotel: "1050"
            },                           // nr 21 - czerwone
            { image: "images/chance.svg" },                                           // nr 22 - szansa
            {
                color: "red", name: "Gliwice", cash: "220$", buildHouse: "150",
                rent: "18", oneHouse: "90", twoHouses: "250", threeHouses: "700", fourHouses: "875", hotel: "1050"
            },                          // nr 23 - czerwone
            {
                color: "red", name: "Katowice", cash: "240$", buildHouse: "150",
                rent: "20", oneHouse: "100", twoHouses: "300", threeHouses: "750", fourHouses: "925", hotel: "1100"
            },                         // nr 24 - czerwone
            { image: "images/railroad.svg", name: "Gdański", cash: "200$" },          // nr 25 - dworzec
            {
                color: "yellow", name: "Wieliczka", cash: "260$", buildHouse: "150",
                rent: "22", oneHouse: "110", twoHouses: "330", threeHouses: "800", fourHouses: "975", hotel: "1150"
            },                     // nr 26 - zolte
            {
                color: "yellow", name: "Zakopane", cash: "260$", buildHouse: "150",
                rent: "22", oneHouse: "110", twoHouses: "330", threeHouses: "800", fourHouses: "975", hotel: "1150"
            },                      // nr 27 - zolte
            { image: "images/water_works.svg", name: "Wodociągi", cash: "150" },      // nr 28 - wodociagi
            {
                color: "yellow", name: "Kraków", cash: "280$", buildHouse: "150",
                rent: "24", oneHouse: "120", twoHouses: "360", threeHouses: "850", fourHouses: "1025", hotel: "1200"
            },                        // nr 29 - zolte
            { image: "images/goto_jail.svg", big:true },                              // nr 30 - idz do wiezienia
            {
                color: "green", name: "Sopot", cash: "300$", buildHouse: "200",
                rent: "26", oneHouse: "130", twoHouses: "390", threeHouses: "900", fourHouses: "1100", hotel: "1275"
            },                          // nr 31 - zielone
            {
                color: "green", name: "Gdynia", cash: "300$", buildHouse: "200",
                rent: "26", oneHouse: "130", twoHouses: "390", threeHouses: "900", fourHouses: "1100", hotel: "1275"
            },                         // nr 32 - zielone
            { image: "images/chance.svg" },                                           // nr 33 - szansa
            {
                color: "green", name: "Gdańsk", cash: "320$", buildHouse: "200",
                rent: "28", oneHouse: "150", twoHouses: "450", threeHouses: "1000", fourHouses: "1200", hotel: "1400"
            },                         // nr 34 - zielone
            { image: "images/railroad.svg", name: "Wschodni", cash: "200$" },         // nr 35 - dworzec
            { image: "images/chance.svg" },                                           // nr 36 - szansa
            {
                color: "darkblue", name: "Łódź", cash: "350$", buildHouse: "200",
                rent: "35", oneHouse: "175", twoHouses: "500", threeHouses: "1100", fourHouses: "1300", hotel: "1500"
            },                        // nr 37 - granatowe
            { image: "images/luxury_tax.svg" },                                       // nr 38 - podatek od luksusu
            {
                color: "darkblue", name: "Warszawa", cash: "350$", buildHouse: "200",
                rent: "50", oneHouse: "200", twoHouses: "600", threeHouses: "1400", fourHouses: "1700", hotel: "2000"
            },                    // nr 39 - granatowe
        ];

        /**
        * Keeps field's number (id).
        */
        private fieldId: number;

        /**
        * Field center points coordinates.
        */
        private coordinateX: number;
        private coordinateY: number;

        /**
         * Sets field id and coordinates from static table.
         * Creates fields with right parameters. Also checks if fields should be routated.
         * @param fieldId
         */
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

        /**
         * Returns field's x coordinate.
         */
        getCoordX(): number {
            return this.coordinateX;
        }

       /**
         * Returns field's y coordinate.
         */
        getCoordY(): number {
            return this.coordinateY;
        }

        /**
         * Returns field's number.
         */
        getFieldId(): number {
            return this.fieldId;
        }

        /**
         * Creates a utility field with an image.
         * @param url   image's url
         * @param x     field's x coordinate
         * @param y     field's y coordinate
         * @param rotation  angle to set rotation
         */
        createSpecialImageField(url: string, x: number, y: number, rotation: number): void {
            var g = d3.select("#board-svg")
                .append("g");

            g.attr("game-id", this.fieldId);

            g.append("rect")
                .attr("x", -35)
                .attr("y", -53)
                .attr("width", 70)
                .attr("height", 105)
                .attr("fill", "whitesmoke")
                .attr("stroke", "black");

                // square for buyer
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
                
                // if railways station
                if (this.fieldId == 5 || this.fieldId == 15 || this.fieldId == 25 || this.fieldId == 35) {
                    g.append("text")
                        .attr("text-anchor", "middle")
                        .attr("x", 0)
                        .attr("y", 35)
                        .text(Field.FieldDescription[this.fieldId].cash)
                        .attr("fill", "black");
                    g.append("text")
                        .attr("text-anchor", "middle")
                        .attr("x", 0)
                        .attr("y", -25)
                        .text(Field.FieldDescription[this.fieldId].name)
                        .attr("fill", "black");
                }

            g.attr("transform", "translate(" + x + " " + y + "), rotate(" + rotation + ")");
        }

        /**
         * Creates a special field with an image.
         * @param url image's url
         * @param x field's x coordinate
         * @param y field's y coordinate
         * @param rotation angle to set rotation
         * @param big check if an image is big (if is in the corners)
         */
        createImageField(url: string, x: number, y: number, rotation: number, big: boolean): void
        {
            var g = d3.select("#board-svg")
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

        /**
         * Creates an order town's field.
         * @param name town's name
         * @param price field's price
         * @param color field's color
         * @param x field's x coordinate
         * @param y field's y coordinate
         * @param rotation angle to set rotation
         */
        createPlaceField(name: string, price: string, color: string, x: number, y: number, rotation: number): void {
            var g = d3.select("#board-svg")
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
                .attr("id","main-mortgage-field-" + this.fieldId);

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

        /**
         * Changes a buyer squere color when a field is bought.
         * @param color color of a buyer
         */
        changeBoughtFieldColor(color: string): void {
            var rect = document.getElementById("bought-field" + this.fieldId);
            rect.style.fill = color;
        }

        /**
         * Removes all houses from chosen field.
         * @param fieldId field's number
         */
        sellAllHouses(fieldId: number): void {
            $("#house-field4-" + fieldId).attr("stroke", "whitesmoke").attr("fill", "whitesmoke");
            $("#house-field3-" + fieldId).attr("stroke", "whitesmoke").attr("fill", "whitesmoke");
            $("#house-field2-" + fieldId).attr("stroke", "whitesmoke").attr("fill", "whitesmoke");
            $("#house-field1-" + fieldId).attr("stroke", "whitesmoke").attr("fill", "whitesmoke");
            $("#hotel-field-" + fieldId).attr("stroke", "whitesmoke").attr("fill", "whitesmoke");
        }

        /**
         * Draws given amount of houses on chosen field.
         * @param fieldId field's number
         * @param amount number of houses to build
         */
        buildHouses(fieldId: number, amount: number): void {
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

        /**
         * To set gray color of chosen field when a player takes mortgage.
         * @param fieldId field's number
         */
        mortgageField(fieldId: number): void {
            $("#main-mortgage-field-" + fieldId).attr("fill", "gray");
            $("#hotel-field-" +  fieldId).attr("fill", "gray");
            $("#house-field4-" + fieldId).attr("fill", "gray");
            $("#house-field3-" + fieldId).attr("fill", "gray");
            $("#house-field2-" + fieldId).attr("fill", "gray");
            $("#house-field1-" + fieldId).attr("fill", "gray");
        }

        /**
         * To restore color of a field when a player repurchases chosen field.
         * @param fieldId field's number
         */
        unmortgageField(fieldId: number): void {
			$("#main-mortgage-field-" + fieldId).attr("fill", "whitesmoke");
            $("#hotel-field-" +  fieldId).attr("fill", "whitesmoke");
            $("#house-field4-" + fieldId).attr("fill", "whitesmoke");
            $("#house-field3-" + fieldId).attr("fill", "whitesmoke");
            $("#house-field2-" + fieldId).attr("fill", "whitesmoke");
            $("#house-field1-" + fieldId).attr("fill", "whitesmoke");
        }
    }
}
