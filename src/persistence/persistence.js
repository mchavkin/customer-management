const saveCustomers = (customers) => {
    localStorage.setItem('customers', JSON.stringify(customers))
}

const generateId = () => {
    const id = Number(localStorage.getItem('lastId')) + 1
    localStorage.setItem('lastId', id)
    return id
}

export const getCustomers = () => {
    const customers = JSON.parse(localStorage.getItem('customers'))
    return customers ? customers : []
}

export const deleteCustomer = (id) => {
    const updatedCustomers = getCustomers().filter(customer => id !== customer.id)
    saveCustomers(updatedCustomers)
    return updatedCustomers
}

export const saveCustomer = (customer) => {
    const customers = customer.id ?
        getCustomers().filter(c => customer.id !== c.id) : getCustomers()

    customer.id = generateId()
    customers.unshift(customer)
    saveCustomers(customers)
    return customers
}

export const getApiKey = () => {
    return localStorage.getItem('apiKey')
}

export const saveApiKey = (apiKey) => {
    localStorage.setItem('apiKey', apiKey)
}
