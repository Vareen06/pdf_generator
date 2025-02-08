import { Component } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // title = 'pdf_practice';
  userDetails : any = {name:'', contact:'' };
  orderDetails: any = {product: '',price:'',quantity:'' };
  orders: any[] = []
  total: number = 0;
  saveDetails: any = null;

  calculateTotal() {
    this.total = this.orders.reduce((sum, order) => sum + (order.price * order.quantity), 0);
  }
  addProduct(){
    if (this.orderDetails.product && this.orderDetails.price > 0 && this.orderDetails.quantity > 0) {
      this.orders.push({ ...this.orderDetails }); 
      this.orderDetails = { product: '', price: '', quantity: '' }; 
      this.calculateTotal();
    } else {
      alert('Please enter valid product details');
    }
  }
  removeProduct(index: number) {
    this.orders.splice(index, 1);
    this.calculateTotal();
  }
  onSubmit(){
    if (this.orders.length === 0) {
      alert('Please add at least one product');
      return;
    }
    // console.log(this.userDetails, this.orderDetails)
    this.saveDetails ={
      name: this.userDetails.name,
      contact: this.userDetails.contact,
      orders: this.orders,
      total: this.total
    }
    console.log(this.saveDetails)
    alert('Form Submitted Successfully')
    this.resetForm()
  }

  isFormValid():  boolean{
    return(
      this.userDetails.name &&
      this.isValidContact(this.userDetails.contact)  &&
      this.orders.length > 0
    )
  }
  isValidContact(contact: string): boolean {
    return /^\d{10}$/.test(contact);
  }

  resetForm(){
    this.userDetails= ''
    this.orderDetails= ''
    this.orders = []
    this.total = 0
  }

  commonPDF(){
    if(!this.saveDetails){
      alert("no details for pdf, click the submit button first")
      return;
    }
    const doc = new jsPDF()
    let yOffset = 20;

    doc.setFontSize(16)
    doc.text('Order Details',20,yOffset)
    yOffset += 10;


    
    doc.setFontSize(12)
    doc.text(`Name:${this.saveDetails.name}`,20,yOffset)
    yOffset += 10;
    doc.text(`Contact:${this.saveDetails.contact}`,20,yOffset)
    yOffset += 20;
    // doc.text(`Product:${this.saveDetails.product}`,20,yOffset)
    // yOffset += 10;
    const columns = ['Product','Price', 'Quantity', 'Total']
    const rows = this.saveDetails.orders.map((order: any) => [
      order.product, order.price, order.quantity, order.price * order.quantity
    ]);
    autoTable(doc,{
      head: [columns],
      body: rows,
      startY: yOffset,
      theme: 'grid',
      styles: {fontSize:12, cellPadding: 3},
      headStyles: {fillColor: [22,160,133]}
    })
    return doc
  }

  generatePDF(){
    try{
      const doc = this.commonPDF();
      doc?.save('OrderDetails.pdf')
    }catch(err){
      console.error(err)
    }
    // doc.setFontSize(12)
    // doc.text(`Name:${this.saveDetails.name}`,20,yOffset)
    // yOffset += 10;
    // doc.text(`Contact:${this.saveDetails.contact}`,20,yOffset)
    // yOffset += 10;
    // doc.text(`Price:${this.saveDetails.price}`,20,yOffset)
    // yOffset += 10;
    // doc.text(`Quantity:${this.saveDetails.quantity}`,20,yOffset)
    // yOffset += 10;
    // doc.text(`Total:${this.saveDetails.total}`,20,yOffset)
    
  }

  viewPDF(){
    try{
      const doc = this.commonPDF()
      // console.log(doc)
      if(doc){window.open(doc?.output('bloburl'),'_blank');} 
    }catch(err){
      console.error(err)
    }
  }

  onPrint(){
    try{
      const doc = this.commonPDF()
      if(doc){
        doc.autoPrint()
        window.open(doc.output('bloburl'),'_blank')
      }
    }catch(err){
      console.error(err)
    }
  }
}
