const helpers = require('helpers');
var Harvester = require('Harvester');
var Truck = require('Truck');
var Upgrader = require('Upgrader');
var Builder = require('Builder');
var Repairer = require('Repairer');

module.exports.loop = function () {
    spawnHelper();

    for (let creepName in Game.creeps) {
        let creep = Game.creeps[creepName];
        let newCreep;
        let creepRole = creep.memory.role;
        let creepType = creep.memory.type;

        if (creepRole === 'harvester') {
            newCreep = creepType === 'truck' ? new Truck(creep) : new Harvester(creep);
        } else if (creepRole === 'upgrader') {
            newCreep = new Upgrader(creep);
        } else if (creepRole === 'builder') {
            newCreep = new Builder(creep);
        } else if (creepRole === 'repairer') {
            newCreep = new Repairer(creep);
        }

        try {
            newCreep.run();
        } catch (e) {
            console.log('Error running creep:', creepName, e);
        }
    }
}
