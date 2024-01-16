const socket= io();

const containerProducts= document.querySelector(".container-products");

socket.on('newP', data =>{

    containerProducts.innerHTML +=`
    
    <div class="product">

<ul>
    <h3>${data.title}</h3>
    <p>${data.description}</p>
    <p>${data.price}</p>
    <p>${data.stock}</p>
    <p>${data.thumbnails}</p>
    <p>${data.code}</p>
    <p>${data.stock}</p>
    <p>${data.status}</p>
    <p>${data.category}</p>
</ul>

</div>
    `
});


socket.on('deletProduct', data=> {

containerProducts.innerHTML='';

data.forEach(product => {

    containerProducts.innerHTML+=`

    <div class="product">
    
    <ul>
        <h3>${product.title}</h3>
        <p>${product.description}</p>
        <p>${product.price}</p>
        <p>${product.stock}</p>
        <p>${product.thumbnails}</p>
        <p>${product.code}</p>
        <p>${product.stock}</p>
        <p>${product.status}</p>
        <p>${product.category}</p>
    </ul>
    
    </div>
    
    `
});

})

let user='';

let messageDocument=document.querySelector('.messajes');

Swal.fire({
    title: 'Identifícate',
    input: 'text',
    text: 'Ingresa el usuario para identificarte en el chat',
    inputValidator: (value) => {
        return !value && '¡Necesitas escribir un nombre de usuario para continuar!'
    },
    allowOutsideClick: false
}).then(result => {
    user = result.value

    socket.emit('userConnect', result.value);
});

messageDocument.addEventListener('keypress',e=>{
    if(e.key == 'Enter'){
        if (messageDocument.value.trim().length > 0) {
            console.log(messageDocument.value);
            socket.emit('message', {
                user: user,
                message: messageDocument.value
            });
        }
        messageDocument.value = '';
    }
});

socket.on('messagesLogs', data => {
    let chat=document.querySelector('.chatContainer');
    let messages = '';
    data.forEach(newMessage => {
        messages += `${newMessage.user}: ${newMessage.message} </br>`
    });

    chat.innerHTML = messages;
});
