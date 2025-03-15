var Harvester = require('Harvester');

module.exports = class Truck extends Harvester {
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

    harvest() {
        var source = this.getClosestEnergySource();
        var tombstone = this.pos().findClosestByPath(FIND_TOMBSTONES);

        if (this.getMemory().pfocus && Game.getObjectById(this.getMemory().pfocus)) {
            source = Game.getObjectById(this.getMemory().pfocus).amount ? Game.getObjectById(this.getMemory().pfocus) : this.getLargestDroppedEnergy()
        }

        if (tombstone && tombstone.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
            this.withdrawFrom(tombstone, RESOURCE_ENERGY);
        } else if (source) {
            this.getMemory().pfocus = source.id
            this.pickup(source);
        } else {
            this.getMemory().state = 'transfering';
        }
    }

    transfer() {
        var targets = this.getRoom().energyAvailable < this.getRoom().energyCapacityAvailable ? this.getRoom().find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        }).sort((a, b) => {
            return a.store.getFreeCapacity(RESOURCE_ENERGY) - b.store.getFreeCapacity(RESOURCE_ENERGY);
        }) : this.getRoom().find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType === STRUCTURE_CONTAINER && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });

        if (this.getMemory().tfocus && Game.getObjectById(this.getMemory().tfocus).store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            this.transferTo(Game.getObjectById(this.getMemory().tfocus), RESOURCE_ENERGY);
        } else if (targets.length > 0) {
            this.getMemory().tfocus = targets[0].id
            this.transferTo(targets[0], RESOURCE_ENERGY);
        }
    }
}
