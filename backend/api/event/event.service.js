
const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    remove,
    add,
    update
}



async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    const sortCriteria = {}
    const descCritiria = { ...criteria, description: new RegExp(`${filterBy.title}`, 'i') }
    delete descCritiria.title
    if (filterBy.sortBy) sortCriteria[filterBy.sortBy] = parseInt(filterBy.orderBy)
    const collection = await dbService.getCollection('event')
    try {
        var events = await collection.find({$or: [criteria, descCritiria]}).sort(sortCriteria).toArray();
        return events
    } catch (err) {
        console.log('ERROR: cannot find events')
        throw err;
    }
}

async function getById(eventId) {
    const collection = await dbService.getCollection('event')
    try {
        const event = await collection.findOne({ "_id": ObjectId(eventId) })
        return event
    } catch (err) {
        console.log(`ERROR: while finding event ${eventId}`)
        throw err;
    }
}


async function remove(eventId) {
    const collection = await dbService.getCollection('event')
    try {
        await collection.deleteOne({ "_id": ObjectId(eventId) })
    } catch (err) {
        console.log(`ERROR: cannot remove event ${eventId}`)
        throw err;
    }

}

async function update(event) {
    const collection = await dbService.getCollection('event')
    event._id = ObjectId(event._id);

    try {
        await collection.replaceOne({ "_id": event._id }, { $set: event })
        return event
    } catch (err) {
        console.log(`ERROR: cannot update event ${event._id}`)
        throw err;
    }
}

async function add(event) {
    delete event._id; //to remove the blank id thae messes with mongnoDB
    const collection = await dbService.getCollection('event')
    try {
        await collection.insertOne(event);
        return event;
    } catch (err) {
        console.log(`ERROR: cannot insert event`)
        throw err;
    }
}

function _buildCriteria(filterBy) {
    const timeNow = Date.now() / 1000
    const criteria = {};
    criteria.isActive = true

    if (filterBy.title) {
        criteria.title = new RegExp(`${filterBy.title}`, 'i');
    };

    if (filterBy.category) {
        criteria.category = filterBy.category;
    };

    if (filterBy.futureOnly === 'true') {
        criteria.startAt = { $gt: timeNow }
    }

    if (filterBy.userId) {
        const userIdStr = 'createdBy._id'
        criteria[userIdStr] = filterBy.userId
    };

    if (filterBy.price) {
        criteria.price = { $lte: parseInt(filterBy.price) }
    };

    if (filterBy.date) {
        criteria.startAt = { $lte: timeNow + filterBy.date * 24 * 60 * 60 , $gt: timeNow }
    };

    if (filterBy.isActive) {
        delete criteria.isActive 
    };

    return criteria
}

