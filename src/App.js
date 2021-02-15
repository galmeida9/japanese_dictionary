import React from 'react';
import SearchAppBar from './components/SearchAppBar';
import Toolbar from '@material-ui/core/Toolbar';
import JapaneseScreen from './components/japaneseDict/JapaneseScreen';

class App extends React.Component {
  state = {
    searchValue: null
  }

  constructor(props) {
    super(props)
    this.saveItemToSearch = this.saveItemToSearch.bind(this)
  }
  
  saveItemToSearch(item) {
    this.setState({searchValue: item})
  }

  render() {
    return (
      <div className="App">
          <SearchAppBar SearchData={this.saveItemToSearch}/>
          <Toolbar />
          <JapaneseScreen itemToSearch={this.state.searchValue}/>
      </div>
    );
  }
}

export default App;
