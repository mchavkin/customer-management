import React, {useState} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Typography from "@material-ui/core/Typography"
import Toolbar from "@material-ui/core/Toolbar"
import Tooltip from "@material-ui/core/Tooltip"
import IconButton from "@material-ui/core/IconButton"
import PersonAddIcon from "@material-ui/icons/PersonAdd"
import DeleteIcon from '@material-ui/icons/Delete'
import CustomerTableHead from "./TableHead"
import Button from "@material-ui/core/Button"
import DeleteConfirmation from "./DeleteConfirmation"

function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1
    }
    if (b[orderBy] > a[orderBy]) {
        return 1
    }
    return 0
}

function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index])
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0])
        if (order !== 0) return order
        return a[1] - b[1]
    })
    return stabilizedThis.map(el => el[0])
}

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy)
}


const useStyles = makeStyles(theme => ({
    paper: {
        margin: '1%',
        width: '98%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
    title: {
        flex: '1 1 100%',
    },
}))

export default function CustomerTable(props) {
    const classes = useStyles()
    const [order, setOrder] = useState('asc')
    const [orderBy, setOrderBy] = useState('calories')
    const [selected, setSelected] = useState([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [deleteCustomer, setDeleteCustomer] = useState(null)

    const rows = props.customers


    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    return (
        <>
            <Paper className={classes.paper}>

                <Toolbar>
                    <Typography className={classes.title} variant="h6" id="tableTitle">
                        Customers
                    </Typography>
                    <Tooltip title="New customer">
                        <Button
                            onClick={() => props.addOrEditCustomer({})}
                            variant="contained"
                            color="primary"
                            startIcon={<PersonAddIcon/>}
                        >
                            New customer
                        </Button>
                    </Tooltip>
                </Toolbar>

                {!rows.length ?
                    <Typography>
                        There are no registered customers. To add a customer click the button at the right upper corner
                    </Typography>
                    :
                    <>
                        <TableContainer>
                            <Table
                                className={classes.table}
                            >
                                <CustomerTableHead
                                    classes={classes}
                                    numSelected={selected.length}
                                    order={order}
                                    orderBy={orderBy}
                                    onRequestSort={handleRequestSort}
                                    rowCount={rows.length}
                                />
                                <TableBody>
                                    {stableSort(rows, getSorting(order, orderBy))
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                            const labelId = `enhanced-table-checkbox-${index}`

                                            return (
                                                <TableRow
                                                    hover
                                                    onClick={() => props.addOrEditCustomer(row)}
                                                    key={row.id}
                                                >
                                                    <TableCell padding="checkbox">
                                                        <Tooltip title="Delete customer">
                                                            <IconButton onClick={(event) => {
                                                                event.stopPropagation()
                                                                // props.deleteCustomer(row.id)
                                                                setDeleteCustomer(row)
                                                            }}>
                                                                <DeleteIcon/>
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>

                                                    <TableCell component="th" id={labelId} scope="row" padding="none">
                                                        {row.name}
                                                    </TableCell>
                                                    <TableCell>{row.email}</TableCell>
                                                    <TableCell>
                                                        {row.formatted_address}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        < TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                    </>
                }
                <DeleteConfirmation
                    customer={deleteCustomer}
                    closeConfirmation={() => setDeleteCustomer(null)}
                    deleteCustomer={props.deleteCustomer}
                 />
            </Paper>
        </>
    )
}
