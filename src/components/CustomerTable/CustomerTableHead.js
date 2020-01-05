import React from "react"
import PropTypes from "prop-types"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import TableCell from "@material-ui/core/TableCell"
import TableSortLabel from "@material-ui/core/TableSortLabel"
import TextField from "@material-ui/core/TextField"
import InputAdornment from "@material-ui/core/InputAdornment"
import FilterListIcon from '@material-ui/icons/FilterList'


const headCells = [
    {id: 'name', disablePadding: true, label: 'Name'},
    {id: 'email', disablePadding: false, label: 'Email'},
    {id: 'formatted_address', disablePadding: false, label: 'Address'},
];


export default function CustomerTableHead(props) {
    const {classes, order, orderBy, onRequestSort} = props;
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };


    const createFilterChangeHandler = (field) => (event) => {
        props.onFilterChange({...props.filter, [field]: event.target.value})
    }

    return (
        <TableHead>
            <TableRow>
                <TableCell/>
                {headCells.map(headCell => (
                    <TableCell
                        key={headCell.id}
                        align={'left'}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <div>
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                                {orderBy === headCell.id ? (
                                    <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
                                ) : null}
                            </TableSortLabel>
                        </div>
                        <div>
                            <TextField
                                value={props.filter[headCell.id]}
                                onChange={createFilterChangeHandler(headCell.id)}
                                variant={'outlined'}
                                margin={'dense'}
                                size={'small'}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <FilterListIcon/>
                                        </InputAdornment>)

                                }}/>
                        </div>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

CustomerTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string,
    filter: PropTypes.object.isRequired,
    onFilterChange: PropTypes.func.isRequired
};
