import React, {useState} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import * as persistence from '../../persistence/persistence'
import TextField from "@material-ui/core/TextField"
import Box from "@material-ui/core/Box"

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    apiKeyMessage: {
        flexGrow: 1,
    },
    apiKeyInput: {
        color: 'white',
        width: '25em'

    }
}))

export default function GeocodeBar() {
    const classes = useStyles()
    const [apiKey, setApiKey] = useState(persistence.getApiKey())
    const [keyInputActive, setKeyInputActive] = useState(false)

    const saveApiKey = () => {
        persistence.saveApiKey(apiKey)
        setKeyInputActive(false)
    }

    const cancelApiKey = () => {
        debugger
        setApiKey(persistence.getApiKey())
        setKeyInputActive(false)
    }


    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    {!keyInputActive &&
                    <>
                        <Typography className={classes.apiKeyMessage}>
                            {apiKey ?
                                `Active Google API Key is "${apiKey}"`
                                :
                                `API key is not available. To input API key, click the button`}
                        </Typography>
                        <Button
                            onClick={() => setKeyInputActive(true)}
                            color="inherit"
                            startIcon={<LockOpenIcon/>}>
                            {apiKey ? 'change key' : 'input key'}
                        </Button>
                    </>
                    }
                    {keyInputActive &&
                    <>
                        <Box component="span" className={classes.apiKeyMessage}>
                            <TextField className={classes.apiKeyInput}
                                       value={apiKey || ''}
                                       onChange={event => {
                                           setApiKey(event.target.value)
                                       }}
                                       helperText='Input a valid Google API key'
                                       InputProps={{style: {color: 'white'}}}
                                       FormHelperTextProps={{style: {color: 'white'}}}
                            />
                        </Box>
                        <Button
                            onClick={saveApiKey}
                            color="inherit">
                            save
                        </Button>
                        <Button
                            onClick={cancelApiKey}
                            color="inherit">
                            cancel
                        </Button>
                    </>
                    }
                </Toolbar>
            </AppBar>
        </div>
    )
}
