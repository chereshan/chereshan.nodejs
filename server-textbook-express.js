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

// Handlebars.registerPartial('header', '{{header}}');

app.get('/textbook', (req, res) => {
        res.render('textbook',
            {
                textbooks: fs.readdirSync(__dirname + '/public/textbook'),
                title: 'Учебники',
                mockshop: false
            }
        )
    }
)
//todo: написать app.get для хедера
//todo: экономный поиск title
//todo: рассортироать app.get-запросы как полагается
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
                title: 'Учебник '+spec_textbook_name,
                textbooks: fs.readdirSync(__dirname + '/public/textbook')
            }
        )
    }
)

app.get('/textbook/[Bb]ootstrap/ch[0-9]+', (req, res) => {
        // console.log('bootstrap')
        res.render('chapter',
            {
                body: fs.readFileSync(__dirname+'/public/'+req._parsedUrl.pathname+'.html',
                    { encoding: 'utf8', flag: 'r' }),
                chapter: true,
                title: '',
                bootstrap: true,
                textbooks: fs.readdirSync(__dirname + '/public/textbook')
            }
        )
    }
)

app.get('/textbook/[^/]+/ch[0-9]+', (req, res) => {
    // console.log('chapter')
        res.render('chapter',
            {
                body: fs.readFileSync(__dirname+'/public/'+req._parsedUrl.pathname+'.html',
                    { encoding: 'utf8', flag: 'r' }),
                chapter: true,
                bootstrap: false,
                title: '',
                textbooks: fs.readdirSync(__dirname + '/public/textbook')
            }
        )
    }
)

//mock-shop
app.get('/mockshop', (req, res) => {
        res.render('mockshop',
            {
                title: 'Mockshop',
                mockshop: true,
                bootstrap: true
            }
        )
    }
)


// Пользовательская страница 500
app.use((err, req, res, next) => {
    console.error(err.message)
    res.type('text/plain')
    res.status(500)
    res.send('500 — Ошибка сервера')
})
// Пользовательская страница 404
app.use((req, res) => {
    res.status(404)
    res.render('404',
        {
            title: '404',
            textbooks: fs.readdirSync(__dirname + '/public/textbook')
        })
})

app.listen(port, () => console.log(
    `Express запущен на http://localhost:${port}/textbook; \n` +
    `http://localhost:${port}/textbook/nodejs; \n`+
    `http://localhost:${port}/textbook/nodejs/ch1; \n`+
    `http://localhost:${port}/textbook/nodejs/ch2; \n`+
    `http://localhost:${port}/textbook/nodejs/ch5; \n`+
    `http://localhost:${port}/textbook/nodejs/ch6; \n`+
    `http://localhost:${port}/textbook/Bootstrap/ch1;\n`+
    `http://localhost:${port}/mockshop;\n`+
    `нажмите Ctrl+C для завершения.` ))