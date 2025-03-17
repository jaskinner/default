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

        if (this.getPFocus() && Game.getObjectById(this.getPFocus())) {
            source = Game.getObjectById(this.getPFocus()).amount ? Game.getObjectById(this.getPFocus()) : this.getLargestDroppedEnergy()
        }

        if (tombstone && tombstone.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
            this.withdrawFrom(tombstone, RESOURCE_ENERGY);
        } else if (source) {
            this.setPFocus(source)
            this.pickup(source);
        } else {
            this.getMemory().state = 'transfering';
        }
    }

    transfer() {
        var targets;

        if (this.getRoom().energyAvailable < this.getRoom().energyCapacityAvailable) {
            targets = this.getRoom().find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            }).sort((a, b) => {
                return a.store.getFreeCapacity(RESOURCE_ENERGY) - b.store.getFreeCapacity(RESOURCE_ENERGY);
            })
        } else {
            targets = this.getRoom().find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType === STRUCTURE_CONTAINER && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
        }

        // transfer to nearest hybrid builder if there is one
        var builders = this.getRoom().find(FIND_MY_CREEPS, {
            filter: (creep) => {
                return creep.memory.role === 'builder' && creep.memory.type === 'hybrid';
            }
        }
        ).sort((a, b) => {
            return this.pos().getRangeTo(a) - this.pos().getRangeTo(b);
        });

        if (builders.length > 0) {
            targets.push(builders[0]);
        }

        if (this.getTFocus() && Game.getObjectById(this.getTFocus()) && Game.getObjectById(this.getTFocus()).store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            this.transferTo(Game.getObjectById(this.getTFocus()), RESOURCE_ENERGY);
        } else if (targets.length > 0) {
            this.setTFocus(targets[0])
            this.transferTo(targets[0], RESOURCE_ENERGY);
        }
    }
}
