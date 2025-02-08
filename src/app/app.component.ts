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
  total: number = 0;
  saveDetails: any = null;

  calculateTotal(){
    const price = this.orderDetails.price
    const quantity = this.orderDetails.quantity
    if((price) && (quantity)){
      this.total = price * quantity;
    }else{
      this.total = 0
    }
  }
  onSubmit(){
    // console.log(this.userDetails, this.orderDetails)
    this.saveDetails ={
      name: this.userDetails.name,
      contact: this.userDetails.contact,
      product: this.orderDetails.product,
      price: this.orderDetails.price,
      quantity: this.orderDetails.quantity,
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
      this.orderDetails.product &&
      this.orderDetails.price > 0 &&
      this.orderDetails.quantity > 0
    )
  }
  isValidContact(contact: string): boolean {
    return /^\d{10}$/.test(contact);
  }

  resetForm(){
    this.userDetails= ''
    this.orderDetails= ''
    this.total = 0
  }

  generatePDF(){
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
    doc.text(`Product:${this.saveDetails.product}`,20,yOffset)
    yOffset += 10;
    const columns = ['Price', 'Quantity', 'Total']
    const rows = [
      [this.saveDetails.price, this.saveDetails.quantity, this.saveDetails.total]
    ] 
    autoTable(doc,{
      head: [columns],
      body: rows,
      startY: yOffset,
      theme: 'grid',
      styles: {fontSize:12, cellPadding: 3},
      headStyles: {fillColor: [22,160,133]}
    })
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


    
    doc.save('OrderDetails.pdf')
  }
}
