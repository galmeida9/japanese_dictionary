import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function DefinitionScreen(props) {
    const JishoApi = require('unofficial-jisho-api');
    const jisho = new JishoApi();

    useEffect(() => {
        performSearch();
    })
    
    const performSearch = () => {
        // jisho.searchForKanji(props.match.params.name).then((data) => {
        //     console.log(JSON.stringify(data, null, 2))
        //   });
      }

    return (
        <div>
            <Link to="/"><p>back</p></Link>
            <h1>{props.match.params.name}</h1>
        </div>
    )
}

