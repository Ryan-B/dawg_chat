//Express
var express = require('express');
var app = express();

//Static Folder
app.use(express.static(__dirname+'/static'));
var port = process.env.PORT || 1991;
var server = app.listen(port, function(){
	console.log("Hello at 1991");
});
var io = require('socket.io').listen(server);

var users = [];

io.sockets.on('connection', function(socket) {
	console.log("Socket connected with id: ", socket.id);

	socket.on('newUser', function(data){
		users.push({ 
			name: data.name, 
			socket_id: socket.id
		})
		// console.log(users);
		io.emit('updateUserList', users);
	});

	socket.on('newMessage', function(data){
		for(index in users){
			if(users[index].socket_id === socket.id){
				io.emit('addMessage', {
					message: "<p>"+users[index].name + ": "+"<span>"+ data.message+"</span></p>"
				})
				break;
			}
		}
	})
			

	socket.on('disconnect', function() {
		console.log("Socket disconnected with id: ", socket.id);
		for(index in users){
			if(users[index].socket_id === socket.id){
				users.splice(index, 1);
				io.emit('updateUserList', users);
				break;
			}
		}
	});
});
