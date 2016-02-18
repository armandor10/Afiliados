<?php 
header("Content-type: image/gif"); 
if(isset($_GET['id'])){ 
    $id = $_GET['id']; 
    $link = mysql_connect("107.180.21.19", "timeit", "qaz123") or die ("ERROR AL CONECTAR"); 
    $db_select = mysql_select_db("timeit")or die ("ERROR AL SELECCIONAR DB"); 
     
    $q = "SELECT foto FROM empleados WHERE noDocumento = $id"; 
    $result = mysql_query($q, $link) or die ("Error al consultar"); 
     
    while ($row = mysql_fetch_assoc($result)) { 
    echo $row["foto"]; 
    } 
    mysql_free_result($result); 
    } else { 
        echo 'NO ID'; 
    }  
    mysql_close($link);
  
?>