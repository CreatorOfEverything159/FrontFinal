const path = require('path')
const fs = require('fs')
const express = require('express')
const faker = require('faker')

const app = express()
const PORT = 4200
const dataMain = []

for (let i = 0; i < 10; i++) { dataMain.push({}) }
app.use(express.static(path.join(__dirname, 'build')))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const generationData = () => {
    for (let i = 0; i < 10; i++) {
        dataMain[i] = {
            id: faker.address.zipCode(),
            publishDateString: faker.date.recent(),
            ownerLogin: faker.internet.email(),
            bulletinSubject: faker.random.word(),
            bulletinText: faker.random.words(Math.floor(Math.random() * 500) + 20),
            bulletinImages: JSON.parse(fs.readFileSync(path.join(__dirname, `image-sets/image-set-${Math.floor(Math.random() * 100)}.json`), {encoding: 'utf-8'}))
        }
    }
}

generationData()

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`)
})

app.get('/data', async (req, res) => {
    res.status(200)
    res.header("Content-Type", 'application/json')
    generationData()
    res.send(JSON.stringify(dataMain))
})

app.listen(PORT, () => {
    console.log(`Application listening on port ${PORT}!`)
})