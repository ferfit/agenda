


const formulario = document.querySelector('#contacto'),
    listadoContactos = document.querySelector('#listado-contactos tbody');
    



// EVENTS LISTENERS//
// cuando el formulario de crear o editar se ejecuta
formulario.addEventListener('submit', leerFormulario);
listadoContactos.addEventListener('click', eliminarContacto);

function leerFormulario(e) {
    e.preventDefault(); // prevenimos el action del formulario al darle enviar

    //leer los datos de los inputs
    const nombre = document.querySelector('#nombre').value,
        empresa = document.querySelector('#empresa').value,
        telefono = document.querySelector('#telefono').value,
        accion = document.querySelector('#accion').value; //input hidden del form añadir

    if (nombre === '' || empresa === '' || telefono === '') {
        //2 parametros texto y clase
        mostrarNotificacion('Todos los campos son obligatorios', 'error');
    } else {
        // pasa la validacion, crea llamado de ajax
        const infoContacto = new FormData(); //capturamos los valores del form
        infoContacto.append('nombre', nombre); //llave y valor
        infoContacto.append('empresa', empresa);
        infoContacto.append('telefono', telefono);
        infoContacto.append('accion', accion);

        //console.log(...infoContacto); // con los 3 puntos me permite ver los datos del objeto
        if (accion === 'crear') {
            //crearemos el nuevo contacto
            insertarBD(infoContacto);
        } else {
            //editar el contacto
        }
    }
}

/**inserta en bd via ajax **/

function insertarBD(datos) {
    //llamado a ajax

    //crear objeto
    const xhr = new XMLHttpRequest();
    //abrir conexion
    xhr.open('POST', 'inc/modelos/modelo-contactos.php', true); // toma 3 parametros
    //pasar los datos
    xhr.onload = function () {
        if (this.status === 200) {
            console.log(JSON.parse(xhr.responseText)); // si el paso de los datos fue correcto codigo 200, responde tal cosa, jasonparse, transforma el string en un jason a si podemos acceder a cada valor
            //leemos la respuesta
            const respuesta = JSON.parse(xhr.responseText);

            /* console.log(respuesta.empresa); */
            //inserta un nuevo elemento a la tabla
            const nuevoContacto = document.createElement('tr');

            nuevoContacto.innerHTML = `
                <td>${respuesta.datos.nombre}</td>
                <td>${respuesta.datos.empresa}</td>
                <td>${respuesta.datos.telefono}</td>
            `;

            //creamos contenedor de los botones
            const contenedorAcciones = document.createElement('td');
            //crear el icono de editar
            const iconoEditar = document.createElement('i');
            iconoEditar.classList.add('fas', 'fa-pen-square');
            //crear el enlace para editar
            const btnEditar = document.createElement('a');
            btnEditar.appendChild(iconoEditar);
            btnEditar.href = `editar.php?id=${respuesta.datos.id_insertado}`;
            btnEditar.classList.add('btn', 'btn-editar');
            //agrearlo al padre
            contenedorAcciones.appendChild(btnEditar);

            //crear el icono de eliminar 
            const iconoEliminar = document.createElement('i');
            iconoEliminar.classList.add('fas', 'fa-trash-alt');
            //crear boton eliminar
            const btnEliminar = document.createElement('button');
            btnEliminar.appendChild(iconoEliminar);
            btnEliminar.setAttribute('data-id', respuesta.datos.id_insertado);
            btnEliminar.classList.add('btn', 'btn-borrar');
            //agregamos al padre
            contenedorAcciones.appendChild(btnEliminar);
            //agregarlo al tr
            nuevoContacto.appendChild(contenedorAcciones);

            //agregarlos con los contactos, const creada en linea 5
            listadoContactos.appendChild(nuevoContacto);

            //resetear el form
            document.querySelector('form').reset();
            //mostrar la notificacion
            mostrarNotificacion('Contacto creado correctamente', 'correcto');
        }
    }
    //enviar los datos
    xhr.send(datos)
}


//eliminacion de contacto
function eliminarContacto(e) { // el e nos va a reportar que elemento le dimos click
    // console.log(e.target.parentElement.classList.contains('btn-borrar')); // con esto chequeamos que el padre delemento que seleccionamos contenga la clase btn-borrar, devuelve true o false
    //entonces lo incluimos dentro de un if 
    if (e.target.parentElement.classList.contains('btn-borrar')) {
        //tomamos el id de e
        
        const id = e.target.parentElement.getAttribute('data-id');
        //preguntar
        const respuesta = confirm('¿Estas seguro?');

        if(respuesta){
            //ajax
            //crear el objeto
            const xhr = new XMLHttpRequest();
            //abrir conexion
            xhr.open('GET', `inc/modelos/modelo-contactos.php?id=${id}&accion=borrar`,true);
            //leer la respuesta
            xhr.onload = function () {
               if(this.status === 200 ){
                   const resultado = JSON.parse(xhr.responseText);
                   console.log(resultado);
               }
               
            }
            //enviar la peticion
            xhr.send(); //Cuando es por POST se manda  la varialbel por esta linea, en el caso get se envia por la url

        } 

        

    } 

    
}

// notificacion en pantalla funcion que usamos en la de arriba

function mostrarNotificacion(mensaje, clase) {
    const notificacion = document.createElement('div');
    notificacion.classList.add(clase, 'notificacion', 'sobra');
    notificacion.textContent = mensaje;

    //formulario
    formulario.insertBefore(notificacion, document.querySelector('form legend')); // esto toma primeero lo que vas a insertar y segundo donde

    //ocultar y mostrar la notificación El método setTimeout () llama a una función o evalúa una expresión después de un número específico de milisegundos.
    // dps de 100 va a agregar la clase visible y transcurrido 3000 la quitara
    setTimeout(() => {
        notificacion.classList.add('visible');
        setTimeout(() => {
            notificacion.classList.remove('visible');
            notificacion.remove(); // con este eliminamos el elemento para que no se valla duplicando el dom si hacemos varias veces click en añadir
        }, 3000);
    }, 100);
}