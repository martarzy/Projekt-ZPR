/// <reference path="../src/model/round.ts" />
/// <reference path="../src/model/player.ts" />
/// <reference path="../src/model/field.ts" />

test("round test", function () {
    let round = new model.Round();
    equal(round.movementPerformed, false);
    round.playerMoved();
    equal(round.movementPerformed, true);
    round.reset();
    equal(round.movementPerformed, false);
});

test("player test", function () {
    let player = new model.Player("Tester");
    equal(player.username, "Tester");
    equal(player.cash, 0);
    player.setCash(1000);
    equal(player.cash, 1000);
});

test("buyable field test", function () {
    let field = new model.Field(0, "My test field", 500, true);
    equal(field.id, 0);
    equal(field.description, "My test field");
    equal(field.cost, 500);
    equal(field.buyable, true);
    equal(field.hasOwner(), false);
    equal(field.ownerUsername(), "");
    field.markAsBought("Tester");
    equal(field.hasOwner(), true);
    equal(field.ownerUsername(), "Tester");
});

test("not buyable field test", function () {
    let field = new model.Field(0, "My test field", 500, false);
    equal(field.hasOwner(), false);
    equal(field.ownerUsername(), "");
    field.markAsBought("Tester");
    equal(field.hasOwner(), false);
    equal(field.ownerUsername(), "");
});