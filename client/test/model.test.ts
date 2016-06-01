/// <reference path="../src/model/round.ts" />
/// <reference path="../src/model/player.ts" />
/// <reference path="../src/model/model.ts" />
/// <reference path="../src/model/field.ts" />
/// <reference path="qunit.d.ts" />

test("round test", function () {
    let round = new model.Round();
    deepEqual(round.movementPerformed, false);
    round.playerMoved();
    deepEqual(round.movementPerformed, true);
    round.reset();
    deepEqual(round.movementPerformed, false);
});

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
    const expansible = testModel.board.expansibleFields(username);
    deepEqual(expansible.length, 3);
});

test("buying houses with difference of 1 blocked", function () {
    let gameSituation = initModel();
    let testModel = gameSituation[0];
    let username = gameSituation[1];
    const expansible = testModel.board.expansibleFields(username);
    expansible[0].buyHouse();
    deepEqual(expansible[0].housesBuilt, 1);
    const expansibleAfterBuy = testModel.board.expansibleFields(username);
    deepEqual(expansibleAfterBuy.length, 2);
});

function initModel(test: boolean = false): [model.Model, string] {
    let testModel = new model.Model();
    const player = new model.Player("TestPlayer", "lime");
    testModel.board.placePawnsOnBoard([player]);
    const moves = [6, 2];
    moves.forEach(roll => {
        testModel.board.movePawn(player.username, roll);
        testModel.board.buyField(player.username);
        if (test)
            deepEqual(testModel.board.expansibleFields(player.username), []);
    });
    testModel.board.movePawn(player.username, 1);
    testModel.board.buyField(player.username);
    return [testModel, player.username];
}