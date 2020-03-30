'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require ('cors');
const errorHandler = require ('errorhandler');
const rsa = require('rsa_module');

const port = 3010;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(cors());
app.use(errorHandler());

const crypto = new rsa.rsa(1024);
let key;
let counter;
let keyArray = [];
let date = new Date();

app.post('/postkey', function (req, res){
    let key;
    counter ++;
    console.log('***** seq: ' + counter + ' Post key request *****');
    console.log('User : ' + req.body.user);
    console.log('Key  : ' + req.body.key);
    console.log('Time : ' + date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate() +
    ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds());
    if (typeof(req.body.user) != 'undefined' || typeof(req.body.key) != 'undefined') {
        key = ({
            user: req.body.user,
            key: req.body.key,
            timestamp: date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
        });
        keyArray.push(key);
        res.status(200).json(key);
    }
    else{
        console.log('Bad TTP request');
        res.status(400).json({status: 400, response: 'Bad TTP request'})
    }
});

app.get('/getkey', function(req, res){
    let index = 0;
    let userExist = false;
    counter ++;
    console.log('***** seq: ' + counter + ' Get key request *****');
    console.log('User: ' + req.query.user);
    if (typeof(keyArray[index]) != 'undefined'){
        while(index < keyArray.length){
            if (req.query.user === keyArray[index].user){
                console.log('User: ' + keyArray[index].user);
                console.log('Key : ' + keyArray[index].key);
                console.log('Time: ' + keyArray[index].timestamp);
                res.status(200).json(keyArray[index]);
                keyArray.splice(index, 1);
                userExist = true;
            }
            index ++;
        }
        if (!userExist){
            console.log('User not found in TTP');
            res.status(404).json({status: 404, response: 'User not found in TTP'});
        }
    }
    else{
        console.log('Key array undefined in TTP.');
        res.status(409).json({status: 409, response: 'Key array undefined in TTP.'});
    }
});

app.listen(port, function(req, res){
    counter = 0;
    console.log('TTP started at: ' + port);
});
module.exports = app;
