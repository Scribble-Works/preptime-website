import React, { useState } from 'react';
import './index.css'

export default function Table({
    columns = (_ => [])(),
    rows = (_ => [])()
}) {

    const [step, setStep] = useState(10)
    const [currentDisplay, setCurrentDisplay] = useState(1);

    const changeRows = e  =>  {
        setStep(Number(e.target.value))
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

    return (
        <div className='main-tb-container'>
            {
                rows.length > 0  ? (
                    <>
                        <div className="table-wrapper">
                            <table className='table'>
                                {
                                    columns.length > 0 ? (
                                        <thead>
                                            <tr>
                                                {
                                                    columns.map((col, index) => (
                                                        <th key={`col${index}`}>{col.text}</th>
                                                    ))
                                                }
                                            </tr>
                                        </thead>
                                    ) : null
                                }
                                <tbody>
                                    {
                                        rows.slice((step * currentDisplay) - step, step * currentDisplay).map((row, index) => (
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
