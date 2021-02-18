import React from 'react';
import SearchAppBar from './components/SearchAppBar';
import Toolbar from '@material-ui/core/Toolbar';
import JapaneseScreen from './components/japaneseDict/JapaneseScreen';
import { ThemeProvider } from '@material-ui/core/styles';
import { lightTheme } from './components/themes';
import CssBaseline from "@material-ui/core/CssBaseline";

class App extends React.Component {
  state = {
    searchValue: null,
    currTheme: lightTheme,
  }

  constructor(props) {
    super(props)
    this.saveItemToSearch = this.saveItemToSearch.bind(this);
    this.toggleThemes = this.toggleThemes.bind(this);
  }
  
  saveItemToSearch(item) {
    this.setState({searchValue: item});
  }

  toggleThemes(theme) {
    this.setState({currTheme: theme});
  }

  render() {
    return (
      <ThemeProvider theme={this.state.currTheme}>
        <CssBaseline />
        <div className="App">
            <SearchAppBar SearchData={this.saveItemToSearch}/>
            <Toolbar />
            <JapaneseScreen itemToSearch={this.state.searchValue} theme={this.toggleThemes} />
        </div>
      </ThemeProvider>
    );
  }
}

export default App;
