const express = require('express')
const app = express()
const port = process.env.PORT || 3000

//main (online-market)
app.get('/', (req, res) => {
    res.type('text/plain')
    res.send('Meadowlark Travel');
})

//textbook

//online-market
//...

// Пользовательская страница 500
app.use((err, req, res, next) => {
    console.error(err.message)
    res.type('text/plain')
    res.status(500)
    res.send('500 — Ошибка сервера')
})
// Пользовательская страница 404
app.use((req, res) => {
    res.type('text/plain')
    res.status(404)
    res.send('404 — Не найдено')
})

app.listen(port, () => console.log(
    `Express запущен на http://localhost:${port}; ` +
    `нажмите Ctrl+C для завершения.` ))