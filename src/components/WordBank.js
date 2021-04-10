import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { useHistory } from 'react-router-dom';
import ImportContactsRoundedIcon from '@material-ui/icons/ImportContacts';
import WordBankContext from './WordBankContext';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import FilterListIcon from '@material-ui/icons/FilterList';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    { id: 'kanji', numeric: false, disablePadding: true, label: 'Word' },
    { id: 'def', numeric: false, disablePadding: false, label: 'Definition' },
    { id: 'hira', numeric: false, disablePadding: false, label: 'Hiragana' },
    { id: 'english', numeric: false, disablePadding: false, label: 'English' },
    { id: 'jlpt', numeric: false, disablePadding: false, label: 'JLPT Level' },
];

function EnhancedTableHead(props) {
    const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{ 'aria-label': 'select all words' }}
                        color="primary"
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
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
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: 'black',
                backgroundColor: lighten(theme.palette.primary.light, 0.7),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.primary.dark,
            },
    title: {
        flex: '1 1 100%',
    },
}));

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        userSelect: 'none'
    },
    paper: {
        width: '100%',
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
    selected:
        theme.palette.type === 'light'
            ? {
                backgroundColor: lighten(theme.palette.primary.light, 0.7) + '!important'
            } : {
                backgroundColor: lighten(theme.palette.primary.main, 0.2) + '!important'
            }
}));

export default function WordBank() {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [open, setOpen] = React.useState(false);
    const [displayed, setDisplayed] = React.useState([]);
    const [search, setSearch] = React.useState("");
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [width, setWidth] = React.useState(window.innerWidth);
    const [filterChip, setFilterChip] = React.useState(false);
    const [jlpt, setJlpt] = React.useState("");

    const history = useHistory();
    const context = useContext(WordBankContext);
    const classes = useStyles();

    window.addEventListener('resize', () => { setWidth(window.innerWidth); })

    useEffect(() => {
        copyWords();
    }, [])

    const copyWords = () => {
        let list = [];
        context.state.japanese.forEach((word) => {
            list.push(word);
        });

        setDisplayed(list);
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };


    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = displayed.map((n) => n.kanji);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, displayed.length - page * rowsPerPage);

    const deleteWords = () => {
        selected.forEach((word) => {
            context.removeValue(word);
            let wordsCopy = displayed;
            let index = wordsCopy.map(e => e.kanji).indexOf(word)
            if (index != -1) {
                displayed.splice(index, 1);
            }
        });
        setOpen(true);
        setSelected([]);
        setDisplayed(displayed);
    }

    const openDefinition = (name) => {
        if (name.length > 1) {
            history.push("/Definition/" + name);
        }
        else {
            history.push("/kanjiDefinition/" + name);
        }
    }

    const searchEvent = (event) => {
        if (event.keyCode == 13) {
            console.log("test")
            let query = event.target.value;
            searchWord(query);
            if (filterChip) filter(jlpt, false, query);
        }
    }

    const searchWord = (query) => {
        setSearch(query);
        let newList = [];
        context.state.japanese.forEach((word) => {
            if (word.kanji.includes(query) || (word.hira != null && word.hira.includes(query)) || word.english.includes(query)) {
                newList.push(word);
            }
        });

        setDisplayed(newList);
        return newList;
    }

    const clearSearch = () => {
        searchWord("");
        if (filterChip) filter(jlpt, true);
    }

    const filter = (level, clear = false, input = search) => {
        let newList = []
        let listToSearch = context.state.japanese;

        if (!clear) {
            listToSearch = searchWord(input);
        }

        listToSearch.forEach((word) => {
            if (word.jlpt == level) {
                newList.push(word);
            }
        });

        closeFilter();
        setDisplayed(newList);
        setJlpt(level);
        setFilterChip(true);
    }

    const clearFilter = () => {
        setFilterChip(false);
        if (search != "") searchWord(search);
        else searchWord("");
    }

    const openFilter = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const closeFilter = () => {
        setAnchorEl(null);
    }

    const EnhancedTableToolbar = (props) => {
        const classesToolBar = useToolbarStyles();
        const { numSelected } = props;

        return (
            <Toolbar
                className={clsx(classesToolBar.root, {
                    [classesToolBar.highlight]: numSelected > 0,
                })}
            >
                {numSelected > 0 ? (
                    <Typography className={classesToolBar.title} color="inherit" variant="subtitle1" component="div">
                        {numSelected} selected
                    </Typography>
                ) : (
                        <Typography className={classesToolBar.title} variant="h6" id="tableTitle" component="div">
                            Your Word Bank
                        </Typography>
                    )}

                {numSelected > 0 ? (
                    <Tooltip title="Delete">
                        <IconButton aria-label="delete" onClick={() => { deleteWords() }}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                ) : (
                        <div style={{ display: "flex" }}>
                            {search != "" ? (<Chip label={search} onDelete={clearSearch} color="primary" style={{ marginRight: '12pt', marginTop: '12pt' }} />) : null}
                            {filterChip != "" ? (<Chip label={jlpt} onDelete={clearFilter} color="secondary" style={{ marginRight: '12pt', marginTop: '12pt' }} />) : null}
                            <TextField id="standard-basic" label="Search Word Bank" onKeyDown={searchEvent} style={{ marginRight: '10pt', width: '140pt' }} />
                            <IconButton style={{ marginTop: '8pt' }} onClick={openFilter} aria-controls="simple-menu" aria-haspopup="true">
                                <FilterListIcon />
                            </IconButton>
                            <Menu
                                id="simple-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={closeFilter}
                                PaperProps={{
                                    style: {
                                        left: '50%',
                                        transform: `translateX(${width - 130}px) translateY(80pt)`,
                                    }
                                }}
                            >
                                <Typography style={{ paddingRight: '8pt', paddingLeft: '8pt', paddingBottom: '4pt' }}>JLPT Level</Typography>
                                <Divider />
                                <MenuItem onClick={() => { filter("N1") }}>N1</MenuItem>
                                <MenuItem onClick={() => { filter("N2") }}>N2</MenuItem>
                                <MenuItem onClick={() => { filter("N3") }}>N3</MenuItem>
                                <MenuItem onClick={() => { filter("N4") }}>N4</MenuItem>
                                <MenuItem onClick={() => { filter("N5") }}>N5</MenuItem>
                            </Menu>
                        </div>)}
            </Toolbar>
        );
    };

    EnhancedTableToolbar.propTypes = {
        numSelected: PropTypes.number.isRequired,
    };

    return (
        <div className={classes.root}>
            <Snackbar open={open} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleClose} severity="success">
                    Deleted word from Word Bank
                </Alert>
            </Snackbar>
            <Paper className={classes.paper}>
                <EnhancedTableToolbar numSelected={selected.length} />
                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size='medium'
                        aria-label="enhanced table"
                    >
                        <EnhancedTableHead
                            classes={classes}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={displayed.length}
                        />
                        <TableBody>
                            {stableSort(displayed, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const isItemSelected = isSelected(row.kanji);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.kanji}
                                            selected={isItemSelected}
                                            classes={{ selected: classes.selected }}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    onClick={(event) => handleClick(event, row.kanji)}
                                                    checked={isItemSelected}
                                                    inputProps={{ 'aria-labelledby': labelId }}
                                                    color="primary"
                                                />
                                            </TableCell>
                                            <TableCell component="th" id={labelId} scope="row" padding="none" style={{ fontSize: '14pt' }}>
                                                {row.kanji}
                                            </TableCell>
                                            <TableCell align="left">
                                                <IconButton onClick={() => openDefinition(row.kanji)} >
                                                    <ImportContactsRoundedIcon
                                                        style={{ cursor: 'pointer' }}
                                                    />
                                                </IconButton>
                                            </TableCell>
                                            <TableCell align="left" style={{ fontSize: '14pt' }}>{row.hira}</TableCell>
                                            <TableCell align="left" style={{ fontSize: '12pt' }}>{row.english}</TableCell>
                                            <TableCell align="left" style={{ fontSize: '12pt' }}>{row.jlpt}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 53 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={displayed.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    )
}
