const db = new Localbase('yalapay.db')

export class CustomerRepo {
    addCustomer(customer) {
        try {
            return db.collection('customer').add(customer)
        } catch (e) {
            console.log(e)
        }
    }

    updateCustomer(updatedCustomer) {
        try {
            return db.collection('customer').doc({ customerId: updatedCustomer.customerId }).update(updatedCustomer)
        } catch (e) {
            console.log(e)
        }
    }

    deleteCustomer(customerId) {
        try {
            return db.collection('customer').doc({ customerId }).delete()
        } catch (e) {
            console.log(e)
        }
    }

    async getCustomerById(customerId) {
        try {
            const customers = await this.getAllCustomers()
            for (const customer of customers) {
                if (customer.customerId == customerId) return customer
            }
            return undefined;
        } catch (e) {
            console.log(e)
        }
    }

    async getCustomerByCompanyName(companyName) {
        const resultCustomers = [];
        try {
            const customers = await this.getAllCustomers()
            for (const customer of customers) {
                if (customer.companyName.toLowerCase().includes(companyName.toLowerCase()))
                    resultCustomers.push(customer)
            }
            return resultCustomers;
        } catch (e) {
            console.log(e)
        }
    }

    async getCustomerByCity(city) {
        const resultCustomers = [];
        try {
            const customers = await this.getAllCustomers()
            for (const customer of customers) {
                if (customer.address.city.toLowerCase() == city.toLowerCase())
                    resultCustomers.push(customer)
            }
            return resultCustomers;
        } catch (e) {
            console.log(e)
        }
    }

    getAllCustomers() {
        try {
            return db
                .collection('customer')
                .get()
        } catch (e) {
            console.log(e)
        }
    }
}
