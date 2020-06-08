const express = require('express')


const app = express();
const connectDB= require('./config/db')
const  path = require('path')
const cors = require('cors')



//connect Database


connectDB()
//Init middleware
app.use(cors())

app.use(express.json())

app.use('/api/users',require('./Routes/api/users'))
app.use('/api/profile',require('./Routes/api/profile'))

app.use('/api/posts',require('./Routes/api/posts'))

app.use('/api/auth',require('./Routes/api/auth'))




app.get('/',(req,res)=>{
    res.send('api runnning')
})

//serve static assests in production

if(process.env.NODE_ENV === 'production'){
    //set static folder 
    app.use(express.static('client/build'));

    app.get('*', (req,res)=>{
        res.sendFile(path.resolve(__dirname, 'client','build','index.html'))
    })

}




const PORT =  process.env.PORT || 5000

app.listen(PORT,()=> console.log(`server started on port ${PORT}`))
