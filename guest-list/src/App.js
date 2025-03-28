import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
} from 'firebase/firestore';
import GuestForm from './GuestForm';
import './App.css';

function GuestCard({ guest, onEdit, onDelete }) {
    return (
        <div className='guest-card'>
            <h2>{guest.name}</h2>
            <p>
                {guest.relation} (Table {guest.table})
            </p>
            <p>RSVP: {guest.rsvp}</p>
            <button onClick={onEdit}>Edit</button>
            <button onClick={onDelete}>Delete</button>
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
    const [guests, setGuests] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [guestToEdit, setGuestToEdit] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    const guestsCollection = collection(db, 'guests');

    useEffect(() => {
        const fetchGuests = async () => {
            const data = await getDocs(guestsCollection);
            setGuests(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
            setLoading(false);
        };
        fetchGuests();
    }, [guestsCollection]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const handleAddGuest = async (newGuest) => {
        const docRef = await addDoc(guestsCollection, newGuest);
        setGuests([...guests, { ...newGuest, id: docRef.id }]);
    };

    const handleEditGuest = (guest) => {
        setGuestToEdit(guest);
        setEditMode(true);
    };

    const handleUpdateGuest = async (updatedGuest) => {
        const guestDoc = doc(db, 'guests', guestToEdit.id);
        await updateDoc(guestDoc, updatedGuest);
        setGuests(
            guests.map((g) => (g.id === guestToEdit.id ? updatedGuest : g))
        );
        setEditMode(false);
        setGuestToEdit(null);
    };

    const handleDeleteGuest = async (id) => {
        await deleteDoc(doc(db, 'guests', id));
        setGuests(guests.filter((g) => g.id !== id));
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
            {guest && (
                <GuestCard
                    guest={guest}
                    onEdit={() => handleEditGuest(guest)}
                    onDelete={() => handleDeleteGuest(guest.id)}
                />
            )}
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
