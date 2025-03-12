var Creep = require('Creep');

module.exports = class Upgrader extends Creep {
    constructor(creep) {
        super(creep);
        if (!this.getMemory().state) {
            this.getMemory().state = 'harvesting';
        }
    }

    upgradeController(controller) {
        if (this.getCreep().upgradeController(this.getRoom().controller) == ERR_NOT_IN_RANGE) {
            this.moveTo(this.getRoom().controller);
        }
    }

    decideState() {
        if (this.getMemory().state === 'harvesting' && this.creep.store.getFreeCapacity() === 0) {
            this.getMemory().state = 'upgrading';
        } else if (this.getMemory().state === 'upgrading' && this.creep.store.getUsedCapacity() === 0) {
            this.getMemory().state = 'harvesting';
        }
    }

    run() {
        this.decideState();

        if (this.getMemory().state === 'harvesting') {
            var droppedSource = this.pos().findClosestByRange(FIND_DROPPED_RESOURCES);
            var source = this.pos().findClosestByRange(FIND_SOURCES_ACTIVE);
            if (droppedSource) {
                this.pickup(droppedSource);
            } else {
                this.harvestFrom(source);
            }
        } else if (this.getMemory().state === 'upgrading') {
            var controller = this.getRoom().controller;
            this.upgradeController(controller);
        } else if (this.getMemory().state === 'recycling') {
            if (Game.spawns['Spawn1'].recycleCreep(this.getCreep()) === ERR_NOT_IN_RANGE) {
                this.moveTo(Game.spawns['Spawn1']);
            }
        }
    }
}
