import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface DetalleItem {
  cantidad: number;
  producto: {
    nombre: string;
    presentacion: string;
  };
  precioUnitario: number;
  total: number;
}

interface PresupuestoData {
  numero: string;
  createdAt: Date;
  cliente: {
    nombre: string;
    email: string | null;
    telefono: string | null;
    direccion: string | null;
  };
  detalles: DetalleItem[];
  subtotal: number;
  iva: number;
  total: number;
  observaciones: string | null;
  estado: string;
}

export function generatePDF(data: PresupuestoData): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  doc.setFontSize(20);
  doc.setTextColor(8, 145, 178);
  doc.text('Sodería', 14, 20);
  
  doc.setFontSize(12);
  doc.setTextColor(100, 116, 139);
  doc.text('Sistema de Presupuestos', 14, 28);
  
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text(`Presupuesto: ${data.numero}`, pageWidth - 14, 20, { align: 'right' });
  doc.text(`Fecha: ${new Date(data.createdAt).toLocaleDateString('es-MX')}`, pageWidth - 14, 26, { align: 'right' });
  doc.text(`Estado: ${data.estado}`, pageWidth - 14, 32, { align: 'right' });
  
  doc.setDrawColor(226, 232, 240);
  doc.line(14, 38, pageWidth - 14, 38);
  
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('Cliente:', 14, 48);
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text(data.cliente.nombre, 14, 55);
  if (data.cliente.email) doc.text(`Email: ${data.cliente.email}`, 14, 61);
  if (data.cliente.telefono) doc.text(`Teléfono: ${data.cliente.telefono}`, 14, 67);
  if (data.cliente.direccion) doc.text(`Dirección: ${data.cliente.direccion}`, 14, 73);
  
  const tableData = data.detalles.map((d: DetalleItem) => [
    d.producto.nombre,
    d.producto.presentacion,
    d.cantidad.toString(),
    `$AR ${d.precioUnitario.toFixed(2)}`,
    `$AR ${d.total.toFixed(2)}`
  ]);
  
  autoTable(doc, {
    startY: 85,
    head: [['Producto', 'Presentación', 'Cantidad', 'P. Unitario', 'Total']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [8, 145, 178],
      textColor: 255,
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 9,
      cellPadding: 4,
    },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 30 },
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 30, halign: 'right' },
      4: { cellWidth: 30, halign: 'right' },
    },
  });
  
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Total:`, pageWidth - 60, finalY);
  doc.text(`$AR ${data.total.toFixed(2)}`, pageWidth - 14, finalY, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  
  if (data.observaciones) {
    const obsY = finalY + 30;
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('Observaciones:', 14, obsY);
    doc.setTextColor(71, 85, 105);
    doc.text(data.observaciones, 14, obsY + 7);
  }
  
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Generado por Sistema de Presupuestos Sodería', pageWidth / 2, pageHeight - 10, { align: 'center' });
  
  return doc;
}