const io = require("socket.io")(8900, {
    cors:{
        origin:"http://localhost:3000"
    }
})
let users =[]

const addUser = (userId, socketId)=>{
    !users.some(user=>user.userId===userId)  && 
        users.push({userId, socketId})
}

const removeUser = (socketId)=>{
    users = users.filter(user=>user.sockedId!==socketId)
}

const getUser = (userId)=>{
    console.log(`receiver id is ${userId}`);
    return users.find((user)=>user.userId===userId)
}

io.on("connect", (socket)=>{
    console.log("a user connected");
    //io.emit("welcome", "welcome User to web socket")
    socket.on("addUser", userId=>{
        addUser(userId, socket.id)
        io.emit("getUsers", users)
    })

    socket.on("sendMessage", ({senderId, receiverId, message})=>{
        const user = getUser(receiverId)
        console.log(`user is `, user);
        io.to(user.socketId).emit("getMessage", {
            senderId,
            message
        })
    })

    socket.on("disconnect", ()=>{
        console.log('A user has disconnected');
         removeUser(socket.id)
    })
})

