import React, { useEffect, useState } from 'react';
import './index.css'

export default function Table({
    tableId,
    columns = (_ => [])(),
    rows = (_ => [])(),
    printState='none'
}) {

    const [step, setStep] = useState(10);
    const [lastStep, setLastStep] = useState(10);
    const [currentDisplay, setCurrentDisplay] = useState(1);
    const [sortVal, setSortVal] = useState('');
    const [sortType, setSortType] = useState('');

    const changeRows = e  =>  {
        setLastStep(step);
        setStep(Number(e.target.value));
    }

    const prevDisplay = e  => {
        if (currentDisplay == 1) {
            e.target.setAttribute('disabled', true)
            return;
        }
        if (currentDisplay > 1)  {
            e.target.removeAttribute('disabled')
            setCurrentDisplay(prevVal => {
                const newVal  = prevVal - 1;
                return newVal;
            })
        }
    }

    const nextDisplay = e  => {
        if (currentDisplay == (Math.ceil(rows.length / step))) {
            e.target.setAttribute('disabled', true)
            return;
        }
        if (currentDisplay < (Math.ceil(rows.length / step)))  {
            e.target.removeAttribute('disabled')
            setCurrentDisplay(prevVal => {
                const newVal = prevVal + 1;
                return newVal;
            })
        }
    }

    const sortTable = (id, value) => {
        const table = document.getElementById(tableId);
        const headers = table.querySelectorAll('th');
        headers.forEach(target => {
            if (target.id === id) {
                let sortAttr = target.getAttribute('data-sort');
                if (sortAttr === '') {
                    target.setAttribute('data-sort', 'asc')
                    setSortType('asc')
                    setSortVal(value)
                } else if (sortAttr === 'asc') {
                    target.setAttribute('data-sort', 'desc')
                    setSortType('desc')
                    setSortVal(value)
                } else {
                    target.setAttribute('data-sort', 'asc')
                    setSortType('asc')
                    setSortVal(value)
                }
            } else {
                target.setAttribute('data-sort', '')
            }
        })
    }

    useEffect(_ => {
        if (printState === 'printing') {
            setLastStep(step);
            setStep(rows.length);
        } else if (printState === 'done') {
            setStep(lastStep)
        } else
            return;
    }, [printState])

    const sortData = _ => {
        if (sortType === '' || sortVal === '')
            return rows;
        else {
            let sortedData;
            if (sortType === 'asc') {
                sortedData = rows.sort((a, b) => {
                    if (a[sortVal] < b[sortVal])
                        return -1;
                    if (a[sortVal] > b[sortVal])
                        return 1;
                    return 0;
                })
            } else {
                sortedData = rows.sort((a, b) => {
                    if (a[sortVal] > b[sortVal])
                        return -1;
                    if (b[sortVal] > a[sortVal])
                        return 1;
                    return 0;
                })
            }
            return sortedData;
        }
    }

    return (
        <div className='main-tb-container'>
            {
                rows.length > 0  ? (
                    <>
                        <div className="table-wrapper">
                            <table className='table' id={tableId}>
                                {
                                    columns.length > 0 ? (
                                        <thead>
                                            <tr>
                                                {
                                                    columns.map((col, index) => (
                                                        <th key={`col${index}`} onClick={_ => sortTable(`col-${index}`, col.accessor)} data-sort="" id={`col-${index}`}>
                                                            <span>{col.text}</span>
                                                            <span className="sort-ctrls">
                                                                <i className="fas fa-sort-up"></i>
                                                                <i className="fas fa-sort-down"></i>
                                                            </span>
                                                        </th>
                                                    ))
                                                }
                                            </tr>
                                        </thead>
                                    ) : null
                                }
                                <tbody>
                                    {
                                        sortData(rows).slice((step * currentDisplay) - step, step * currentDisplay).map((row, index) => (
                                            <tr key={`row${index}`}>
                                                {
                                                    columns.map(col => (
                                                        <td key={`dp-${col.accessor}`} className="tb-cell">
                                                            { row[col.accessor] }
                                                        </td>
                                                    ))
                                                }
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className="tb-controls">
                            <div className="rpp">
                                <p className="label">Rows per page:</p>
                                <select name="rows-number" id="rows-number" defaultValue={10}  onChange={changeRows}>
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="15">15</option>
                                    <option value="20">20</option>
                                    <option value={rows.length}>All</option>
                                </select>
                            </div>
                            <p className="count-indicator">
                                { `${((step * currentDisplay) - step) +  1}-${step * currentDisplay} of ${rows.length}`}
                            </p>
                            <div className="pg-controls">
                                <button onClick={prevDisplay}>
                                    <i className="fas fa-chevron-left"></i>
                                </button>
                                <button onClick={nextDisplay}>
                                    <i className="fas fa-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="no-data">
                        <p>No data to show</p>
                    </div>
                )
            }
        </div>
    )
}
