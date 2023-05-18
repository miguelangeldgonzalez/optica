<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="usuario.php">
    <link rel="stylesheet" type="text/css" href="panelPrincipal.html">
    <title>Usuarios</title>
</head>
<body>

<main>
    <button onclick="(window.location = '/agregar_venta')">+ Agregar Venta</button>
</main>


<?php
   include("conexion.php");
   $sql="select * from proyecto";
   $resultado=mysqli_query($conexion,$sql);
?>
    
<main>
    <button onclick="(window.location = '/agregar_venta')">+ Agregar Venta</button>
</main>



  <h1> Lista de Usuarios</h1>

  <a href="#"> Nuevo Usuario </a> <br>   

  <Table>
    <thead>
    <tr> 
      <th> id </th>
      <th> Nombre </th>
      <th> Nombre de Usuario </th>
      <th> Email </th>
      <th> Acciones </th>
    </tr>
    </thead>

    <tbody>
       <?php
        while($filas=mysqli_fetch_assoc($resultado)){ 
        ?>
    <tr>
      <td> <?php echo $filas ['usuario_id'] ?> </td>
      <td> <?php echo $filas ['nombres'] ?> </td>
      <td> <?php echo $filas ['nombre_usuario'] ?> </td>
      <td> <?php echo $filas ['correo'] ?> </td>
      <td> <?php echo "<a href=''> EDITAR <a/>"; ?>
          
          <?php echo "<a href=''> ELIMINAR <a/>"; ?>
      </td>
    </tr>
     <?php
      }
      ?>
    </tbody>
  </Table>

 <?php
  mysli_close  ($conexion); 
 ?>

</body>
</html>
