module.exports = class Creep {
    constructor(creep) {
        this.creep = creep;
    }

    getMemory() {
        return this.creep.memory;
    }

    getCreep() {
        return this.creep;
    }

    getRoom() {
        return this.creep.room;
    }

    moveTo(target) {
        this.creep.moveTo(target);
    }

    harvest(target) {
        this.creep.harvest(target);
    }

    transfer(target, resourceType, amount) {
        this.creep.transfer(target, resourceType, amount);
    }

    getTicksToLive() {
        return this.creep.ticksToLive
    }

    decideState() {
        if (this.getMemory().state === 'harvesting' && this.creep.store.getFreeCapacity() === 0) {
            this.getMemory().state = 'transfering';
        } else if (this.getMemory().state === 'transfering' && this.creep.store.getUsedCapacity() === 0) {
            this.getMemory().state = 'harvesting';
        }
    }
}
