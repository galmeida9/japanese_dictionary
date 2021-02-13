import React, { Component } from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import InteractiveList from './InteractiveList'
import KanjiDefinitionScreen from './KanjiDefinitionScreen'
import DefinitionScreen from './DefinitionScreen'

export class JapaneseScreen extends Component {
    render() {
        return (
            <div>
                <Router>
                    <Switch>
                        <Route path="/" exact render={(props) => (
                            <InteractiveList {...props} itemToSearch={this.props.itemToSearch} />
                        )}/>
                        <Route path="/kanjiDefinition/:name" component={KanjiDefinitionScreen}/>
                        <Route path="/Definition/:name" component={DefinitionScreen}/>
                    </Switch>
                </Router>
            </div>
        )
    }
}

export default JapaneseScreen
