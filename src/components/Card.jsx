import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import store from '../store/CardStore';
import useLongPress from './useLongPress';
import Trash from './svg/Trash';
import Add from './svg/Add';
import Remove from './svg/Remove';

const Card = ({id, title, streak}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [currentText, setCurrentText] = useState(title);
    const [currentStreak, setCurrentStreak] = useState(streak);
    const [deletePressed, setDeletePressed] = useState(false);
    const longPress = useLongPress(() => setIsExpanded(saveChanges), 1000);

    useEffect(() => {
        setCurrentStreak(streak);
    }, [streak]);

    const saveChanges = () => {
        setIsExpanded(!isExpanded);
        setDeletePressed(false);

        const editedText = (currentText === "" 
            || !currentText.replace(/\s/g, '').length) 
            ? "Enter a title"
            : currentText;

        store.editCard(id, editedText, currentStreak);
    };
    
    const handlePress = () => {
        if (isExpanded) return;
        store.incrementStreak(id);
    };

    const handleChange = (e) => {
        setCurrentText(e.target.value);
    };

    const increase = () => {
        setCurrentStreak(currentStreak + 1);
    };

    const decrease = () => {
        setCurrentStreak(currentStreak ? currentStreak - 1 : 0);
    };

    const deleteCard = () => {
        if(!deletePressed) {
            setDeletePressed(true);
            return;
        }
        store.deleteCard(id);
        setDeletePressed(false);
    }

    return (
        <div 
            className={`card${isExpanded ? "" : " pressable no-select"}`} 
            {...longPress}
            onClick={handlePress}
        >
            {!isExpanded ? 
                <div>
                    <div className="title-container">
                        <div className="card-title">{title}</div>
                    </div>
                    <div className="card-streak-container">
                        <div className="card-streak">{streak}</div>
                    </div>
                </div> 
                :
                <div>
                    <div className="title-container">
                        <textarea
                            className="edit-title card-title"
                            value={currentText}
                            onChange={(e) => handleChange(e)}
                        />
                    </div>
                    <div className="adjust-container card-streak">
                        <div 
                            className="adjust-button no-select"
                            onClick={decrease}
                        >
                            <Remove size={24}/>
                        </div>

                        <div>{currentStreak}</div>
                        
                        <div
                            className="adjust-button no-select"
                            onClick={increase}
                        >
                            <Add size={24}/>
                        </div>
                    </div>
                    <div className="delete-container">
                        <div 
                            onClick={deleteCard}
                            className="adjust-button no-select"
                        >
                            <Trash color={'#F25A85'}/>
                            {deletePressed ? 
                                <span className="delete-text">Press again to delete</span> 
                                : null}
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default observer(Card);