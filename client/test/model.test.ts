/// <reference path="../src/model/round.ts" />
/// <reference path="../src/model/player.ts" />
/// <reference path="../src/model/model.ts" />
/// <reference path="../src/model/field.ts" />
/// <reference path="qunit.d.ts" />

test("player test", function () {
    let player = new model.Player("Tester", "red");
    deepEqual(player.username, "Tester");
    deepEqual(player.cash, 0);
    deepEqual(player.color, "red");
    player.setCash(1000);
    deepEqual(player.cash, 1000);
});

test("buyable field test", function () {
    let field = new model.Field(0, "Red", 500, 100);
    deepEqual(field.id, 0);
    deepEqual(field.group, "Red");
    deepEqual(field.cost, 500);
    deepEqual(field.isBuyable(), true);
    deepEqual(field.ownerUsername(), "");
    field.markAsBought("Tester");
    deepEqual(field.ownerUsername(), "Tester");
});

test("not buyable field test", function () {
    let field = new model.Field(0, "My test field");
    deepEqual(field.ownerUsername(), "");
    field.markAsBought("Tester");
    deepEqual(field.ownerUsername(), "");
});

test("buying houses only after obtaining while district", function () {
    let gameSituation = initModel(true);
    let testModel = gameSituation[0];
    let username = gameSituation[1];
    const expansible = testModel.boardModel.expansibleFields(username);
    deepEqual(expansible.length, 3);
});

test("buying houses with difference of 1 blocked", function () {
    let gameSituation = initModel();
    let testModel = gameSituation[0];
    let username = gameSituation[1];
    const expansible = testModel.boardModel.expansibleFields(username);
    expansible[0].buyHouse();
    deepEqual(expansible[0].housesBuilt, 1);
    const expansibleAfterBuy = testModel.boardModel.expansibleFields(username);
    deepEqual(expansibleAfterBuy.length, 2);
});

function initModel(test: boolean = false): [model.Model, string] {
    let testModel = new model.Model();
    const player = new model.Player("TestPlayer", "lime");
    testModel.boardModel.placePawnsOnBoard([player]);
    const moves = [6, 2];
    moves.forEach(roll => {
        testModel.boardModel.movePawn(player.username, roll);
        testModel.boardModel.buyField(player.username);
        if (test)
            deepEqual(testModel.boardModel.expansibleFields(player.username), []);
    });
    testModel.boardModel.movePawn(player.username, 1);
    testModel.boardModel.buyField(player.username);
    return [testModel, player.username];
}

test("Grouping fields by group attribute", function () {
    const m = new model.Model();
    const fields = [new model.Field(1, "A"),
                    new model.Field(2, "B"),
                    new model.Field(3, "A"),
                    new model.Field(4, "C"),
                    new model.Field(5, "A"),
                    new model.Field(6, "C")];
    const grouped = m.boardModel.groupFieldsByGroup(fields);
    deepEqual(grouped["A"].length, 3);
    deepEqual(fieldsIdToString(grouped["A"]), "1,3,5");
    deepEqual(grouped["B"].length, 1);
    deepEqual(fieldsIdToString(grouped["B"]), "2");
    deepEqual(grouped["C"].length, 2);
    deepEqual(fieldsIdToString(grouped["C"]), "4,6");
});

function fieldsIdToString(fields: Array<model.Field>): string {
    return fields.map(e => e.id).join(",");
}