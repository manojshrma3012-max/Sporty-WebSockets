import express from 'express'
const app = express()
app.use(express.json())
const port = 7002

app.get('/', (request, response) => {
    console.log(request.url)
    response.send('Hello from Express')
})

app.listen(port, () => {
    console.log(`Express server started at http://localhost:${port}/`)
})
