import React, { Component } from 'react'
import {Switch, Route} from 'react-router-dom';
import InteractiveList from './InteractiveList';
import KanjiDefinitionScreen from './KanjiDefinitionScreen';
import DefinitionScreen from './DefinitionScreen';
import WordBank from '../WordBank'
import Practice from '../Practice'
import Settings from '../Settings'

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
                    <Route exact path="/practice" component={Practice}/>
                    <Route exact path="/settings" component={Settings}/>
                </Switch>
            </div>
        )
    }
}

export default JapaneseScreen
