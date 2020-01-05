import React from "react"
import Grid from "@material-ui/core/Grid"
import TextField from "@material-ui/core/TextField"
import PropTypes from "prop-types"

const addressFields = [
    {
        label: 'Street',
        google_name: 'route'
    },
    {
        label: 'House number',
        google_name: 'street_number'
    },
    {
        label: 'City',
        google_name: 'locality'
    },
    {
        label: 'Zip code',
        google_name: 'postal_code'
    },
    {
        label: 'Country',
        google_name: 'country'
    }
]

export default function AddressInput(props) {
    const {classes, address, inputController} = props
    return (
        <Grid container justify="space-around" className={classes.container}>
            {addressFields.map((field, key) =>
                <Grid item className={classes.container} key={key}>
                    <TextField
                        value={address[field.google_name] || ''}
                        onChange={inputController(field.google_name)}
                        variant="outlined"
                        id={field.google_name}
                        label={field.label}
                    />
                </Grid>)}
        </Grid>
    )
}

AddressInput.propTypes = {
    classes: PropTypes.object.isRequired,
    address: PropTypes.object,
    inputController: PropTypes.func.isRequired
}