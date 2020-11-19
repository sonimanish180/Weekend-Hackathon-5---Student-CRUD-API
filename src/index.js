const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080
app.use(express.urlencoded());
const Joi = require('joi');

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// your code goes here
const students = require('./InitialData');

app.get('/api/student', (req, res) => {
    res.send(students);
});

app.get('/api/student/:id', (req, res) => {
    const id = req.params.id;

    const student = students.find(student => student.id === parseInt(id));

    if(!student) {
        res.status(404).send(`Student with id ${id} not found!`);
        return;
    }

    res.send(student);
});

app.post('/api/student', (req, res) => {
    const schema = Joi.object({
        name: Joi.string().min(1).required(),
        currentClass: Joi.number().required(),
        division :  Joi.string().min(1).required()    
    })

    const validationObject = schema.validate(req.body);

    if (validationObject.error){
        res.status(400).send(validationObject.details[0].message);
        return;
    }

    const student = {
        id : students.length + 1,
        name : req.body.name,
        currentClass : req.body.currentClass,
        division : req.body.division
    }

    students.push(student);

    console.log(req.body);
    res.send(student);
});

app.put('/api/student/:id', (req, res) => {
    const id = req.params.id;
    const schema = Joi.object({
        name: Joi.string().min(1).required(),
        currentClass: Joi.number().required(),
        division :  Joi.string().min(1).required()    
    })

    const validationObject = schema.validate(req.body);

    if (!id) {
        res.status(404).send('Student Id is Required.!');
        return;
    }

    if (validationObject.error) {
        res.status(400).send(validationObject.error.details[0].message);
        return;
    }

    let student = students.find(student => student.id === parseInt(id));

    student.name = req.body.name;
    student.currentClass = req.body.currentClass;
    student.division = req.body.division;

    console.log(student);

    res.send(student);
    
});

app.delete('/api/student/:id', (req, res) => {
    const id = req.params.id;


    if (!id) {
        res.status(404).send('Student Id is Required.!');
        return;
    }

    const studentIndex = students.findIndex(student => student.id === parseInt(id));
    
    if (studentIndex === -1) {
        res.status(404).send('Student not found!');
        return;
    }

    const student = students[studentIndex];

    students.splice(studentIndex, 1);

    res.send(student);
    
});

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;   