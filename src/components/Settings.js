import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { lightTheme, darkTheme } from './themes';
import WordBankContext from './WordBankContext';

const useStyles = makeStyles({
    root: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '10pt'
    },
});

export default function Settings (props) {
    const classes = useStyles();
    const context = useContext(WordBankContext);
    
    const [state, setState] = React.useState({
        dark: context.state.dark
    });
    
    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
        event.target.checked ? props.theme(darkTheme) : props.theme(lightTheme);
        context.setTheme(event.target.checked);
    };

    return (
        <div className={classes.root}>
            <FormControl component="fieldset">
                <FormLabel component="legend">Personalization options</FormLabel>
                <FormGroup>
                    <FormControlLabel
                    control={<Switch checked={state.dark} onChange={handleChange} name="dark" color="primary" />}
                    label="Dark Mode"
                    />
                </FormGroup>
            </FormControl>
        </div>
    )
}
