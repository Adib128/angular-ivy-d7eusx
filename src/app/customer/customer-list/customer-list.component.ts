import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Customer } from '../../shared/customer.model';   // Student interface class for Data types.
import { ToastrService } from 'ngx-toastr';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {

  customers: any;
  customer: Customer[];

  constructor(private customerService: CustomerService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getCustomersList();
  }

  getCustomersList() {
    this.customerService.getCustomersList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(customers => {
      this.customers = customers;
    });
  }

  deleteCustomer(customer) {
    if (window.confirm('Are sure you want to delete this student ?')) {
      this.customerService
        .deleteCustomer(customer.key)
        .catch(err => console.log(err));
        this.toastr.success(customer.name + ' successfully deleted!'); 
    }
  }

}
