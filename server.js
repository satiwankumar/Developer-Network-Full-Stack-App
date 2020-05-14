const express = require('express')

const app = express();
const connectDB= require('./config/db')

//connect Database


connectDB()
//Init middleware

app.use(express.json())


app.use('/api/users',require('./Routes/api/users'))
app.use('/api/profile',require('./Routes/api/profile'))

app.use('/api/posts',require('./Routes/api/posts'))

app.use('/api/auth',require('./Routes/api/auth'))




app.get('/',(req,res)=>{
    res.send('api runnning')
})

const PORT =  process.env.PORT || 5000

app.listen(PORT,()=> console.log(`server started on port ${PORT}`))
