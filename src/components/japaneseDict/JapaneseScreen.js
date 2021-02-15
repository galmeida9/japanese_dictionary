import React, { Component } from 'react'
import {Switch, Route} from 'react-router-dom';
import InteractiveList from './InteractiveList';
import KanjiDefinitionScreen from './KanjiDefinitionScreen';
import DefinitionScreen from './DefinitionScreen';
import WordBank from '../WordBank'

export class JapaneseScreen extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route path="/" exact render={(props) => (
                        <InteractiveList {...props} itemToSearch={this.props.itemToSearch} />
                    )}/>
                    <Route path="/kanjiDefinition/:name" component={KanjiDefinitionScreen}/>
                    <Route path="/Definition/:name" component={DefinitionScreen}/>
                    <Route exact path="/wordBank" component={WordBank}/>
                </Switch>
            </div>
        )
    }
}

export default JapaneseScreen
