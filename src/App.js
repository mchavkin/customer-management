import React, {useState} from 'react'
import './App.css';
import CustomerTable from "./components/CustomerTable/CustomerTable"
import {makeStyles} from "@material-ui/core/styles"
import CustomerDialog from "./components/CustomerDialog/CustomerDialog"
import * as persistence from './persistence/persistence'

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
    }
}))

function App() {
    const classes = useStyles()
    const [customers, setCustomers] = useState(persistence.getCustomers())
    const [openCustomerDialog, setOpenCustomerDialog] = useState(false)
    const [customerData, setCustomerData] = useState({})

    const addOrEditCustomer = customer => {
        setCustomerData(customer)
        setOpenCustomerDialog(true)
    }

    const saveCustomer = customer => {
        setCustomers(persistence.saveCustomer(customer))
        setOpenCustomerDialog(false)
    }

    const deleteCustomer = id => {
        setCustomers(persistence.deleteCustomer(id))
    }

    return (
        <div className={classes.root}>
            <CustomerTable
                customers={customers}
                addOrEditCustomer={addOrEditCustomer}
                deleteCustomer={deleteCustomer}
            />
            <CustomerDialog
                open={openCustomerDialog}
                cancel={() => setOpenCustomerDialog(false)}
                saveCustomer={saveCustomer}
                customer={customerData}
            />
        </div>
    )
}

export default App;
