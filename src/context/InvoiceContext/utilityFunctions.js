export const navigateInvoice = (direction, state, loadInvoice) => {
    const currentNumber = parseInt(state.invoiceNumber.replace("INV", ""));
    const newInvoiceNumber = `INV${(
      direction === "previous"
        ? currentNumber - 1
        : currentNumber + 1
    )
      .toString()
      .padStart(3, "0")}`;
  
    if (direction === "previous" && currentNumber <= 1) return;
  
    loadInvoice(newInvoiceNumber);
  };
  