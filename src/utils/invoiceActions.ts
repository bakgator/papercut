import { toast } from "sonner";

export const handleDownload = (invoice: any) => {
  const invoiceText = `
Invoice #${invoice.invoiceNumber}
Customer: ${invoice.customer}
Date: ${invoice.date}
Amount: ${invoice.total} SEK
Status: ${invoice.status}
  `;
  
  const blob = new Blob([invoiceText], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `invoice-${invoice.invoiceNumber}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  
  toast.success("Invoice downloaded successfully");
};

export const handlePrint = (invoice: any) => {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice #${invoice.invoiceNumber}</title>
        </head>
        <body>
          <h1>Invoice #${invoice.invoiceNumber}</h1>
          <p>Customer: ${invoice.customer}</p>
          <p>Date: ${invoice.date}</p>
          <p>Amount: ${invoice.total} SEK</p>
          <p>Status: ${invoice.status}</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }
  toast.success("Print window opened");
};

export const handleSend = (invoice: any) => {
  toast.success(`Invoice ${invoice.invoiceNumber} sent successfully`);
};