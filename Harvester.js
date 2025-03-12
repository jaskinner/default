var Creep = require('Creep');

class Harvester extends Creep {
    constructor(creep) {
        super(creep);
        if (!this.getMemory().state) {
            this.getMemory().state = 'harvesting';
        }
    }

    energyStores() {
        return [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_CONTAINER];
    }

    getClosestEnergySource() {
        return this.pos().findClosestByRange(FIND_SOURCES_ACTIVE);
    }

    structureFilter(structure) {
        return this.energyStores().includes(structure.structureType) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
    }

    run() {
        this.decideState();

        if (this.getMemory().state === 'harvesting') {
            var droppedSource = this.pos().findClosestByRange(FIND_DROPPED_RESOURCES) || this.pos().findClosestByRange(FIND_TOMBSTONES);
            var source = this.getClosestEnergySource();

            if (droppedSource) {
                this.pickup(droppedSource);
            } else {
                this.harvestFrom(source);
            }
            this.harvestFrom(source);
        } else if (this.getMemory().state === 'transfering') {
            var targets = this.getRoom().find(FIND_STRUCTURES, {
                filter: this.structureFilter.bind(this)
            });

            if (targets.length > 0) {
                this.transferTo(targets[0], RESOURCE_ENERGY);
            } else {
                this.getCreep().drop(RESOURCE_ENERGY);
            }
        } else if (this.getMemory().state === 'recycling') {
            if (Game.spawns['Spawn1'].recycleCreep(this.getCreep()) === ERR_NOT_IN_RANGE) {
                this.moveTo(Game.spawns['Spawn1']);
            }
        }
    }
}

class Truck extends Harvester {
    constructor(creep) {
        super(creep);
        if (!this.getMemory().state) {
            this.getMemory().state = 'harvesting';
        }
    }

    run() {
        // stub
    }

}

module.exports = {
    Harvester,
    Truck
};
