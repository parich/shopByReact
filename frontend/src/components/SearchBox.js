import React, { useState } from 'react';

export default function SearchBox(props) {
    const [name, setName] = useState('');

    const submitHandler = (e) => {
        e.preventDefault();
        // เมือ submitHandler ทำงานจะส่งข้อมูลไป url พร้อมกับ name 
        // เช็คได้ที Route ส่งส่งไป component ไหน 
        props.history.push(`/search/name/${name}`)
    }

    return (
        <form className='search' onSubmit={submitHandler}>
            <div className='row'>
                <input type='text' name='q' id='q' onChange={(e) => setName(e.target.value)}>
                </input>
                <button className='primary' type='submit'> <i className='fa fa-search'></i></button>
            </div>
        </form>
    );
}
