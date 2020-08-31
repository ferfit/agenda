<?php

if ($_POST['accion'] === 'crear' ) {
    //creara un nuevo registro en la base de datos

    require_once('../funciones/bd.php'); //llamado a la conexion

    //validar entradas con stmt

    $nombre = filter_var($_POST['nombre'], FILTER_SANITIZE_STRING); // toma 2 parametros, el dato que queremos filtrar y segundo el  tipo de filtro que se le aplica
    $empresa = filter_var($_POST['empresa'], FILTER_SANITIZE_STRING);
    $telefono = filter_var($_POST['telefono'], FILTER_SANITIZE_STRING);

    try {
        $stmt = $conn->prepare("
        INSERT INTO contactos (nombre, empresa, telefono) VALUES (?,?,?)
        ");
        $stmt->bind_param("sss", $nombre , $empresa, $telefono);
        $stmt->execute();

        if($stmt->affected_rows == 1 ){ // si hubo un cambio 1
            $respuesta = array(
                'respuesta' => 'correcto',
                 // traemos el id
                'datos' => array( // traemos los datos que luego cargaremos en el listado
                    'nombre' => $nombre,
                    'empresa' => $empresa,
                    'telefono' => $telefono,
                    'id_insertado' => $stmt->insert_id
                )
                 
            );
        }

        $stmt->close();
        $conn->close();


    } catch (Exception $e) {
        $respuesta = array (
            'error' => $e->getMessage()
        );
    }
    echo json_encode($respuesta);
}

if($_GET['accion'] === 'borrar' ){
    echo json_encode($_GET);
}
/* echo json_encode($_POST); */