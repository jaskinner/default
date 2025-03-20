let spawn = Game.spawns['Spawn1'];

let creep;

const initCreep = _.filter(Game.creeps, (creep) => creep.memory.type === 'init');

const counts = {};

function getCounts() {
    counts.creep = Object.keys(Game.creeps).length;
    counts.harvester = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester').length;
    counts.upgrader = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader').length;
    counts.builder = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder').length;
    counts.truck = _.filter(Game.creeps, (creep) => creep.memory.type === 'truck').length;
    counts.shovel = _.filter(Game.creeps, (creep) => creep.memory.type === 'shovel').length;
    counts.repairer = _.filter(Game.creeps, (creep) => creep.memory.role === 'repairer').length;
    counts.construction = _.filter(Game.constructionSites, (site) => site.my);
    counts.containers = spawn.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType === STRUCTURE_CONTAINER;
        }
    }).length;
}

const bodyParts = {
    default: [MOVE, WORK, CARRY],
    harvester: {
        shovel: [MOVE, WORK, WORK],
        truck: [MOVE, MOVE, CARRY, CARRY]
    },
};

function memoryCleanup() {
    for (let creepName in Memory.creeps) {
        if (!Game.creeps[creepName]) {
            try {
                delete Memory.creeps[creepName];
            } catch (e) {
                console.log('Error cleaning up memory:', creepName, e);
            }
        }
    }
}

function createCreep(body, role, type) {
    try {
        return spawn.spawnCreep(body, role + Game.time, {
            memory: { role, type }
        });
    } catch (e) {
        console.log('Error spawning creep:', role, e);
        return null;
    }
}

module.exports = function spawnHelper() {
    memoryCleanup();
    getCounts();

    if (counts.harvester < 4) {
        if (counts.harvester === 0 || counts.shovel < 2 && counts.truck > 0) {
            creep = createCreep(bodyParts.harvester.shovel, 'harvester', 'shovel');
        } else {
            creep = createCreep(bodyParts.harvester.truck, 'harvester', 'truck');
        }

        if (!counts.containers && counts.builder < 1) {
            creep = createCreep(bodyParts.default, 'builder', 'init');
        }
    } else if (counts.harvester >= 2 && counts.upgrader >= 2) {
        if (counts.construction.length && counts.builder < 2) {
            creep = createCreep(bodyParts.default, 'builder');
        }

        if (counts.repairer < 1 && !counts.construction.length) {
            creep = createCreep(bodyParts.default, 'repairer');
        }
    } else if (counts.upgrader < 3) {
        creep = createCreep(bodyParts.default, 'upgrader');
    }

    return creep;
}
