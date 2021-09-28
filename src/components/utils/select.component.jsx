
import React from 'react';
import './select.styles.css';

const Select = (props) => {
    const list = props.list;

    let openingsList = list.length > 0
        && list.map((item, i) => {
            return (
                <option key={i} value={item.value}>{item.text}</option>
            )
        }, this);

    return (
        <div>
            <select value={props.selectedValue} onChange={props.changeHandler}>
                {openingsList}
            </select>
        </div>
    )
}

export default Select;

