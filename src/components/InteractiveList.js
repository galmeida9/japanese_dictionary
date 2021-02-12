import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '100%',
    height: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function CheckboxListSecondary(props) {
    const classes = useStyles();
    let json = JSON.parse(props.itemToSearch)

    if (json != null) {
        json = json["data"]
        console.log(json)
        return (
            <List dense className={classes.root}>
            {json.map((value) => {
                const labelId = `checkbox-list-secondary-label-${value}`;
                return (
                <ListItem key={value["slug"]} button>
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
                );
            })}
            </List>
        );
    }
    else {
        return (
            <List dense className={classes.root}></List>
        )
    }
}
