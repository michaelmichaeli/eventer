
module.exports = connectSockets

function connectSockets(io) {
    io.on('connection', socket => {
        socket.on('newEventPost', event => {
            socket.broadcast.to(socket.myEvent).emit('newEventPost', event)
        })

        socket.on('removeEventPost', event => {
            socket.broadcast.to(socket.myEvent).emit('removeEventPost', event)
        })

        socket.on('memberLeave', event => {
            socket.broadcast.to(socket.myEvent).emit('memberLeave', event)
        })

        socket.on('memberJoin', event => {
            socket.broadcast.to(socket.myEvent).emit('memberJoin', event)
        })

        socket.on('event got updated', payload => {
            socket.broadcast.to(payload.userId).emit('event got updated', payload);

        })

        socket.on('new event created', payload => {
            socket.broadcast.to(payload.userId).emit('new event created', payload);

        })

        socket.on('user joined event', payload => {
            socket.broadcast.to(payload.userId).emit('user joined event', payload);
        })

        socket.on('user left event', payload => {
            socket.broadcast.to(payload.userId).emit('user left event', payload);
        })

        socket.on('user rank', payload => {
            socket.broadcast.to(payload.userId).emit('user rank', payload);
        })

        socket.on('user follow', payload => {
            socket.broadcast.to(payload.userId).emit('user follow', payload);
        })

        socket.on('user unfollow', payload => {
            socket.broadcast.to(payload.userId).emit('user unfollow', payload);
        })

        socket.on('viewEventDetails', eventId => {
            if (socket.myEvent) {
                socket.leave(socket.myEvent)
            }
            socket.join(eventId)
            socket.myEvent = eventId;
        })

        socket.on('userLogin', userId => {
            socket.currUser = userId;
            socket.join(socket.currUser)
        })
    })
}