import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportToCSV = (transactions) => {
  if (!transactions?.length) return;

  const headers = ['Date', 'Type', 'Category', 'Amount', 'Description'];
  const csvContent = [
    headers.join(','),
    ...transactions.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.type,
      t.category,
      t.amount.toFixed(2),
      `"${t.description || ''}"`,
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToPDF = (transactions) => {
  if (!transactions?.length) return;

  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text('Transaction Report', 14, 15);
  
  // Add date
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25);

  // Add summary
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  doc.text(`Total Income: $${totalIncome.toFixed(2)}`, 14, 35);
  doc.text(`Total Expense: $${totalExpense.toFixed(2)}`, 14, 42);
  doc.text(`Balance: $${balance.toFixed(2)}`, 14, 49);

  // Add transactions table
  const tableData = transactions.map(t => [
    new Date(t.date).toLocaleDateString(),
    t.type,
    t.category,
    `$${t.amount.toFixed(2)}`,
    t.description || ''
  ]);

  doc.autoTable({
    startY: 60,
    head: [['Date', 'Type', 'Category', 'Amount', 'Description']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [66, 139, 202] },
    styles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 20 },
      2: { cellWidth: 30 },
      3: { cellWidth: 25 },
      4: { cellWidth: 'auto' }
    }
  });

  doc.save(`transactions_${new Date().toISOString().split('T')[0]}.pdf`);
};
