const express = require("express");
// const sql = require("mssql/msnodesqlv8"); // windows authentication
const sql = require("mssql");
const fs = require('fs');

const app = express();
app.use(express.json());

const sql_statements_folder = "src/sql_statements/";

// // SQL Server configuration for windows authentication 
// // SQL Server configuration
// var config = {
//     // "user": "  ", // Database username
//     // "password": "  ", // Database password
//     "server": "CHRISTINE-LAPTO\\SQLEXPRESS", // Server IP address
//     "database": "backend_nodejs", // Database name
//     "options": {
//         "encrypt": false, // Disable encryption
//         "trustedConnection": true
//     },
//     driver: "msnodesqlv8",
// }

// Connect to SQL Server

var config = {
    user: "sa",
    password: "P@ssw0rd12345",
    server: "localhost",
    database: "backend_nodejs",
    options: {
        encrypt: false,
        trustServerCertificate: true
    },
    port: 1433,
};

sql.connect(config, err => {
    if (err) {
        throw err;
    }
    console.log("Connection Successful!");
});


// NOTE: TO GET THE LIST OF STUDENT
app.get("/list-student", async (request, response) => {
    var methodName = "@@ /LIST-STUDENT - ";
    console.log(methodName + "start ...");

    var sqlStatement = fs.readFileSync(sql_statements_folder + "list-student.sql", "utf-8");
    console.log(methodName + "sqlStatement: ", sqlStatement);

    await new sql.Request()
    .query(sqlStatement)
    .then(result => {
        response.send(result); // Send query result as response
        console.dir(result);
    })
    .catch(err => {
        console.error(methodName + "Error executing query:", err);
        throw err;
    });
});


//NOTE: TO ADD STUDENT INTO DB
app.post("/add-student", async (request, response) => {
    var isActive = request.body.isActive? 1: 0;
    var params = request.body;

    var methodName = "@@ /ADD-STUDENT - ";
    console.log(methodName + "start ...");

    // Validation
    if (!params.name || !params.email) {
        console.error(methodName + "Invalid student data");
        response.status(400).send({ error: "Invalid student data" });
        return;
    }

    var sqlStatement = fs.readFileSync(sql_statements_folder + "add-student.sql", "utf-8");
    console.log(methodName + "sqlStatement:", sqlStatement);

    await new sql.Request()
    .input("name", sql.NVarChar, params.name)
    .input("isActive", sql.Bit, isActive)
    .input("email", sql.NVarChar, params.email)
    .query(sqlStatement)
    .then(result => {
        response.send(result); // Send query result as response
        console.dir(result);
    })
    .catch(err => {
        console.error(methodName + "Error executing query:", err);
        throw err;
    });

});


//NOTE: TO UPDATE STUDENT FROM DB
app.post("/update-student", async (request, response) => {
    var isActive = request.body.isActive? 1: 0;
    var params = request.body;

    var methodName = "@@ /UPDATE-STUDENT - ";
    console.log(methodName + "start ...");

    var sqlStatement = fs.readFileSync(sql_statements_folder + "update-student.sql", "utf-8");
    console.log(methodName + "sqlStatement:", sqlStatement);

    await new sql.Request()
    .input("id", sql.UniqueIdentifier, params.id)
    .input("name", sql.NVarChar, params.name)
    .input("isActive", sql.Bit, isActive)
    .input("email", sql.NVarChar, params.email)
    .query(sqlStatement)
    .then(result => {
        response.send(result); // Send query result as response
        console.dir(result);
    })
    .catch(err => {
        console.error(methodName + "Error executing query:", err);
        throw err;
    });
});


//NOTE: TO DELETE STUDENT WITH SELECTED ID
app.delete("/delete-student", async (request, response) => {
    var params = request.body;

    var methodName = "@@ /DELETE-STUDENT - ";
    console.log(methodName + "start ...");

    var sqlStatement = fs.readFileSync(sql_statements_folder + "delete-student.sql", "utf-8");
    console.log(methodName + "sqlStatement:", sqlStatement);

    await new sql.Request()
    .input("id", sql.UniqueIdentifier, params.id)
    .query(sqlStatement)
    .then(result => {
        response.send(result); // Send query result as response
        console.dir(result);
    })
    .catch(err => {
        console.error(methodName + "Error executing query:", err);
        throw err;
    });
});



//NOTE: TO REGISTER STUDENTS UNDER THE NAME OF TEACHER INTO DB OF COMMONSTUDENTS
app.post("/api/register", async (request, response) => {
    var params = request.body;
    var methodName = "@@ /API/REGISTER - ";
    console.log(methodName + "start ...");

    var sqlStatement = fs.readFileSync(sql_statements_folder + "app/register.sql", "utf-8");
    console.log(methodName + "sqlStatement:", sqlStatement);
    console.log(methodName + "params:", params);

    await new sql.Request()
    .input("teacher_email", sql.NVarChar(200), params.teacher)
    .input("students_email_list", sql.NVarChar(sql.MAX), params.students) 
    .query(sqlStatement)
    .then(result => {
        response.status(204).send();
        console.dir(result);
    })
    .catch(err => {
        console.error("Error executing query:", err);
        response.status(500).send('Internal Server Error')
    });
});


//NOTE: TO GET UNIQUE STUDENTS AND COMMONSTUDENTS FOR ONE TEACHER,
//      AND COMMONSTUDENTS FOR MULTIPLE TEACHER
app.get("/api/commonstudents", async (request, response) => {
    var params = request.query;
    var methodName = "@@ /API/COMMONSTUDENTS - ";
    console.log(methodName + "start ...");

    var sqlStatement = fs.readFileSync(sql_statements_folder + "app/commonstudents.sql", "utf-8");
    console.log(methodName + "sqlStatement:", sqlStatement);
    console.log(methodName + "params:", params);

    // check type of teacher
    // if stringify, then inserted into list
    var teacherList = [];
    if (typeof params.teacher === 'string')
        teacherList.push(params.teacher);
    else
        teacherList = params.teacher;
    

    //convert array into XML format
    let xmlData = '<teachers>'; 
    teacherList.forEach(email => xmlData += '<email>'+email+'</email>');
    xmlData += '</teachers>';
    console.log(methodName + "xmlData:", xmlData);

    await new sql.Request()
    .input("teacher_email_xml", sql.Xml, xmlData)
    .query(sqlStatement)
    .then(result => {
        response.status(200).send(result.recordset);
        console.dir(result);
    })
    .catch(err => {
        console.error("Error executing query:", err);
        response.status(500).send('Internal Server Error')
    });
});


//NOTE: TO SUSPEND A SPECIFIC STUDENT AND MAKE SURE THAT SUSPECTED STUDENT
//      ARE NOT MORE IN COMMONSTUDENT AND STUDENT ISACTIVE STUDENT IS 0
app.post("/api/suspend", async (request, response) => {
    var params = request.body;
    var methodName = "@@ /API/SUSPEND - ";
    console.log(methodName + "start ...");

    var sqlStatement = fs.readFileSync(sql_statements_folder + "app/suspend.sql", "utf-8");
    console.log(methodName + "sqlStatement:", sqlStatement);
    console.log(methodName + "params:", params);
    
    await new sql.Request()
    .input("student", sql.VarChar(200), params.student)
    .query(sqlStatement)
    .then(result => {
        response.status(204).send();
        console.dir(result);
    })
    .catch(err => {
        console.error("Error executing query:", err);
        response.status(500).send('Internal Server Error')
    });
});


//NOTE: TO RETRIEVE A LIST OF STUDENT EMAILS [NOT SUSPECTED]
//      AND EMAIL @MENTIONED IN EMAIL
app.post("/api/retrievefornotifications", async (request, response) => {
    var params = request.body;
    var methodName = "@@ /API/RETRIEVE-FOR-NOTIFICATIONS - ";
    console.log(methodName + "start ...");

    var sqlStatement = fs.readFileSync(sql_statements_folder + "app/retrieve-for-notification.sql", "utf-8");
    console.log(methodName + "sqlStatement:", sqlStatement);
    console.log(methodName + "params:", params);
    
    await new sql.Request()
    .input("teacher_email", sql.VarChar(200), params.teacher)
    .input("notification", sql.NVarChar(sql.MAX), params.notification)
    .query(sqlStatement)
    .then(result => {
        response.status(200).send(result);
        console.dir(result);
    })
    .catch(err => {
        console.error("Error executing query:", err);
        response.status(500).send('Internal Server Error')
    });
});

// Start the server on port 3000
app.listen(3000, () => {
    console.log("Listening on port 3000...");
});