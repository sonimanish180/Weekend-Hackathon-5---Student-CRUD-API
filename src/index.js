const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const port = 8080;
app.use(express.urlencoded());
const Joi = require('joi');

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// your code goes here//
const students = require('./InitialData');

const indexId = 7;

app.get('/api/student', (req, res) => {
    res.status(200).send(students);
});

app.get('/api/student/:id', (req, res) => {
    const id = req.params.id;

    const student = students.find(student => student.id === parseInt(id));

    if(!student) {
        res.status(404).send(`Student with id ${id} not found!`);
        return;
    }

    res.status(200).send(student);
});

app.post('/api/student', (req, res) => {
    
    // res.setHeader('Content-type', 'application/x-www-form-urlencoded');

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

    indexId = indexId+1;

    const student = {
        id : indexId,
        name : req.body.name,
        currentClass : req.body.currentClass,
        division : req.body.division
    }

    students.push(student);

    console.log(req.body);
    res.status(200).send(student);
});

app.put('/api/student/:id', (req, res) => {
    
    // res.writeHead({'content-type':'application/x-www-form-urlencoded'});
    res.setHeader('Content-type', 'application/x-www-form-urlencoded');

    const id = req.params.id;
    const schema = Joi.object({
        name: Joi.string().min(1),
        currentClass: Joi.number(),
        division :  Joi.string().min(1)   
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

    
    if (!student) {
        res.status(400).send("Student Id is invalid");
        return;
    }

    
    if (req.body.name) {
        student.name = req.body.name;
    }

    if (req.body.currentClass) {
        student.currentClass = req.body.currentClass;
    }

    if (req.body.division) {
        student.division = req.body.division;
    }
       

    console.log(student);
    res.status(200).send(student);
    
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

    res.status(200).send(student);
    
});

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;   