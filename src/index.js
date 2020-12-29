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

let indexId = 7;

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

    indexId = indexId+1;
    
    let student = {
        id: indexId,
        ...req.body,
        currentClass: parseInt(req.body.currentClass)
    }

    if(!student.name || !student.currentClass || !student.division){
        res.status(400).send();
    }

    students.push(student);

    let id = student.id;

    res.json({"id" : id});
});

app.put('/api/student/:id', (req, res) => {

    if (!id) {
        res.status(404).send('Student Id is Required.!');
        return;
    }

    let student = students.find(student => student.id === parseInt(id));

    
    if (!student) {
        res.status(400).send("Student Id is invalid");
        return;
    }

    
    if (req.body.name) {
        if(req.body.name === ""){
            res.status(400).send();
            return;
        }
        student.name = req.body.name;
    }

    if (req.body.currentClass) {
        if(!Number.isInteger(req.body.currentClass)){
            res.status(400).send();
            return;
        }
        student.currentClass = Number(req.body.currentClass);
    }

    if (req.body.division) {
        if(req.body.division.length !== 1 || !Number.isInteger(req.body.division)) {
            res.status(400).send();
            return;
        }
        student.division = req.body.division;
    }
       

    console.log(student);
    res.send(student.name);
    
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