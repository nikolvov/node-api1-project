// IMPORTS AT THE TOP

const express = require('express');
const User = require('./users/model');

// INSTANCE OF EXPRESS APP

const server = express();

// GLOBAL MIDDLEWARE

server.use(express.json());

// ENDPOINTS

// [GET]    /             (Hello World endpoint)
server.get('/', (req, res) => {
    console.log('received a request!')
    res.status(200).json({ message: 'received a request!'});
})

// | POST   | /api/users     | Creates a user using the information sent inside the `request body`.                                   |

// how to make it give error if no bio or name

// server.post('/api/users', (req, res) => {
//     User.insert(req.body)
//         .then(result => {
//             if(result == null) {
//                 res.status(400).json({ message: "Please provide name and bio for the user" });
//                 return
//         }
//             res.status(201).json(result);
//         })
//         .catch(err => {
//             res.status(500).json({ message: "There was an error while saving the user to the database" });
//         })
// })

server.post("/api/users", (req, res) => {
    const newUser = req.body
    if(!newUser.name || !newUser.bio){
        res.status(400).json({
            message: "Please provide name and bio for the user"
        })
    }else{
        User.insert(newUser)
        .then(user => {
            res.json(user)
        })
        .catch(err => {
            res.status(500).json({ message: "There was an error while saving the user to the database" })
        })
    }
})

// | GET    | /api/users     | Returns an array users.                                                                                |
server.get("/api/users", (req, res) => {
    User.find()
        .then(users => {
            console.log(users)
            res.status(200).json(users)
        })
        .catch(err => {
            res.status(500).json({message: "The users information could not be retrieved"})
        })
})

// | GET    | /api/users/:id | Returns the user object with the specified `id`.                                                       |
server.get('/api/users/:id', (req, res) => {
    User.findById(req.params.id)
        .then(result => {
            if(result == null) {
                res.status(404).json({ message: "The user with the specified ID does not exist" });
                return;
            }
            res.json(result);
        })
        .catch(err => {
            res.status(500).json({ message: "The user information could not be retrieved" })
        })
})

// | DELETE | /api/users/:id | Removes the user with the specified `id` and returns the deleted user.                                 |
server.delete('/api/users/:id', (req, res) => {
    User.remove(req.params.id)
        .then(result => {
            if(result == null) {
                res.status(404).json({ message: "The user with the specified ID does not exist" });
                return;
            }
            res.json(result);
        })
        .catch(err => {
            res.status(500).json({ message: "The user could not be removed" });
        })
})

// | PUT    | /api/users/:id | Updates the user with the specified `id` using data from the `request body`. Returns the modified user |

//cant figure this one out

server.put("/api/users/:id", async (req, res) => {
    const {id} = req.params
    const changes = req.body
    try{
        if(!changes.name || !changes.bio){
            res.status(400).json({
                message: "Please provide name and bio for the user"
            })
        }else{
            const updatedUser = await
            User.update(id, changes)
            if(!updatedUser){
                res.status(404).json({
                    message: "The user with the specified ID does not exist"
                })
            }else{
                res.status(200).json(updatedUser)
            }
        }
    }catch(err){
        res.status(500).json({message: "The user information could not be modified." })
    }
})

module.exports = server; // EXPORT YOUR SERVER instead of {}
