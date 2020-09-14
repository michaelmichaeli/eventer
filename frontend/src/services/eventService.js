import HttpService from './HttpService'
import utilService from './utilService'

const baseUrl = '/event'

export default {
    query,
    save,
    update,
    remove,
    get,
    addUserToEvent,
    removeUserFromEvent,
    addPost,
    removePost
}


async function query(filterBy) {
    if (!filterBy) return HttpService.get(`${baseUrl}`);
    var queryStr;
    if (filterBy.userId) {
        queryStr = `?userId=${filterBy.userId}&isActive=${filterBy.isActive}}`
        return HttpService.get(`${baseUrl}/${queryStr}`);
    }

    queryStr = `?category=${filterBy.category}&title=${filterBy.txt}&sortBy=${filterBy.sortBy}&futureOnly=${filterBy.futureOnly}&price=${filterBy.price}&date=${filterBy.date}&orderBy=${filterBy.orderBy}&isActvie=${filterBy.isActive}`

    return HttpService.get(`${baseUrl}/${queryStr}`);
}

function get(id) {
    return HttpService.get(`${baseUrl}/${id}`)
        .then(event => { return event })
}


function remove(id) {
    return HttpService.delete(`${baseUrl}/${id}`)
}

function save(event) {
    if (!event._id) {
        return HttpService.post(`${baseUrl}`, event)
            .then(savedEvent => { return savedEvent })

    }
    return HttpService.put(`${baseUrl}/${event._id}`, event)
        .then(savedEvent => { return savedEvent })

}


function addUserToEvent(event, user) {
    event.members.unshift(user)
    return HttpService.put(`${baseUrl}/${event._id}`, event)
        .then(savedEvent => { return savedEvent })

}

function removeUserFromEvent(event, userId) {
    const memeberIdxToRemove = event.members.findIndex(member => member._id === userId)
    event.members.splice(memeberIdxToRemove, 1)
    return HttpService.put(`${baseUrl}/${event._id}`, event)
        .then(savedEvent => { return savedEvent })

}


function addPost(event, user, text) {
    const post = {
        _id: utilService.makeId(6),
        createdAt: Date.now(),
        author: user,
        text
    }
    event.posts.unshift(post)
    return HttpService.put(`${baseUrl}/${event._id}`, event)
        .then(savedPost => { return savedPost })

}

function removePost(event, postId) {
    const postIdxToRemove = event.posts.findIndex(post => post._id === postId)
    event.posts.splice(postIdxToRemove, 1)
    return HttpService.put(`${baseUrl}/${event._id}`, event)
        .then(savedEvent => {
            return savedEvent
        }
        )
}

function update(event, value, field) {
    event[field] = value
    return HttpService.put(`${baseUrl}/${event._id}`, event)
        .then(saveEvent => { return saveEvent })

}






