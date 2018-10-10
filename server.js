const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex= require ('knex')

//create a const for a knex lib to use and configure
const db = knex({
        client: 'pg', //postgres client
        connection: { //connection params
            host : '127.0.0.1',
            user : 'eargo',
            password : '12345',
            database : 'smartbrain'
        }
});

const app = express();

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
            
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bannanas',
            entries: 0,
            joined: new Date()
            
        }
    ],
    login:[
        {
            id: '987',
            hash: '',
            email: 'john@gmail.com'
        }
    ]
}

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req,res) => { 
    res.send(database.users);
})

app.post('/signin',(req,res) => {
{ /*   // Load hash from your password DB.
    bcrypt.compare("apples", '$2a$10$6iyg1jxlvel3AqcvOz3.ru/3iZgTZqWh4tSk/JBFyfzDtZcKajh02', function(err, res) {
    // res == true
        console.log('first guess',res)
    });
    bcrypt.compare("veggies", '$2a$10$6iyg1jxlvel3AqcvOz3.ru/3iZgTZqWh4tSk/JBFyfzDtZcKajh02', function(err, res) {
    // res = false
        console.log('second guess', res)
    });*/}



    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
            res.json('success');
        } else {
            res.status(400).json('error logging in');
        }
})

app.post('/register', (req,res) => { 
    const { email, name, password } = req.body;
    //put a new entry in users table of a database
    db('users')
        .returning('*') //set a return value
        .insert([{ //create an object to put into table
        email: email,
        name: name,
        joined: new Date()
    }])//then get user value from a new entry for logging
        .then(user => {
            res.json(user[[0]]);
        })//catch an error for a duplicate email
        .catch(err => res.status(400).json('unable_to_register'))
})
app.get('/profile/:id',(req,res) => {
/*get an id from query*/
    const { id } = req.params
    //select a user from database by id
    db.select('*').from('users').where('id','=',id)
        /*then check if user with this id exists*/
        .then(user => {
            /*if user-array have non zero length then it exists and returns an array*/
            if (user.length) {
                res.json(user[[0]])
                /*else error 400 and message*/
            } else {
                res.status(400).json('not_found')
            }

    })
        .catch(err => res.status(400).json('error_getting_user'))

})

app.put('/image', (req,res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
           found = true;
           user.entries++;
           return  res.json(user.entries);
        }
    })
    if (!found) {
        res.status(400).json('not found');
    }
})


/*password encryption part*/ 








app.listen(3000,()=>{
    console.log('app is running on port 3000');
})

/*
write down all routes on a server (startpoints on a frontend and endpoints on a backend)
/ --> res = this is working - DONEEE
/signin --> POST = success/fail - DONEEE
/register --> POST = return new created user, new 'user' JSON object - DONEEEEE
/profile/:userId --> GET = user - DONEEEEEE
/image --> PUT --> "user" rank count updated - DONEEEEE

*/