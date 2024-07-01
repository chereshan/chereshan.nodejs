const express = require('express')
const fs=require('fs')

const app = express()
const port = process.env.PORT || 3000

// Настройка механизма представлений Handlebars.
const expressHandlebars = require('express-handlebars')
app.engine('handlebars', expressHandlebars.engine({
    defaultLayout: 'main',
}))
app.set('view engine', 'handlebars')
app.use('/static', express.static(__dirname + '/public'))

//main (online-market)
// app.get('/', (req, res) => {
//     res.type('text/plain')
//     res.send('Meadowlark Travel');
// })

//textbook
// console.log(__dirname)
// console.log(fs.readdirSync(__dirname+'/public/textbook'))
app.get('/textbook', (req, res) => {
        res.render('textbook',
            {
                textbooks: fs.readdirSync(__dirname + '/public/textbook'),
                title: 'Учебники'
            }
        )
    }
)

// const parseTitle = (body) => {
//     let match = body.match(/<title>([^<]*)<\/title>/) // regular expression to parse contents of the <title> tag
//     if (!match || typeof match[1] !== 'string')
//         throw new Error('Unable to parse the title tag')
//     return match[1]
// }

//todo: экономный поиск title
app.get('/textbook/[^/]+', (req, res) => {
    // console.log(req)
    let spec_textbook_name=req.originalUrl.replace('/textbook/', '')
    res.render('specific-textbook',
            {
                chapters: fs.readdirSync(__dirname + `/public/textbook/${spec_textbook_name}`).filter((chapter)=>/ch\d+/.test(chapter))
                    .map((chapter)=>{
                        let file_fs= `/textbook/${spec_textbook_name}/${chapter}`;
                        let file_text=fs.readFileSync(__dirname+'/public' +file_fs, { encoding: 'utf8', flag: 'r' });
                        return {
                            title: file_text.match(/<title>(.*?)<\/title>/)[1],
                            url: file_fs.replace('.html','')}

                } )
                ,
                title: 'Учебник '+spec_textbook_name
            }
        )
    }
)

app.get('/textbook/[^/]+/ch[0-9]+', (req, res) => {
    // console.log(req)
        res.render('chapter',
            {
                body: fs.readFileSync(__dirname+'/public/'+req._parsedUrl.pathname+'.html',
                    { encoding: 'utf8', flag: 'r' }),
                chapter: true,
                title: ''
            }
        )
    }
)
// app.get('/textbook/[^/]', (req, res) => {
//         res.render('specific-textbook',
//             {
//                 textbooks: fs.readdirSync(__dirname + '/public/textbook'),
//                 title: 'Учебники'
//             }
//         )
//     }
// )

// app.get('/textbook', (req, res) => res.render('textbook'))
//
// //online-market
// //...
//
// // Пользовательская страница 500
// app.use((err, req, res, next) => {
//     console.error(err.message)
//     res.type('text/plain')
//     res.status(500)
//     res.send('500 — Ошибка сервера')
// })
// // Пользовательская страница 404
// app.use((req, res) => {
//     res.type('text/plain')
//     res.status(404)
//     res.send('404 — Не найдено')
// })

app.listen(port, () => console.log(
    `Express запущен на http://localhost:${port}/textbook; \n` +
    `http://localhost:${port}/textbook/nodejs; \n`+
    `http://localhost:${port}/textbook/nodejs/ch1; \n`+
    `http://localhost:${port}/textbook/nodejs/ch2; \n`+
    `нажмите Ctrl+C для завершения.` ))