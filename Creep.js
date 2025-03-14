module.exports = class Creep {
    constructor(creep) {
        this.creep = creep;
    }

    getCreep() {
        return this.creep;
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

    getMemory() {
        return this.creep.memory;
    }

    getRoom() {
        return this.creep.room;
    }

    getTicksToLive() {
        return this.creep.ticksToLive
    }

    build(target) {
        // this.say(target.id)
        if (this.getCreep().build(target) == ERR_NOT_IN_RANGE) {
            this.moveTo(target);
        }
    }

    death() {
        // this.say('Goodbye!');
        if (Game.spawns['Spawn1'].recycleCreep(this.getCreep()) === ERR_NOT_IN_RANGE) {
            this.moveTo(Game.spawns['Spawn1']);
        }
    }

    harvestFrom(target) {
        // this.say(target.id)
        if (this.getCreep().harvest(target) == ERR_NOT_IN_RANGE) {
            this.moveTo(target);
        }
    }

    moveTo(target) {
        this.creep.moveTo(target);
    }

    pickup(target) {
        // this.say(target.id)
        if (this.getCreep().pickup(target) == ERR_NOT_IN_RANGE) {
            this.moveTo(target);
        }
    }

    pos() {
        return this.creep.pos;
    }

    say(message) {
        this.creep.say(message);
    }

    transferTo(target, resourceType, amount) {
        // this.say(target.id)
        if (this.getCreep().transfer(target, resourceType) == ERR_NOT_IN_RANGE) {
            this.moveTo(target);
        }
    }

    withdrawFrom(target, resourceType, amount) {
        // this.say(target.id)
        if (this.getCreep().withdraw(target, resourceType) == ERR_NOT_IN_RANGE) {
            this.moveTo(target);
        }
    }

    decideState() {
        if (this.getTicksToLive() < 50) {
            this.getMemory().state = 'recycling';
        } else if (this.getMemory().state === 'harvesting' && this.creep.store.getFreeCapacity() === 0) {
            this.getMemory().state = 'transfering';
        } else if (this.getMemory().state === 'transfering' && this.creep.store.getUsedCapacity() === 0) {
            this.getMemory().state = 'harvesting';
        }
    }
}
