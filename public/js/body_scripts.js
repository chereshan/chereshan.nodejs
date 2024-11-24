//=================================================
//Окружает тэгами класса кода для первого столбца со второй строки в таблицы
$(function(){
    jQuery('.first_column_code td:nth-child(1):not(tr:first-child td)').each(function () {
        $(this).html('<span class="code">' + $(this).html() + '</span>')
    })
})

//=================================================
//расположение пост-dom html-тегов
/*
* подсветка кода
* подсветка для span.code
* */
$(function(){
    // $('body').prepend('<div id="header"></div>')
    // $("#header").load(!(
    //     location.pathname==='/' ||
    //     location.pathname==='/chereshan.github.io/index.html') ? "/static/common/header.handlebars" : "/static/common/header.handlebars")

    $('span.code').each(function(){
        $(this).replaceWith(`<pre class="span-code"><code>${$(this).html()}</code></pre>`)
    })
    //=================================================
    if ($('.code-tips').length>0){
        loadCodeTips_beforeHighlight()
    }
    //=================================================
    hljs.highlightAll();
    //=================================================
    if ($('.code-tips').length>0){
        loadCodeTips_afterHighlight()
    }
    //=================================================
    $(".span-code").replaceWith(function(){
        return this.outerHTML.replace("<pre class=\"span-code\"", "<span class=\"span-code\"").replace("</pre", "</span")
    });
    //=================================================
    //добавление кнопки раскоменчивания в окна кода
    const uncomment_button = document.createElement("img");
    uncomment_button.src = "/static/common/comment-button.svg";
    uncomment_button.classList=['uncomment-button']
    jQuery('pre code.hljs').prepend(uncomment_button)
    $('.uncomment-button').on('click', function(){
        $(this).parent().find('.hljs-comment').toggle()
    })
    //=================================================
    //добавление кнопки копирования в окна кода
    const copy_button = document.createElement("img");
    copy_button.src = "/static/common/copy-button.svg";
    copy_button.classList=['copy-button'];
    jQuery('pre code.hljs').prepend(copy_button)
    $('.copy-button').on('click', function(){
        // надо также убрать все селект-инпуты
        copytxt=$(this).parent().clone()
        copytxt.find(".dropdown-content").detach()
        navigator.clipboard.writeText(copytxt.text().replace(/\x3C/,'<'));
    })

    //=================================================
    //добавление в код выбора опций
    if ($('.code-selection').length>0){
        loadCodeDropdown()
    }

})
//todo: tippy для фрагментов кода
//todo: пострендерер для фрагментов кода, который вносит в код кастомный функционал (инпуты, селекты, всплывающие подсказки)
//todo: заменить все инстансы кастомных подсказок на tippy.js

test_var=[]
function loadCodeTips_beforeHighlight(){
    codeTipContainer=[]
    $('.code-tips').each(function(){
        var code_tips_tag=$(this)
        codeTipContainer.push({
            'address':$(this),
            // 'raw-text':$(this).text(),
            // 'raw-html':$(this).html(),
            // 'test':$(this).html().match(/<span class="code-tip" data-tip=".*?">(.*?)<\/span>/g),
            // 'test2':$(this).find('.code-tip'),
            'tips':[]
        })
        let iter_code_tip_id=0
        $(this).find('.code-tip').each(function(){
            //Присваиваем каждому тегу айдишник, чтобы избежать проблемы не-уникальности тегов. В jQ-объекте будет храниться id.
            $(this).attr('data-tip-id', iter_code_tip_id)
            iter_code_tip_id++;
        })
        $(this).find('.code-tip').each(function(){
            //парсинг данных
            var data_tip_text=$(this).attr('data-tip')
            var inner_tip_text=$(this)[0].innerHTML
            var outer_tip_html=$(this)[0].outerHTML
            var start_pos=code_tips_tag.html().indexOf(outer_tip_html)
            var end_pos=start_pos+inner_tip_text.length
            // console.log(code_tips_tag.html())
            code_tips_tag.html(code_tips_tag.html().replace(outer_tip_html, inner_tip_text))

            codeTipContainer[codeTipContainer.length-1]['tips'].push({
                'tip-text':data_tip_text,
                'start':start_pos,
                'end':end_pos,
                'outer_tip_html':outer_tip_html,
                'inner_tip_text':inner_tip_text
            })
        })
    })
}

//todo: весь хайлайтинг должен быть вынесен отдельный скрипт, который будет подключаться из осноного скрипта

var test_container= {}
//test: совпадение слайса и текста
function loadCodeTips_afterHighlight(){
    for (let i=0; i<codeTipContainer.length; i++){
        test_container[i]={'address':codeTipContainer[i].address}
        let code_text=codeTipContainer[i].address.text()
        let code_html=codeTipContainer[i].address.html()
        test_container[i]['code-html']=code_html

        let tag_posed=tagTextSeparator(code_html)
        test_container[i]['tag-posed']=tag_posed
        test_container[i]['tips']=codeTipContainer[i].tips

        let relevant_pos=[]
        let relevant_pos1=[]
        for (let j=0; j<codeTipContainer[i].tips.length; j++){

            relevant_pos.push(tag_posed.filter(function(l){
                return l[2]>=codeTipContainer[i].tips[j].start && l[2]<=codeTipContainer[i].tips[j].end
            }))

            relevant_pos1.push(tag_posed.filter(function(l){
                return l[2]>=codeTipContainer[i].tips[j].start && l[2]<=codeTipContainer[i].tips[j].end && !l[0]
                    && !l[3]
            }))

            // test_container[i]['tips'][j]['posed']=tag_posed.filter(function(l){
            //     return l[2]>=codeTipContainer[i].tips[j].start && l[2]<=codeTipContainer[i].tips[j].end
            // })

            test_container[i]['tips'][j]['test0']=relevant_pos[j]
            test_container[i]['tips'][j]['test1']=code_html.slice(relevant_pos[j][0][1], relevant_pos[j][relevant_pos[j].length-1][1])
            test_container[i]['tips'][j]['test2']=codeTipContainer[i].tips[j].inner_tip_text

            test_container[i]['tips'][j]['test3']=relevant_pos[j][0][1]
            test_container[i]['tips'][j]['test4']=relevant_pos[j][relevant_pos[j].length-1][1]

            // console.log(relevant_pos1)
            test_container[i]['tips'][j]['test5']=code_html.slice(relevant_pos1[j][0][1], relevant_pos1[j][relevant_pos1[j].length-1][1])

            test_container[i]['tips'][j]['test6']=relevant_pos1[j]

        }
        // console.log(relevant_pos)
        for (let k=0; k<relevant_pos.length;k++){

            // console.log('test1:', code_text.slice(relevant_pos[k][0][1], relevant_pos[k][0][relevant_pos[k].length-1])==codeTipContainer[i].tips[k].inner_tip_text)

            // console.log(code_html.slice(relevant_pos[k][0][1], relevant_pos[k][0][relevant_pos[k].length-1]))
            // console.log(codeTipContainer[i].tips[k]['inner_tip_text'])
        }

        // console.log('КОНЕЦ')

    }
}


function tagTextSeparator(str){
    let html_map=str.split('')
    let result_list=[]
    let intagflag=false
    let istagopen=false
    // var intagflag_1=false
    let text_count=0
    for (let i=0; i<html_map.length; i++){
        if (html_map[i]=='<'){intagflag=true}
        if (!istagopen && intagflag){istagopen=true}
        else if (istagopen && !intagflag){istagopen=false}
        result_list.push([intagflag, i, text_count, istagopen])
        if (!intagflag){text_count++}
        if (intagflag && html_map[i]=='>'){intagflag=false}

    }
    // console.log(result_list)
    return result_list

}
//=================================================
// function loadTips(){
//     $('head').append(`<script src="https://unpkg.com/@popperjs/core@2"></script>`)
//     $('head').append(`<script src="https://unpkg.com/tippy.js@6"></script>`)
// }
//=================================================
//служебные функции для выбора опций в коде
function loadCodeDropdown(){
    $('.code-selection').each(function(){
        $(this).attr('id', `codeselect-${new Date().getTime()}`)
        $(this).find('.hljs-string:contains("codeDropDownTag-")').each(function(){
            let input_id=$(this).html().trim().replace(/codeDropDownTag|-|'|"/g, '')
            // console.log(input_id)
            let element_dict=codeElements_to_Options($(this))
            // console.log(`codeDropDownTag-${input_id}`)
            element_dict[`\'codeDropDownTag-${input_id}\'`]['jq'].detach()
            element_dict['\'stop\'']['jq'].detach()
            delete element_dict[`\'codeDropDownTag-${input_id}\'`]
            delete element_dict['\'stop\'']

            button_element=element_dict[Object.keys(element_dict)[0]]
            button_element['jq'].addClass('dropbtn')
            button_element['jq'].attr('id', `codeinput-${input_id}`)
            button_element['jq'][0].outerHTML=`<div class='dropdown'>${button_element['jq'][0].outerHTML}</div>`
            $('#codeinput-'+input_id).parent().append('<div class="dropdown-content">')
            $('#codeinput-'+input_id).parent().find('.dropdown-content').append(button_element['jq'].removeAttr('id').removeClass('dropbtn'))
            // console.log('1 '+input_id)
            // $('#codeinput-'+input_id).parent().find('.dropdown-content')
            delete element_dict[Object.keys(element_dict)[0]]
            // console.log(element_dict)

            for (let key of Object.keys(element_dict)){
                // console.log('Мы в итерации')
                // console.log(element_dict[key]['jq'])
                // console.log(element_dict[key]['text'])
                element_dict[key]['jq'].detach()
                $('#codeinput-'+input_id).parent().find('.dropdown-content').append(element_dict[key]['text'])
            }
            //клик по элементу выпадающего меню ставит этот элемент выбранный
            // console.log($('#'+input_id+'~.dropdown-content'))
            //чистка пробелов перед запятой
            checkForSpacesBeforeComma($('#codeinput-'+input_id).parent()[0])


        })})
    $('.dropdown-content *').each(function(){
        $(this).on('click', function(){
            $(this).parent().parent().find('.dropbtn').html($(this)[0].innerHTML)
        })
    })

    //клик по выбранному элементу меню открывает меню
    $('.dropbtn').each(function(){
        $(this).on('click', function(){
            if ($(this).parent().find(".dropdown-content").hasClass('show')) $(this).parent().find(".dropdown-content").removeClass('show');
            else $(this).parent().find(".dropdown-content").addClass('show');
        })
    })
    //клик по любому месту кроме элемента сворачивает меню
    $(document).on('click', function(e){
        if (!$(e.target).is('.dropbtn, .dropbtn *'))
            $(".dropdown-content").removeClass('show')
    })
}
function codeElements_to_Options(jq_object){
    element_dict=new Map()
    element_dict[jq_object.html().trim().replace(/|'|"/g, '')]= {
        'text':jq_object[0].outerHTML,
        'jq':jq_object}
    parseCodeElements(jq_object)
    return element_dict
}
function parseCodeElements(jq_object){
    // console.log(jq_object.html())
    if (jq_object.html()=='\'stop\''){element_dict[jq_object.html()]={
        'text':jq_object[0].outerHTML,
        'jq':jq_object
    };
        return;}
    else {
        element_dict[jq_object.html()]={
            'text':jq_object[0].outerHTML,
            'jq': jq_object}
        parseCodeElements(jq_object.next())
    }
}
function checkForSpacesBeforeComma(node){
    // console.log(node)
    node=node.nextSibling
    // console.log(node)
    if (node.nodeType!=3 || (node.nodeValue.startsWith(','))){
        // console.log('exit')
        return;
    }
    else{
        // console.log('enter')
        node.nodeValue=''
        checkForSpacesBeforeComma(node)
    }
}

loadChapterAutoNav();
function loadChapterAutoNav(){
    //Автоооглавление
    //todo: сделать автооглавление независимым от числа уровней
    $(function(){
        if (!($('.main-page').length>0 || $('.textbook-index-page').length>0)){
                // jQuery('h1').after('<ul id="autonav"></ul>')

                h=[0,0,0,0]; pos_memory=0;
                jQuery(':header:not(h1)').each(function () {
                    let pos=+($(this)[0].nodeName.slice(-1))-2
                    h[pos]+=1
                    if (pos_memory>pos) {
                        h=h.slice(0,pos+1).concat(h.slice(pos+1).map((num)=>0));
                    }
                    pos_memory=pos
                    var ch = h.filter((n)=>n!=0).join('.')
                    // $(this).attr('id','ch-'+(h.filter((n)=>n!=0).join('.')));
                    //создание класса уровней списка
                    let list_level=autonav_listLevel(h)
                    // jQuery('#autonav').append(`<li class="${list_level}"><a href=${'#'+$(this).attr('id')}>${$(this).attr('id').slice(3)}. ${$(this).text().replace(/\</g, '&lt;')}</a></li>`);
                    // console.log($(this).text())
                    // console.log(ch)
                    $(this).html(ch+'. '+$(this).html())
                    // $(this).html($(this).attr('id').slice(3)+'. '+$(this).html())
                })
//
                jQuery('span.backgr-col').each(function(){
                    $(this).css({
                        'background-color': $(this).text(),
                        'mix-blend-mode':'difference'
                    })
                })
        }
    })
}




//Проект более эффективного алгоритма
//Скорее всего надо написать РиВ-алгоритм
// $(function (){
//     // jQuery('h1').after('<ul id="autonav"></ul>')
//
//     function autonav(hi){
//
//     }
//
// })



function autonav_listLevel(list){
    if (list.slice(1).every((num)=>num==0)) return 'ch0'
    else if (list.slice(2).every((num)=>num==0)) return 'ch1'
    else if (list.slice(3).every((num)=>num==0)) return 'ch2'
    else if (list.slice(4).every((num)=>num==0)) return 'ch3'
}
//=================================================

//Функция для быстрой генерации таблиц на основе списка словарей
function list_of_dicts_to_table(list, selector){
    var headers=[]
    for (let j=0; j<list.length;j++){ //сначала собираем все хедеры на случай, если их число в каждом словаре не совпадает
        let row=list[j]
        let keys=Object.keys(row)
        for (let i=0; i<keys.length; i++){
            if (!headers.includes(keys[i])){
                headers.push(keys[i])
            }
        }
    }
    $(selector).append('<table>')
    for (let j=-1; j<list.length; j++){
        if (j==-1){
            $(selector).find('table').append('<tr class="header-row">')
            for (let i=0; i<headers.length; i++){
                $(selector).find('.header-row').append(`<th class="column-${i}">${headers[i]}</th>`)
            }
        }
        else {
            $(selector).find('table').append(`<tr class="row-${j}"></tr>`)
            for (let i=0; i<headers.length; i++){
                $(selector).find(`.row-${j}`).append(`<td class="column-${i}">${list[j][headers[i]]}</td>`)
            }
        }
    }
}

//Функция для быстрой генерации ПРОСТЫХ таблиц на основе списка
function list_to_table(list, column_num, selector){
    let rows_num=Math.ceil(list.length/column_num)
    if ($(selector).find('table').length==0){
        $(selector).append('<table>')
    }
    let td_id=0
    for (let row=0; row<rows_num; row++){
        $(selector).find('table').append(`<tr class="row-${row}"></tr>`)
        for (let column=0; column<column_num; column++){
            $(selector).find(`table tr.row-${row}`).append(`<td class="row-${row} column-${column}">${(typeof list[td_id+column]==="undefined"?'':list[td_id+column])}</td>`)
        }
        td_id=td_id+column_num

    }
}

//функция генерация toggle-кнопки
function generateToggleButton(table_str){
    $(function(){
        $(table_str).css('display', 'none')
        $(table_str).wrap(`<div id="${table_str.replace('#', '')}-div"></div>`)
        $(`${table_str}-div`).before(`<button id="${table_str.replace('#', '')}-toggle" class="toggle-button">Показать/скрыть таблицу</button>`)
        $(`${table_str}-toggle`).on('click', function(){
            $(table_str).toggle('display')
        })
    })
}


//история посещений
//этот скрипт ведет историю просмотров страниц сайта
//контроль уникальности просмотров
function get_lshistory(){
    return JSON.parse(localStorage.getItem('view_history'))
}
let ls_history
$(function(){
    const expiration_date=60*60*24*21 //21 день
//этот скрипт ведет историю просмотров страниц сайта
//этот скрипт должен располагаться на выделенном сегменте страниц сайта
    var current_page={
        title: document.querySelectorAll('title')[0].innerHTML,
        ts: new Date() //отметка времени для контроля над сроком жизни
    }
    var view_history = localStorage.getItem('view_history')
    if (!view_history){
        view_history=[]
        view_history.push(current_page)
        ls_history=JSON.parse(JSON.stringify(view_history))
        localStorage.setItem('view_history', JSON.stringify([current_page]))

    }
    else {
        view_history=JSON.parse(view_history)
        view_history=checkLS_forUniqness(current_page, view_history)
        view_history=checkLS_forExpires(view_history, expiration_date)
        view_history.push(current_page)
        ls_history=JSON.parse(JSON.stringify(view_history))
        localStorage.setItem('view_history', JSON.stringify(view_history))

    }

    function checkLS_forExpires(list, expires){
        var new_list=[]

        for (let i=0; i<list.length; i++){
            d1=new Date(list[i]['ts']).getTime()
            if (!d1<(new Date()).getTime()-expires){
                new_list.push(list[i])
            }
        }
        return new_list
    }
    function checkLS_forUniqness(page, list){
        var new_list=[]
        for (let i=0; i<list.length; i++){
            if (page.title!=list[i].title){
                new_list.push(list[i])
            }
        }
        return new_list
    }
})

//=================================================
//АВТООГЛАВЛЕНИЕ УЧЕБНИКА
async function getChapterTitle(num, url){
    let x;
    let y={};
    await $.ajax({
        url:`${url}ch${num}.html`,
        type:'get',
        success: function(data){
            x=$(data)
            x.each(function(){
                if (this.localName=='title') {
                    // console.log(this.innerHTML);
                    y[this.innerHTML]=`${url}ch${num}.html`
                    return false;
                }
            })
        },
        error: function (jqXHR, exception, errorThrown){
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
        }
    });
    return y;
}


//=================================================
//футер
$(function() {
    $('body').append('<footer></footer>')
    // $("footer").load(!(
    //     location.pathname=='/' ||
    //     location.pathname=='/chereshan.github.io/index.html') ? "../commo
})