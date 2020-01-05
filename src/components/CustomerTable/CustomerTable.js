import React, {useEffect, useState} from 'react'
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
import CustomerTableHead from "./CustomerTableHead"
import Button from "@material-ui/core/Button"
import DeleteConfirmation from "./DeleteConfirmation"
import PropTypes from "prop-types"

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
        minWidth: 550,
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
    const [orderBy, setOrderBy] = useState(null)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [deleteCustomer, setDeleteCustomer] = useState(null)
    const [filteredRows, setFilteredRows] = useState(props.customers)
    const [filter, setFilter] = useState(
        {
            name: '',
            email: '',
            formatted_address: ''
        })

    useEffect(() => {
    const filteredCustomers = props.customers.filter(customer =>
        customer.name.toLowerCase().includes(filter.name.toLowerCase()) &&
                        customer.email.toLowerCase().includes(filter.email.toLowerCase()) &&
                        customer.formatted_address.toLowerCase().includes(filter.formatted_address.toLowerCase()))
        setFilteredRows(filteredCustomers)
        setPage(0)
    }, [props.customers, filter])


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

                {!props.customers.length ?
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
                                    order={order}
                                    orderBy={orderBy}
                                    onRequestSort={handleRequestSort}
                                    rowCount={filteredRows.length}
                                    filter = {filter}
                                    onFilterChange = {setFilter}
                                />
                                <TableBody>
                                    {stableSort(filteredRows, getSorting(order, orderBy))
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map(row => {
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
                                                                setDeleteCustomer(row)
                                                            }}>
                                                                <DeleteIcon/>
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>

                                                    <TableCell component="th" scope="row" padding="none">
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
                            count={filteredRows.length}
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

CustomerTable.propTypes = {
    customers: PropTypes.object,
    addOrEditCustomer: PropTypes.func.isRequired,
    deleteCustomer: PropTypes.func.isRequired
}
