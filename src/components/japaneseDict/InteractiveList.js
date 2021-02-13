import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import { Link } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '100%',
    height: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  noResults: {
      textAlign: 'center'
  }
}));

const makeUrl = (name) => {
    if (name.length == 1) {
        return "/kanjiDefinition/" + name
    }
    else {
        return "/definition/" + name
    }
}

export default function CheckboxListSecondary(props) {
    const classes = useStyles();
    let json = JSON.parse(props.itemToSearch)

    if (json != null && json["data"].length > 0) {
        json = json["data"]
        console.log(json)
        return (
            <List dense className={classes.root}>
            {json.map((value) => {
                const labelId = `checkbox-list-secondary-label-${value}`;
                return (
                <Link key={value["slug"]} to={makeUrl(value["slug"])} style={{ textDecoration: 'none', color: 'black' }}>
                    <ListItem button>
                            <ListItemText id={labelId} 
                                primary={`${value["slug"]}`} 
                                secondary={`${value["japanese"][0]["reading"]}`} 
                                primaryTypographyProps={{variant: "h6"}}    
                            />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="delete">
                                <AddIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                </Link>
                );
            })}
            </List>
        );
    }
    else {
        return (
            <h1 className={classes.noResults}>Search something in the search bar :)</h1>
        )
    }
}
