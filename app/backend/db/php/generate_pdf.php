<?php
require('fpdf/fpdf.php');

class PDF extends FPDF {
    // Page header
    function Header() {
        // Logo
        $this->Image('../../../frontend/assets/logo_optiluz.png',10,6,20);
        // Arial bold 15
        $this->SetFont('Arial','B',15);
        // Move to the right
        $this->Cell(80);
        // Title
        $this->Cell(30,10,'Informe de Encargos',0,0,'C');
        // Line break
        $this->Ln(20);
    }

    // Better table
function ImprovedTable($header, $data) {
    // Column widths
    $w = array(45, 45, 45, 45);
    // Header
    for($i=0;$i<count($header);$i++)
        $this->Cell($w[$i],7,$header[$i],1,0,'C');
    $this->Ln();
    // Data
    foreach($data as $row)
    {
        $this->Cell($w[0],6,$row['nombres_cliente'],'LR');
        $this->Cell($w[2],6,number_format($row['cedula']),'LR',0,'R');
        $this->Cell($w[1],6,$row['producto'],'LR');
        $this->Cell($w[3],6,number_format($row['precio']),'LR',0,'R');
        $this->Ln();
    }
    // Closing line
    $this->Cell(array_sum($w),0,'','T');
}

    // Page footer
    function Footer() {
        // Position at 1.5 cm from bottom
        $this->SetY(-15);
        // Arial italic 8
        $this->SetFont('Arial','I',8);
        // Page number
        $this->Cell(0,10,'Pagina '.$this->PageNo().'/{nb}',0,0,'C');
        $this->Cell(-190,15,'Este Informe no Representa Ningun Tipo de Informacion Fiscal',0,0,'C');

    }
}


require('./link.php');

$start_date = $_GET['start_date'];
$end_date = $_GET['end_date'];
$where = '';

if ($start_date != '') {
    $where = "WHERE v.fecha >= '$start_date' ";
}

if($end_date != '') {
    if ($where != '') {
        $where .= "AND v.fecha <= '$end_date'";
    } else {
        $where = "WHERE v.fecha <= '$end_date'";
    }
}

$query = "SELECT c.nombres as nombres_cliente, c.cedula, p.nombre as producto, 
(CASE WHEN vp.precio IS NOT null THEN vp.precio ELSE pl.precio END) as precio, v.fecha
FROM ventas v
INNER JOIN clientes c ON c.cliente_id = v.cliente_id
LEFT JOIN ventas_productos vp ON v.venta_id = vp.venta_id
LEFT JOIN lentes l ON l.venta_id = v.venta_id
LEFT JOIN parte_lentes pl ON pl.lente_id = l.lente_id
INNER JOIN productos p ON 
    (CASE 
         WHEN pl.producto_id IS NOT null THEN
            p.producto_id = pl.producto_id
        WHEN vp.producto_id IS NOT null THEN
            vp.producto_id = p.producto_id
    END)
    $where
 ORDER BY v.fecha DESC";

$result = mysqli_query($LINK, $query);
$result = $result->fetch_all(MYSQLI_ASSOC);
$total = 0;

foreach($result as $row) {
    $total += $row['precio'];
}


// Instanciation of inherited class
$pdf = new PDF();
$pdf->AliasNbPages();
$pdf->AddPage();
$pdf->SetFont('Arial','',12);
$data = ['Nombres del Cliente','Cedula del Cliente','Prodcuto', 'Precio'];
$pdf->ImprovedTable($data,$result);
$pdf->Cell(-15,10,'Total ' . $total,0,0,'C');


$pdf->Output();



?>