import React, { useState } from 'react';
import GuestForm from './GuestForm';
import './App.css';

const hardCodedGuestData = [
    {
        name: 'Linda Kline',
        relation: 'Mother',
        table: 1,
        rsvp: 'Attending',
    },
    {
        name: 'Todd Kline',
        relation: 'Father',
        table: 1,
        rsvp: 'Attending',
    },
    {
        name: 'Jean Gavin',
        relation: 'Grandma',
        table: 2,
        rsvp: 'Attending',
    },
    {
        name: 'Emma Farmer',
        relation: 'Friend',
        table: 11,
        rsvp: 'Declined',
    },
    {
        name: 'Sydney Lukas',
        relation: 'Cousin',
        table: 21,
        rsvp: 'No Response',
    },
];

function GuestCard({ guest, onEdit }) {
    return (
        <div className='guest-card'>
            <h2>{guest.name}</h2>
            <p>
                {guest.relation} (Table {guest.table})
            </p>
            <p>RSVP: {guest.rsvp}</p>
            <button onClick={onEdit}>Edit</button>
        </div>
    );
}

function GuestNavigation({ onPrev, onNext, currentIndex, totalGuests }) {
    return (
        <div className='guest-navigation'>
            <button onClick={onPrev}>Previous</button>
            <span>{`Guest ${currentIndex + 1} of ${totalGuests}`}</span>
            <button onClick={onNext}>Next</button>
        </div>
    );
}

function App() {
    const [guests, setGuests] = useState(hardCodedGuestData);
    const [editMode, setEditMode] = useState(false);
    const [guestToEdit, setGuestToEdit] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleAddGuest = (newGuest) => {
        setGuests([...guests, newGuest]);
    };

    const handleEditGuest = (guest) => {
        setGuestToEdit(guest);
        setEditMode(true);
    };

    const handleUpdateGuest = (updatedGuest) => {
        setGuests(
            guests.map((g) => (g.name === guestToEdit.name ? updatedGuest : g))
        );
        setEditMode(false);
        setGuestToEdit(null);
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setGuestToEdit(null);
    };

    const handlePrev = () => {
        setCurrentIndex((currentIndex - 1 + guests.length) % guests.length);
    };

    const handleNext = () => {
        setCurrentIndex((currentIndex + 1) % guests.length);
    };

    const guest = guests[currentIndex];

    return (
        <div className='app'>
            <h1>Guest List</h1>
            <GuestCard guest={guest} onEdit={() => handleEditGuest(guest)} />
            <GuestNavigation
                onPrev={handlePrev}
                onNext={handleNext}
                currentIndex={currentIndex}
                totalGuests={guests.length}
            />
            <GuestForm
                editMode={editMode}
                guestToEdit={guestToEdit}
                onSubmit={editMode ? handleUpdateGuest : handleAddGuest}
                onCancelEdit={handleCancelEdit}
            />
        </div>
    );
}

export default App;
