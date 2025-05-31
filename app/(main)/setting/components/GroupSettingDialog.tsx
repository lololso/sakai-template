'use client';

import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

interface Props {
    visible: boolean;
    groupName: string;
    actions: string[];
    onSave: (newActions: string[]) => void;
    onHide: () => void;
}

const actionOptions = ['Action', 'Another Action', 'Something else here'];

export const GroupSettingDialog: React.FC<Props> = ({ visible, groupName, actions, onSave, onHide }) => {
    const [tempActions, setTempActions] = useState<string[]>([...actions]);
    const [selectedAction, setSelectedAction] = useState<string | null>(null);

    const addAction = () => {
        if (selectedAction && !tempActions.includes(selectedAction)) {
            setTempActions([...tempActions, selectedAction]);
            setSelectedAction(null);
        }
    };

    const deleteAction = (action: string) => {
        setTempActions(tempActions.filter((a) => a !== action));
    };

    return (
        <Dialog header={`${groupName} Setting`} visible={visible} onHide={onHide} style={{ width: '30vw' }}>
            <div className="mb-3">
                <Dropdown value={selectedAction} options={actionOptions} onChange={(e) => setSelectedAction(e.value)} placeholder="Dropdown button" className="w-full mb-2" />
                <Button label="Add" onClick={addAction} disabled={!selectedAction} />
            </div>

            <div className="mb-4">
                {tempActions.map((a, idx) => (
                    <div key={idx} className="flex justify-between items-center mb-1">
                        <span>{a}</span>
                        <Button label="Delete" icon="pi pi-trash" className="p-button-danger p-button-sm" onClick={() => deleteAction(a)} />
                    </div>
                ))}
            </div>

            <div className="flex justify-end gap-2">
                <Button label="Close" onClick={onHide} className="p-button-secondary" />
                <Button label="Save changes" onClick={() => onSave(tempActions)} />
            </div>
        </Dialog>
    );
};
