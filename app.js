const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const { urlencoded } = require("body-parser");
const e = require("express");

const app = express();
app.set('view engine', 'ejs');
mongoose.connect("mongodb://localhost:27017/myhealthdeskDB");


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname));


const bioSchema = {
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    address: String,
    contact: {
        type: Number,
        required: true,
        unique: true
    },
    registration: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}

const bioSchema1 = {
    name: {
        type: String,
        required: true
    },
    blood: {
        type: String,
        required: true
    },
    address: String,
    birth: Date ,
    contact: {
        type: String,
        required: true,
        unique: true
    }
}

const bioSchema2 = {
    currdate: Date,
    test: String,
    result: String,
    cont: Number
}

const HealthDesk = new mongoose.model("HealthDesk",bioSchema);
const Userdatabase = new mongoose.model("Userdatabase",bioSchema1);
const Checkdetail = new mongoose.model("Checkdetail",bioSchema2);

app.get("/",function(req,res)
{
    res.sendFile(__dirname+"/index.html"); 
});

app.post("/",function(req,res)
{
    const Hospitaldetail = new HealthDesk({
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        registration: req.body.id,
        contact: req.body.contactno,
        password: req.body.password
    });
    Hospitaldetail.save();
    res.redirect("/");
});

app.post("/UserDatabase",function(req,res)
{
    const Userdetail = new Userdatabase({
        name: req.body.name,
        blood: req.body.bloodgrp,
        address: req.body.address,
        birth: req.body.dob,
        contact: req.body.contactno
    });
    Userdetail.save();
    res.send("Succesfully Saved the details of patient !!!");
});

app.post("/Checkdetail",function(req,res)
{
    const Userdetail = new Checkdetail({
        currdate: req.body.gk1,
        test: req.body.gk2,
        result: req.body.gk3,
        cont: req.body.gk4
    });
    Userdetail.save();
    res.send("Succesfully added the Checkup Details...");
});

app.post("/hospitallogin",function(req,res)
{
    const registrationid = req.body.rid;
    const password = req.body.hpassword;
    HealthDesk.find(function(err,items){
        if(err)
        console.log(err);
        else 
        {
            items.forEach(function(element)
            {
                if(element.registration === registrationid && element.password == password)
                {
                    res.render("main",{
                        name: element.name,
                        email: element.email,
                        contact: element.contact,
                        rid: element.registration,
                        address: element.address
                    });
                }
                else 
                 res.send("invalid password");
            });
        }
    }); 
});

app.post("/userlogin",function(req,res)
{
    const usernumber = req.body.uid;
    const arr = [];
    Checkdetail.find({},function(err,founditems)
    {
        if(founditems.length === 0)
        {
            Item.insertMany(arr,function(err)
            {
                if(err)
                    console.log(error);
                else 
                    console.log("Successfully saved..");
            });
            res.redirect("/userlogin");
        }
        else 
        {
            founditems.forEach(function(elem)
            {
                arr.push(elem.currdate+" : "+"{Test : "+elem.test+"}-------"+"{Result : "+elem.result+"}");
            });
        }
    });

    Userdatabase.find(function(err,items){
        if(err)
        console.log(err);
        else 
        {
            items.forEach(function(element)
            {
                if(element.contact === usernumber)
                {
                    res.render("user",{
                        name: element.name,
                        blood: element.blood,
                        address: element.address,
                        dob: element.birth,
                        contact: element.contact,
                        addlists: arr
                    });
                }
                else 
                 res.send("invalid password");
            });
        }
    }); 
});

app.post("/Userdb",function(req,res)
{
    const phone = req.body.patientno;
    Userdatabase.find(function(err,items1){
        if(err)
        console.log(err);
        else 
        {
            items1.forEach(function(element)
            {
                if(element.contact === phone)
                {
                    res.render("hospitaluser",{
                        name: element.name,
                        blood: element.blood,
                        address: element.address,
                        dob: element.birth,
                        contact: element.contact    
                    }); 
                }
                else
                return res.send("plzz do register first....")
            });
        }
    });
});


app.listen(3000,function(req,res)
{
    console.log("My HealthDesk Server started...")
});