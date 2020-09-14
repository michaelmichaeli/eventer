const eventService = require('./event.service')

async function getEvent(req, res) {
    const event = await eventService.getById(req.params.id)
    res.send(event)
}
  
async function getEvents(req, res) {

    // console.log('event.controller: req.query', req.query);
    
    const events = await eventService.query(req.query)
    res.send(events)
}

async function deleteEvent(req, res) {
    //const user = req.session.user;
    //console.log('user', user)
    await eventService.remove(req.params.id)
    res.end()
}

async function updateEvent(req, res) {
    const event = req.body;
    await eventService.update(event)
    res.send(event)
}

async function addEvent(req, res) {
    const event = req.body;
    await eventService.add(event)
    res.send(event)
}

module.exports = {
    getEvent,
    getEvents,
    deleteEvent,
    updateEvent,
    addEvent
}