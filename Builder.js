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
    }

    run() {
        this.decideState();

        if (this.getMemory().state === 'harvesting') {
            var source = this.pos().findClosestByRange(FIND_SOURCES_ACTIVE);
            this.harvestFrom(source);
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
