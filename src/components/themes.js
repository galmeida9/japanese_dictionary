import { createMuiTheme } from '@material-ui/core/styles';

export const lightTheme = createMuiTheme({
    palette: {
        type: "light",
    }
})

export const darkTheme = createMuiTheme({
    palette: {
        type: "dark",
        background: {
            default: "#424242"
        }
    }
})