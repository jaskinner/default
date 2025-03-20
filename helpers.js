const spawn = null || Game.spawns.Spawn1;

function getCounts() {
    const containers = spawn && spawn.room ? spawn.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType === STRUCTURE_CONTAINER;
        }
    }) : [];

    return {
        creep: Object.keys(Game.creeps).length,
        harvester: _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester').length,
        upgrader: _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader').length,
        builder: _.filter(Game.creeps, (creep) => creep.memory.role === 'builder').length,
        truck: _.filter(Game.creeps, (creep) => creep.memory.type === 'truck').length,
        shovel: _.filter(Game.creeps, (creep) => creep.memory.type === 'shovel').length,
        repairer: _.filter(Game.creeps, (creep) => creep.memory.role === 'repairer').length,
        construction: _.filter(Game.constructionSites, (site) => site.my),
        containers: containers.length
    };
}

function memoryCleanup() {
    for (let creepName in Memory.creeps) {
        if (!Game.creeps[creepName]) {
            delete Memory.creeps[creepName];
        }
    }
}

function createCreep(body, role, type) {
    const creepName = role + Game.time;
    const result = spawn.spawnCreep(body, creepName, {
        memory: { role, type }
    });

    if (result === OK) {
        console.log('Spawning new', role, type, creepName);
    } else {
        console.log('Error spawning new', role, type, result);
    }

    return result;
}

module.exports.spawnHelper = function () {
    let creep = null;
    let counts = getCounts();
    
    memoryCleanup();

    if (!spawn || spawn.spawning) {
        return counts;
    }

    const bodyParts = {
        default: [MOVE, WORK, WORK, CARRY],
        harvester: {
            shovel: [MOVE, WORK, WORK],
            truck: [MOVE, MOVE, CARRY, CARRY]
        },
    };

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

    return counts;
}
