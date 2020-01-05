import React from "react"
import Dialog from "@material-ui/core/Dialog"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogActions from "@material-ui/core/DialogActions"
import Button from "@material-ui/core/Button"
import PropTypes from "prop-types"


export default function DeleteConfirmation(props) {
    const deleteCustomer = () => {
        props.deleteCustomer(props.customer.id)
        props.closeConfirmation()
    }

    return(
        <Dialog xs open={!!props.customer} onClose={props.closeConfirmation}>
            <DialogContent>
                <DialogContentText>
                    {props.customer &&
                    `Are you sure you want to delete customer ${props.customer.name}`}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                < Button onClick={props.closeConfirmation} color="primary">
                    Cancel
                </Button>
                < Button onClick={deleteCustomer} color="primary">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    )
}

DeleteConfirmation.propTypes = {
    customer: PropTypes.object,
    deleteCustomer: PropTypes.func.isRequired,
    closeConfirmation: PropTypes.func.isRequired
}