import React from 'react';
import SearchAppBar from './components/SearchAppBar';
import InteractiveList from './components/InteractiveList'
import Toolbar from '@material-ui/core/Toolbar';

class App extends React.Component {
  state = {
    searchValue: null
  }

  constructor(props: any) {
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
        <InteractiveList itemToSearch={this.state.searchValue} />
      </div>
    );
  }
}

export default App;
