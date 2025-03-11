module.exports.loop = function () {
    for (var i in Memory.creeps) {
        if (!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }
    
    for (var x in Game.creeps) {
        var creep = Game.creeps[x]
    }
}
