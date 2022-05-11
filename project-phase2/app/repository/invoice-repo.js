import Invoice from "../model/invoice.js"

class InvoiceRepo {
    async addInvoice(invoice) {
        return await Invoice.create(invoice)
    }
    async updateInvoice(updatedInvoice) {
        return await Invoice.findByIdAndUpdate(updatedInvoice.invoiceNo, updatedInvoice)
    }

    async deleteInvoice(invoiceNo) {
        return await Invoice.deleteOne({ _id: invoiceNo })
    }

    async deleteInvoicesByCustomer(customerId) {
        return await Invoice.deleteMany({ customerId })
    }

    async getInvoiceById(invoiceNo) {
        return await Invoice.findOne({ _id: invoiceNo }).populate('customerId')
    }

    async getInvoicesByCustomerId(customerId) {
        return await Invoice.find({ customerId }).populate('customerId')
    }

    async getInvoicesByAmount(amount) {
        return await Invoice.find({ amount }).populate('customerId')
    }

    async getAllInvoices() {
        return await Invoice.find().populate('customerId')
    }

    async getInvoiceReport() {
        return await Invoice.aggregate(
            [
                {
                    '$lookup': {
                        'from': 'payments',
                        'localField': '_id',
                        'foreignField': 'invoiceNo',
                        'as': 'payments'
                    }
                },
                {
                    '$lookup': {
                        'from': 'customers',
                        'localField': 'customerId',
                        'foreignField': '_id',
                        'as': 'customer'
                    }
                },
                {
                    '$unwind': '$customer' //Lookup returns array. Unwind to convert array to object.
                },
                {
                    "$project": {
                        "balance": { '$subtract': ['$amount', { "$sum": "$payments.amount" }] },
                        'customer': 1,
                        'amount': 1,
                        'invoiceDate': 1,
                        'dueDate': 1,
                        'invoiceNo': '$_id'
                    }
                }
            ]
        )
    }
    async getTotalAmountOfInvoices(){
        return Invoice.aggregate([
            {
                '$group': {
                    '_id': null,
                    'totalAmount': {
                        '$sum': '$amount'
                    }
                }
            }
        ]);
    }

    async getInvoiceDueDates(condition){
        if(condition == "less") {
            return Invoice.aggregate([
                {
                    '$project': {
                        'amount': 1,
                        'dueDays': {
                            '$dateDiff': {
                                'startDate': '$$NOW',
                                'endDate': '$dueDate',
                                'unit': 'day'
                            }
                        }
                    }
                }, {
                    '$match': {
                        'dueDays': {
                            '$lt': 30
                        }
                    }
                }, {
                    '$group': {
                        '_id': null,
                        'totalAmount': {
                            '$sum': '$amount'
                        }
                    }
                }
            ])
        }
        else if(condition == "greatEqual") {
            return Invoice.aggregate([
                {
                    '$project': {
                        'amount': 1,
                        'dueDays': {
                            '$dateDiff': {
                                'startDate': '$$NOW',
                                'endDate': '$dueDate',
                                'unit': 'day'
                            }
                        }
                    }
                }, {
                    '$match': {
                        'dueDays': {
                            '$gte': 30
                        }
                    }
                }, {
                    '$group': {
                        '_id': null,
                        'totalAmount': {
                            '$sum': '$amount'
                        }
                    }
                }
            ])
        }
    }
}


export default new InvoiceRepo()