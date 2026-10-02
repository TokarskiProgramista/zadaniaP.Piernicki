const express = require('express')
const fs = require('fs')

const app = express()
const port = 4555

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    let zadania = JSON.parse(fs.readFileSync('data.json'))

    if (req.query.filter == 'active')
        zadania = zadania.filter(z => !z.ukonczone)

    if (req.query.filter == 'completed')
        zadania = zadania.filter(z => z.ukonczone)

    const wszystkie = JSON.parse(fs.readFileSync('data.json'))

    res.render('index', {
        zadania,
        ukonczone: wszystkie.filter(z => z.ukonczone).length,
        nieukonczone: wszystkie.filter(z => !z.ukonczone).length
    })
})

app.post('/dodaj', (req, res) => {
    const zadania = JSON.parse(fs.readFileSync('data.json'))

    zadania.push({
        id: Date.now(),
        tytul: req.body.tytul,
        ukonczone: false,
        data: new Date().toLocaleString()
    })

    fs.writeFileSync('data.json', JSON.stringify(zadania))
    res.redirect('/')
})

app.post('/ukoncz/:id', (req, res) => {
    const zadania = JSON.parse(fs.readFileSync('data.json'))
    const zadanie = zadania.find(z => z.id == req.params.id)

    zadanie.ukonczone = !zadanie.ukonczone

    fs.writeFileSync('data.json', JSON.stringify(zadania))
    res.redirect('/')
})

app.post('/edytuj/:id', (req, res) => {
    const zadania = JSON.parse(fs.readFileSync('data.json'))
    const zadanie = zadania.find(z => z.id == req.params.id)

    zadanie.tytul = req.body.tytul

    fs.writeFileSync('data.json', JSON.stringify(zadania))
    res.redirect('/')
})

app.listen(port, () => console.log(`http://localhost:${port}`))