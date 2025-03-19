import { useState, useEffect } from 'react';
import './GuestForm.css';

function GuestForm({
    editMode = false,
    guestToEdit,
    onSubmit = (f) => f,
    onCancelEdit = (f) => f,
}) {
    const [name, setName] = useState('');
    const [relation, setRelation] = useState('');
    const [table, setTable] = useState('');
    const [rsvp, setRsvp] = useState('');

    useEffect(() => {
        if (editMode && guestToEdit) {
            setName(guestToEdit.name);
            setRelation(guestToEdit.relation);
            setTable(guestToEdit.table);
            setRsvp(guestToEdit.rsvp);
        }
    }, [editMode, guestToEdit]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const guestData = { name, relation, table, rsvp };
        onSubmit(guestData);
        clearForm();
    };

    const clearForm = () => {
        setName('');
        setRelation('');
        setTable('');
        setRsvp('');
    };

    const handleCancel = () => {
        clearForm();
        onCancelEdit();
    };

    return (
        <div id='updateForm'>
            <h3>{editMode ? 'Update Guest' : 'Add New Guest'}</h3>
            <form onSubmit={handleSubmit}>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type='text'
                    placeholder='Guest Name'
                    required
                />
                <input
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                    type='text'
                    placeholder='Relation'
                    required
                />
                <input
                    value={table}
                    onChange={(e) => setTable(e.target.value)}
                    type='number'
                    placeholder='Table Number'
                    required
                />
                <select
                    value={rsvp}
                    onChange={(e) => setRsvp(e.target.value)}
                    required
                >
                    <option value='Attending'>Attending</option>
                    <option value='Declined'>Declined</option>
                    <option value='No Response'>No Response</option>
                </select>
                <button type='submit'>{editMode ? 'Update' : 'Add'}</button>

                {editMode && (
                    <button type='button' onClick={handleCancel}>
                        Cancel
                    </button>
                )}
            </form>
        </div>
    );
}

export default GuestForm;
