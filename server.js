const express = require("express");
const {open} = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const { request } = require("http");
const cors=require("cors")

const dbpath=path.join(__dirname,"todostable.db")

const app=express()

app.use(express.json())
app.use(cors())

let db;

initializeDBandServer= async ()=>{
    try{
        db= await open({
            filename:dbpath,
            driver:sqlite3.Database
        })
        app.listen(5000,()=>{
            console.log("server running at http://localhost:5000/")
        })

    }catch(e){
        console.log(`DB Error: ${e.message}`)
        process.exit(1)

    }
}

initializeDBandServer()

app.post("/todos/", async (request,response)=>{
    const {taskname,status}=request.body
    const sqlQuery=`
    insert into todo
    (taskName,status) 
    values ('${taskname}','${status}');
    `;
    const data= await db.run(sqlQuery)
    response.send(data)
})

app.get("/",async (request,response)=>{
    const sqlQuery=`
    select * from todo
    `; 
    const data =await db.all(sqlQuery)
    response.send(data)

})

app.delete("/todos/:todoId/",async (request,response)=>{
    const {todoId}=request.params
    const sqlQuery=`
    delete from todo where id=${todoId};
    `;
    const data= await db.run(sqlQuery)
    response.send("deleted successfully")
})

app.put("/todos/:todoId/",async (request,response)=>{
    const {todoId}=request.params 
    const {status}=request.body
    console.log(status)
    
    const sqlQuery=`
    Update todo set status='${status}'
    where id=${todoId};
    `;
    const data= await db.run(sqlQuery)
    response.send("updated successfully")
})