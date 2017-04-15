// @flow

import m from 'mithril';

// Service for managing customers
class CustomerService {

  static instance = null;

  // Return singleton
  static get() {
    if (!CustomerService.instance) {
      CustomerService.instance = new CustomerService();
    }
    return CustomerService.instance;
  }

  // Get a list of all customers
  getCustomers() {
    return m.request({
      method: "GET",
      url: "/customers"
    }).then((res) => {
      return res;
    }).catch((e) => {
      throw e.message;
    })
  }

  // Get customer by id
  getCustomer(id) {
    return m.request({
      method: "GET",
      url: "/customers/" + id
    }).then((res) => {
      return res;
    }).catch((e) => {
      throw e.message;
    });
  }

  // Add a new customer
  addCustomer(name, city) {
    return m.request({
      method: "POST",
      url: "/customers",
      data: {name: name, city: city}
    }).then((res) => {
      return res;
    }).catch((e) => {
      throw e.message;
    });
  }
}

// Component that displays a clickable list of all customers,
// also with functionality for adding new customers
class CustomerList {

  status = "";
  customers = [];
  name = "";
  city = "";

  constructor() {
    CustomerService.get().getCustomers().then((res) => {
      this.customers = res;
      this.status = "successfully loaded customer list";
    }).catch((e) => {
      this.status = "error: " + e;
    });
  }

  onNewCustomer = (event) => {
    event.preventDefault();
    var name = this.name;
    var city = this.city;
    CustomerService.get().addCustomer(name, city).then((res) => {
      this.customers.push({id: res, name: name, city: city});
      this.status = "successfully added new customer";
      this.name = "";
      this.city = "";
    }).catch((e) => {
      this.status = "error: " + e;
    });
  }

  view() {
    var listItems = this.customers.map((customer) => {
      return <li key={customer.id}><a href={"/#!/customer/"+customer.id}>{customer.name}</a></li>;
    });
    return (
      <div>
      status: {this.status}<br/>
      <ul>{listItems}</ul>
      <form onsubmit={this.onNewCustomer}>
      <label>Name:<input type="text" name="newCustomerName" onchange={m.withAttr("value", (val) => {this.name = val})} value={this.name} /></label>
      <label>City:<input type="text" name="newCustomerCity" onchange={m.withAttr("value", (val) => {this.city = val})} value={this.city} /></label>
      <input type="submit" value="New Customer"/>
      </form>
      </div>
    );
  }

}

// Component that displays details for a selected customer
class CustomerDetails {

  status = "";
  customer = {};

  constructor(vnode) {
    var id = vnode.attrs.id;
    CustomerService.get().getCustomer(id).then((res) => {
      this.customer = res;
      this.status = "successfully loaded customer details";
    }).catch((e) => {
      this.status = "error: " + e;
    });
  }

  view() {
    return (
      <div>
      status: {this.status}<br/>
      <ul>
      <li>name: {this.customer.name}</li>
      <li>city: {this.customer.city}</li>
      </ul>
      </div>
    );
  }
}

// Component that displays a simple menu
class Menu {
  view() {
    return (
      <div>
      Menu: <a href="/#!/">Customers</a>
      </div>
    );
  }
}

// Component that displays Menu combined with CustomerList
class Home {
  view() {
    return [
      m(Menu),
      m(CustomerList)
    ];
  }
}

// Component that displays Menu combined with CustomerDetails
class Details {
  view(vnode) {
    return [
      m(Menu),
      m(CustomerDetails, {id: vnode.attrs.id})
    ];
  }
}

// Routing
m.route(document.body, "/", {
  "/": Home,
  "/customer/:id": Details
});
