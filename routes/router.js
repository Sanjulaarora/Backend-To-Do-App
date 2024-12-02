const express = require("express");
const router = new express.Router();
const Users = require("../models/usersSchema");
const Tasks = require("../models/tasksSchema");
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate");

// User SignUp
router.post("/post-users", async(req, res) => {
    const {name, number, email, password, passwordAgain} = req.body;

    if(!name || !number || !email || !password || !passwordAgain) {
        res.status(422).json({error:"fill all the data"});
    };

    try{
        const preuser = await Users.findOne({email:email});

        if(preuser) {
            res.status(422).json({error:"this user already exists"})
        } else if(password !== passwordAgain) {
            res.status(422).json({error:"password and password again do not match"})
        } else {
            const finalUser = new Users({
                name, number, email, password, passwordAgain
            });

            // password hashing process   

            const storeData = await finalUser.save();
            console.log(storeData);
            res.status(201).json(storeData);
        }

    } catch(error) {
        console.log("error" + error.message);
    }
});


//User SignIn
router.post("/sign-in", async(req, res) => {
    const { email, password } = req.body;

    if( !email || !password ){
        res.status(400).json({ error:"fill all the details" });
    }

    try {
        const userSignin = await Users.findOne({email:email});
        if(userSignin) {
           const isMatch = await bcrypt.compare(password, userSignin.password);
           if(!isMatch) {
              res.status(400).json({ error:"Invalid Credentials" });
            } else {
                //token generate
                const token = await userSignin.generateAuthToken();

                //cookie generate
                res.cookie("Todoapp", token, {
                    expires: new Date(Date.now() + 900000),
                    httpOnly: true
                });
                res.status(201).json({ userSignin });
            }

        } else {
            res.status(400).json({ error:"User Do Not Exist"});
        }
    } catch (error) {
        res.status(400).json({ error:"Invalid Credentials"});
    }
});

//User SignOut
router.get("/sign-out", authenticate, async(req, res) => {
    try {
        req.rootUser.tokens = req.rootUser.tokens.filter((currEle) => {
            return currEle.token !== req.token
        });

        res.clearCookie("Todoapp");

        req.rootUser.save();
        res.status(201).json(req.rootUser.tokens);
        console.log("User SignOut");
    } catch (error) {
        console.log("Error for User SignOut");
    }
});

// add new task
router.post("/post-task", async(req, res) => {
    const {id, title, priority, status, startDate, endDate} = req.body;

    if(!id || !title || !priority || !status || !startDate || !endDate) {
        res.status(404).json({error:"Please fill required data"});
    }

    try {
        const preblog = await Tasks.findOne({id:id});

        if(preblog) {
            res.status(404).json({error:"This task is already present"});
        } else {
            const addTask = new Tasks({
               id, title, priority, status, startDate, endDate
            });

            const storeData = await addTask.save();
            console.log(storeData);
            res.status(201).json(storeData);
            
        }

    } catch (error) {
        console.log("error" + error.message)
    }
});


//get all tasks
router.get("/get-tasks", async(req, res) => {
    try {
        const taskdata = await Tasks.find();
        res.status(201).json(taskdata);
        console.log(taskdata);
    } catch(error) {
        res.status(404).json(error);
    }
});


//update tasks
router.put("/edit-task/:id", async(req, res) => {
    try {
       const { id } = req.params;
       const editedTask = await Tasks.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
       });
       if(!editedTask) {
        return res.status(404).json({ error: "Task not found" });
       }
       console.log(editedTask);
       res.status(201).json(editedTask);
    } catch(error) {
      res.status(422).json(error);
    }
});


//delete tasks
router.delete("/deletetask/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const deletedTask = await Tasks.findByIdAndDelete({_id:id});
        
        res.status(201).json(deletedTask);
    } catch (error) {
        res.status(422).json(error);
    }
});


module.exports = router;