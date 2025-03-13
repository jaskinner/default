var Creep = require('Creep');

class Harvester extends Creep {
    constructor(creep) {
        super(creep);
        if (!this.getMemory().state) {
            this.getMemory().state = 'harvesting';
        }
    }

    getLargestDroppedEnergy() {
        return this.getRoom().find(FIND_DROPPED_RESOURCES, {
            filter: (resource) => {
                return resource.resourceType === RESOURCE_ENERGY;
            }
        }).sort((a, b) => {
            return b.amount - a.amount;
        })[0];
    }

    getClosestEnergySource() {
        return this.pos().findClosestByRange(FIND_SOURCES_ACTIVE);
    }

    getType() {
        return this.getMemory().type;
    }

    harvest() {
        var source = this.getClosestEnergySource();

        if (source) {
            this.harvestFrom(source);
        }
    }

    transfer() {
        this.getCreep().drop(RESOURCE_ENERGY);
    }

    run() {
        this.decideState();

        if (this.getMemory().state === 'harvesting') {
            this.harvest()
        } else if (this.getMemory().state === 'transfering') {
            this.transfer();
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

    harvest() {
        var source = this.getLargestDroppedEnergy();
        var tombstone = this.pos().findClosestByRange(FIND_TOMBSTONES);

        if (tombstone) {
            this.withdrawFrom(tombstone, RESOURCE_ENERGY);
        } else if (source) {
            this.pickup(source);
        }
    }

    transfer() {
        var targets = this.getRoom().energyAvailable < this.getRoom().energyCapacityAvailable ? this.getRoom().find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        }) : this.getRoom().find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType === STRUCTURE_CONTAINER && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });

        if (targets.length > 0) {
            this.transferTo(targets[0], RESOURCE_ENERGY);
        }
    }
}

module.exports = {
    Harvester,
    Truck
};
