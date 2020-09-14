const express = require('express')
// const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { getEvent, getEvents, deleteEvent, updateEvent, addEvent } = require('./event.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/',getEvents)
router.get('/:id',getEvent)
router.post('/',addEvent)
router.put('/:id', updateEvent)
router.delete('/:id',deleteEvent)

//example for using auth middlwware
//router.delete('/:id', requireAuth, requireAdmin, deleteToy)



module.exports = router