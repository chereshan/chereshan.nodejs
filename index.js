const express = require('express')
const fs=require('fs')

const app = express()
const port = process.env.PORT || 3001

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
                mockshop: false,
                bootstrap: true
            }
        )
    }
)
//todo: написать app.get для хедера
//todo: экономный поиск title
//todo: рассортироать app.get-запросы как полагается
app.get('/textbook/[^/]+', (req, res) => {
        // console.log(req)
        const spec_textbook_name=req.originalUrl.replace('/textbook/', '')
        res.render('specific-textbook',
            {
                chapters: fs.readdirSync(__dirname + `/public/textbook/${spec_textbook_name}`)
                    .filter((chapter)=>/\.html/.test(chapter))
                    .map((chapter)=>{
                        let file_fs= `/textbook/${spec_textbook_name}/${chapter}`;
                        let file_text=fs.readFileSync(__dirname+'/public' +file_fs, { encoding: 'utf8', flag: 'r' });
                        return {
                            title: file_text.match(/<title>(.*?)<\/title>/)[1],
                            url: file_fs.replace('.html','')}

                    } )
                    .sort((a, b) => {
                        let regsort = function(x) {
                            let match = x.match(/(?:Гл\.?|Глава) (\d+)\./);
                            return match ? +match[1] : Infinity; // Возвращаем 0, если совпадений нет
                        };
                        if (regsort(a.title) > regsort(b.title)) {return 1;}
                        if (regsort(a.title) < regsort(b.title)) {return -1;}
                        return 0; // Можно просто вернуть 0, если равны
                    })
                ,
                title: 'Учебник '+spec_textbook_name,
                textbooks: fs.readdirSync(__dirname + '/public/textbook'),
                bootstrap: true
            }
        )
    }
)

app.get('/textbook/[Bb]ootstrap/[^/]+', (req, res) => {
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

app.get('/textbook/[^/]+/[^/]+', (req, res) => {
        // console.log('chapter')
        res.render('chapter',
            {
                body: fs.readFileSync(__dirname+'/public/'+req._parsedUrl.pathname+'.html',
                    { encoding: 'utf8', flag: 'r' }),
                chapter: true,
                bootstrap: true,
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
            textbooks: fs.readdirSync(__dirname + '/public/textbook'),
            bootstrap: true
        })
})

app.listen(port, () => console.log(
    `Express запущен на http://localhost:${port}/textbook; \n` +
    `http://localhost:${port}/textbook/nodejs; \n`+
    `http://localhost:${port}/textbook/nodejs/nodejs-intro; \n`+
    `http://localhost:${port}/textbook/nodejs/nodejs-quickstart; \n`+
    `http://localhost:${port}/textbook/nodejs/notsorted; \n`+
    `http://localhost:${port}/textbook/nodejs/express; \n`+
    `http://localhost:${port}/textbook/Bootstrap/ch1;\n`+
    `http://localhost:${port}/mockshop;\n`+
    `нажмите Ctrl+C для завершения.` ))