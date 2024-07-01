const http = require('http')
const fs = require('fs')
const port = process.env.PORT || 3000

function serveStaticFile(res, path, contentType, responseCode = 200) {
    fs.readFile(__dirname + path, (err, data) => {
        if(err) {
            res.writeHead(500, { 'Content-type': 'text/plain' })
            return res.end('500 — Внутренняя ошибка')
        }
        res.writeHead(responseCode, { 'Content-type': contentType })
        res.end(data)
    })
}

const server = http.createServer((req,res) => {
    // Приводим URL к единому виду, удаляя
    // строку запроса, необязательную косую черту
    // в конце строки и переводя в нижний регистр.
    const path = req.url.replace(/\/?(?:\?.*)?$/, '').toLowerCase()
    switch(path) {
        //; charset=UTF-8 нужно, чтобы верно отображалась кирилица, а не крокозябры
        case '':
            res.writeHead(200, { 'Content-Type': 'text/plain; charset=UTF-8' })
            res.end('Домашняя страница')
            break
        case '/textbook':
            res.writeHead(200, { 'Content-Type': 'text/plain; charset=UTF-8' })
            res.end('Открыта страница учебников')
            break
        case '/textbook/nodejs':
            serveStaticFile(res, '/public/textbook/nodejs/index.html', 'text/html')
            break
        case String(path.match(/\/textbook\/nodejs\/ch\d*/i)):
            serveStaticFile(res, `/public/textbook/nodejs/ch${String(path.match(/\/textbook\/nodejs\/ch(\d*)/i)[1])}.html`, 'text/html')
            break
        default:
            res.writeHead(404, { 'Content-Type': 'text/plain' })
            res.end('Not Found')
            break
    }
})
server.listen(port, () => console.log(`сервер запущен на порте ${port};\n` +
    `http://localhost:${port}\n`+
    `http://localhost:${port}/textbook\n`+
    `http://localhost:${port}/textbook/nodejs\n`+
    `http://localhost:${port}/textbook/nodejs/ch1\n`+
    `http://localhost:${port}/404\n`+
    'нажмите Ctrl+C для завершения...'))
