///////////////////////////////////////////////////////////////////////////////
// SETUP: DEPENDENCIES AND CONSTANTS
///////////////////////////////////////////////////////////////////////////////
import React, { useState, useCallback, useEffect } from 'react';

import ReactDOM from 'react-dom';

import {
    flatten,
    uniq,
    capitalize,
    isString,
    sortBy,
    reverse,
    isNumber,
    orderBy,
} from 'lodash';

import './index.css';

// Constants
const AZ = 1;
const ZA = 2;

let statusTable = {};

///////////////////////////////////////////////////////////////////////////////
// DATA GRID COMPONENTS
///////////////////////////////////////////////////////////////////////////////
// A single cell in a data grid
const Cell = ({ datum }) => {
    return (
        <td onClick={(e) => console.log(e.target)}>
            {isString(datum) && datum.toLowerCase().endsWith('.png') ? (
                <img src={datum} />
            ) : isNumber(datum) ? (
                datum.toLocaleString()
            ) : (
                datum
            )}
        </td>
    );
};

// A cell in a header row in a data grid
const HeaderCell = ({ title, onClick }) => {
    return <th onClick={onClick}>{capitalize(title)}</th>;
};

///////////////////////////////////////////////////////////////////////////////
// DATAGRID COMPONENT WITH INSTANTIATION
///////////////////////////////////////////////////////////////////////////////
const DataGrid = () => {
    // Load the data from JSON, which you can find at:
    // https://assets.codepen.io/5781725/states-data.json
    // We include some data for testing purposes
    // {
    //    state:"Alabama",
    //    abbreviation:"AL",
    //    population:4921532,
    //    size:52420.07,
    // },
    // {
    //    state:"Alaska",
    //    abbreviation:"AK",
    //    population:731158,
    //    size:665384.04,
    // },

    // State
    const [sortedOn, setSortedOn] = useState(['none', AZ]); // ==> figure out a way to use this
    const [pinnedColumns, setPinnedColumns] = useState([]);
    const [data, setData] = useState([]);

    // Preprocess the data to get a list of columns and add a helper index
    const columns = uniq(
        flatten(
            data.map((row) =>
                Object.keys(row).filter((key) => !key.startsWith('_'))
            )
        )
    );

    /* TODO: Load the data from the URL */
    const fetchData = () => {
        fetch('https://assets.codepen.io/5781725/states-data.json')
            .then((res) => res.json())
            .then((tableData) => setData(tableData))
            .catch((err) => console.error('ERROR fetching data: ', err));
    };

    const handleSort = (event, col) => {
        let colSelected = col.toLowerCase();

        if (!statusTable[colSelected]) {
            statusTable[colSelected] = 1;
            setData(sortBy(data, [colSelected]));
            event.target.innerText += ' ^';
        } else if (statusTable[colSelected] === 2) {
            delete statusTable[colSelected];
            fetchData();
            event.target.innerText = event.target.innerText.split(' ')[0];
        } else {
            statusTable[colSelected] += 1;
            setData(orderBy(data, [colSelected], ['desc']));
            event.target.innerText = event.target.innerText.replace(' ^', ' v');
        }
    };

    useEffect(() => {
        console.log('Fetching data...');
        fetchData();
    }, []);

    // Event handlers
    const onClick = useCallback(
        (col) => (event) => {
            if (event.metaKey) {
                // pinning
                /* TODO: implement the onclick handler for pinning */
            } else {
                // sorting
                /* TODO: implement the onclick handler for sorting */
                handleSort(event, col);
            }
        },
        [sortedOn, pinnedColumns, data]
    );

    /* TODO: Re-order columns and sort data (if necessary) */

    // Render
    return (
        <table>
            <thead>
                <tr>
                    {columns.map((col, i) => (
                        <HeaderCell
                            key={i}
                            title={col}
                            onClick={onClick(col)}
                        />
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, i) => (
                    <tr key={i}>
                        {columns.map((col, j) => (
                            <Cell key={j} datum={row[col]} />
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

// Instantiate
ReactDOM.render(
    <React.StrictMode>
        <DataGrid />
    </React.StrictMode>,
    document.getElementById('root')
);
