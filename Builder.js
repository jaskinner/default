var Creep = require('Creep');

module.exports = class Builder extends Creep {
    constructor(creep) {
        super(creep);
        if (!this.getMemory().state) {
            this.getMemory().state = 'harvesting';
        }
    }

    decideState() {
        if (this.getMemory().state === 'harvesting' && this.creep.store.getFreeCapacity() === 0) {
            this.getMemory().state = 'building';
        } else if (this.getMemory().state === 'building' && this.creep.store.getUsedCapacity() === 0) {
            this.getMemory().state = 'harvesting';
        }
    }

    decideTarget() {
        const sites = this.getRoom().find(FIND_MY_CONSTRUCTION_SITES);

        if (!sites) {
            return;
        }

        const target = sites.reduce((best, current) => {
            const bestProgress = best.progress / best.progressTotal;
            const currentProgress = current.progress / current.progressTotal;
            return currentProgress > bestProgress ? current : best;
        }, sites[0]);

        return target;
    }

    run() {
        this.decideState();

        if (this.getMemory().state === 'harvesting') {
            var tombstone = this.pos().findClosestByRange(FIND_TOMBSTONES);
            var droppedSource = this.pos().findClosestByRange(FIND_DROPPED_RESOURCES);
            var container = this.pos().findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType === STRUCTURE_CONTAINER && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
                }
            });

            if (droppedSource) {
                this.pickup(droppedSource);
            } else if (tombstone) {
                this.pickup(tombstone);
            } else if (container) {
                this.harvestFrom(container);
            }
        } else if (this.getMemory().state === 'building') {
            var target = this.decideTarget();

            if (!target) {
                this.getCreep().drop(RESOURCE_ENERGY);
            } else {
                this.build(target);
            }
        } else if (this.getMemory().state === 'recycling') {
            if (Game.spawns['Spawn1'].recycleCreep(this.getCreep()) === ERR_NOT_IN_RANGE) {
                this.moveTo(Game.spawns['Spawn1']);
            }
        }
    }
}
