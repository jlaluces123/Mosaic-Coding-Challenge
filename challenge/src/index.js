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
    union,
} from 'lodash';

import './index.css';

// Constants
const AZ = 1;
const ZA = 2;

// Table in order to keep track of what sort a column is using
// Ex. { 'population': 1 (aka AZ) }
let statusTable = {};

///////////////////////////////////////////////////////////////////////////////
// DATA GRID COMPONENTS
///////////////////////////////////////////////////////////////////////////////
// A single cell in a data grid
const Cell = ({ datum }) => {
    return (
        <td>
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

    // State
    const [sortedOn, setSortedOn] = useState(['none', AZ]); // ==> figure out a way to use this
    const [pinnedColumns, setPinnedColumns] = useState([]);
    const [data, setData] = useState([]);
    const [updatedColumns, setUpdatedColumns] = useState([]);

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

    /* TODO: reset all other fields that have a ^ or v if that column wasnt clicked on */
    const handleSort = (event, col) => {
        console.log('selected: ', typeof col, col);
        let colSelected =
            typeof col === 'string' ? col.toLowerCase() : col[0].toLowerCase();

        if (!statusTable[colSelected]) {
            statusTable[colSelected] = 1;
            setData(sortBy(data, [colSelected]));
            event.target.innerText += ' ↑';
        } else if (statusTable[colSelected] === 2) {
            delete statusTable[colSelected];
            fetchData();
            event.target.innerText = event.target.innerText.split(' ')[0];
        } else {
            statusTable[colSelected] += 1;
            setData(orderBy(data, [colSelected], ['desc']));
            event.target.innerText = event.target.innerText.replace(' ↑', ' ↓');
        }
    };

    const handlePin = (col) => {
        /*  
          1. Add the column to pinned columns
          2. Every time we add a pinned column, union (pinnedColumns , columns)
        */
        let pinnedColumnsCopy = [...pinnedColumns];
        pinnedColumnsCopy.push(col);
        setUpdatedColumns(uniq([pinnedColumnsCopy, ...columns]));
    };

    useEffect(() => {
        console.log('Fetching data...');
        fetchData();
    }, []);

    useEffect(() => {
        // setPinnedColumns(union(pinnedColumns, columns));
        console.log(pinnedColumns);
    }, [pinnedColumns]);

    // Event handlers
    const onClick = useCallback(
        (col) => (event) => {
            if (event.metaKey) {
                // pinning
                /* TODO: implement the onclick handler for pinning */
                handlePin(col);
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
                    {updatedColumns[0]
                        ? updatedColumns.map((col, i) => (
                              <HeaderCell
                                  key={i}
                                  title={col}
                                  onClick={onClick(col)}
                              />
                          ))
                        : columns.map((col, i) => (
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
                        {updatedColumns[0]
                            ? updatedColumns.map((col, j) => (
                                  <Cell key={j} datum={row[col]} />
                              ))
                            : columns.map((col, j) => (
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
