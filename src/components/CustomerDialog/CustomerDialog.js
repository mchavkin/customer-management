import React, {useEffect, useState} from "react"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import TextField from "@material-ui/core/TextField"
import DialogActions from "@material-ui/core/DialogActions"
import Button from "@material-ui/core/Button"
import Paper from "@material-ui/core/Paper"
import {makeStyles} from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"
import getGoogleAddress from "../../api/getGoogleAddress"
import Backdrop from "@material-ui/core/Backdrop"
import CircularProgress from "@material-ui/core/CircularProgress"
import AddressInput from "./AddressInput"
import {messages} from "../../properties/errorsMessages"

const addressFields = ['route', 'street_number', 'locality', 'postal_code', 'country']

const useStyles = makeStyles(theme => ({
    container: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    input: {
        padding: theme.spacing(2)
    },
    addressTitle: {
        padding: theme.spacing(2)
    },
    backdrop: {
        zIndex: theme.zIndex.modal + 1,
        color: '#fff',
    },
    error: {
        color: 'red'
    },
    message: {
        padding: theme.spacing(1)
    }
}))


const validateEntry = customerData => {
    const errors = {}
    if (!customerData.name) errors.name = messages.noName
    if (!customerData.email) {
        errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(customerData.email)) {
        errors.email = 'Invalid email address';
    }
    return errors
}


export default function CustomerDialog(props) {
    const classes = useStyles()
    const [customer, setCustomer] = useState({})
    const [validated, setValidated] = useState(false)
    const [errors, setErrors] = useState({})
    const [noErrors, setNoErrors] = useState(true)
    const [loading, setLoading] = useState(false)
    const [addressSuggestion, setAddressSuggestion] = useState(null)


    const inputController = field => (event => {
        setValidated(false)
        setCustomer({...customer, [field]: event.target.value})
    })

    const handleValidation = () => {
        setLoading(true)
        const {id, name, email, formatted_address, ...address} = customer
        const queryAddress = addressFields
            .reduce((query, field) =>
                (address[field] ? query + ' ' + address[field] : query), '')

        const validatedErrors = validateEntry({name, email})
        getGoogleAddress(queryAddress).then(({data}) => {
            const googleSuggestedAddress = data.results[0]
            if (data.status === 'OK') {
                const result = data.results[0]

                const addressComponents = result.address_components
                    .filter(comp => addressFields.includes(comp.types[0]))
                    .reduce((a,comp) => ({...a, [comp.types[0]]: comp.short_name}), {})
                setAddressSuggestion(Object.assign(
                    {
                        formatted_address: result.formatted_address
                    },
                    addressComponents
                    )
                )
                if (!addressComponents.street_number)
                    validatedErrors.suggestedAddress = messages.noHouseNumber

            } else {
                validatedErrors.suggestedAddress = messages.notFound
            }

        }).catch((error) => {
                validatedErrors.suggestedAddress = error.response.data.error_message
            }
        ).finally(() => {
            setValidated(true)
            setErrors(validatedErrors)
            setNoErrors(!Object.entries(validatedErrors).length)
            setLoading(false)
        })

    }

    const saveCustomer = () => {
        props.saveCustomer({...customer, ...addressSuggestion})
        props.cancel()
    }


    useEffect(() => {
        setCustomer(props.customer)
        setValidated(false)
    }, [props])


    return (
        <>
            <Dialog open={props.open} onClose={props.cancel}>
                <DialogTitle
                    id="form-dialog-title">{props.customer.id ? 'Edit customer data' : 'Register new customer'}</DialogTitle>
                <DialogContent>
                    {validated &&
                    <DialogContentText>
                        Validated
                    </DialogContentText>
                    }
                    <Grid container justify="space-around" className={classes.container}>
                        <Grid item>
                            <TextField
                                value={customer.name || ''}
                                onChange={inputController('name')}
                                variant="outlined"
                                autoFocus
                                required
                                id="name"
                                label="Full name"
                                error={!!(validated && errors.name)}
                                helperText={validated && errors.name}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                value={customer.email || ''}
                                onChange={inputController('email')}
                                variant="outlined"
                                id="email"
                                label="Email Address"
                                type="email"
                                error={!!(validated && errors.email)}
                                helperText={validated && errors.email}
                            />
                        </Grid>
                    </Grid>

                    <Paper className={classes.container} elevation={3}>
                        <Typography variant="h6" className={classes.addressTitle}>
                            Address
                        </Typography>

                        {validated &&
                        <>
                            {addressSuggestion &&
                            <>
                                <Typography paragraph className={classes.message}>
                                    We found the following address:
                                </Typography>
                                <Typography paragraph className={classes.message}>
                                    {addressSuggestion.formatted_address}
                                </Typography>
                            </>
                            }

                            {errors.suggestedAddress &&
                            <Typography paragraph align="center" className={classes.error}>
                                {errors.suggestedAddress}
                            </Typography>}
                        </>
                        }

                        {!validated &&
                        <AddressInput classes={classes} address={customer}
                                      inputController={inputController}/>
                        }

                    </Paper>
                </DialogContent>
                <DialogActions>
                    < Button onClick={props.cancel} color="primary">
                        Cancel
                    </Button>

                    {validated ?
                        <>
                            <Button onClick={() => {
                                setValidated(false)
                            }}
                                    color="primary">
                                Edit original entry
                            </Button>

                            {addressSuggestion &&
                            <Button onClick={() => {
                                setValidated(false)
                                setCustomer({...customer, ...addressSuggestion})
                            }}
                                    color="primary">
                                Edit suggested entry
                            </Button>
                            }

                            {noErrors &&
                            <Button onClick={saveCustomer}
                                    color="primary">
                                Save
                            </Button>
                            }
                        </>
                        :
                        <Button onClick={handleValidation}
                                color="primary">
                            Validate
                        </Button>
                    }
                </DialogActions>
            </Dialog>
            <Backdrop
                className={classes.backdrop}
                open={loading} timeout={1}>
                <CircularProgress/>
            </Backdrop>
        </>
    )
}

