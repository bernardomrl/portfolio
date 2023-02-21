document.body.classList.remove('stop-transition')       //remover toda transtion quando o site der load

const   input = document.querySelector('[data-input]'), // input
        list = document.querySelector('[data-ul]'),     // ul da lista
        wait = 5000                                     // intervalo de tempo pra mensagem de aviso ser removida

input.addEventListener('keydown',                       // enviar o forms pelo enter, usando só o input e nenhuma tag de form
function(event){
    if(!event){
        event = window.event
    }
    if(event.keyCode === 13){                               // keyCode 13 é o codigo pra tecla 'enter'
        submit()
    }
}, false)

function submit(){                                      // tudo que estiver aqui dentro sera executado quando o input receber o enter
    if(input.value === ''){
        warnAdd()                   
        setTimeout(warnRemove,wait)                         //setTimout(funcao, variavel com valor definido para o intervalo)
    } else {
        warnRemove()
        addItem()
    }
    input.value = ''
}
function warnAdd(){                                     // funcao pra adicionar a mensagem de aviso
    input.placeholder = 'enter your to-do first..'
    input.classList.add('warning')
}

function warnRemove(){                                  // funcao pra remover a mensagem de aviso
    input.placeholder = 'enter your to-do'
    input.classList.remove('warning')
}

function addItem(){                                     // funcao pra adicionar o item na lista
    item = document.createElement('li')                     // cria o elemento desejado no HTML
    item.innerHTML = input.value;                           // define o valor do item
    item.classList.add('todo-item')                         // adiciona a classe css para formatacao

    list.appendChild(item)                                  // define em que lugar ele deve ser posicionado no codigo do html (dentro de qual div, section etc)

    item.addEventListener('click', () => {                  // addEventListener 'click' pra quando o usuario clicar encima do item ele ira checar se tem a classe, se tiver ira remove-la senao ira adiciona-la
        if(item.classList.contains('checked')){
            item.classList.remove('checked')
        } else {
            item.classList.add('checked')
        }
    })
    item.addEventListener('contextmenu', e => {             // addEventListener 'contextmenu' utiliza o botao direito do mouse como gatilho, e.preventDefault() remove o menu de contexto quando pressionado
        e.preventDefault()                                      // item.remove() ira remover o item do HTML quando o menu de contexto for ativado
        item.remove()
    })
}