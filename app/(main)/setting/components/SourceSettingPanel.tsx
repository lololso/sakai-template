'use client';

import React from 'react';
import { Button } from 'primereact/button';

interface Props {
    sources: string[];
    onModify: () => void;
}

export const SourceSettingPanel: React.FC<Props> = ({ sources, onModify }) => {
    return (
        <div className="border p-3 w-full md:w-5">
            <h4>Source Setting</h4>
            <ul className="my-2 pl-4 list-disc">
                {sources.map((src, idx) => (
                    <li key={idx}>{src}</li>
                ))}
            </ul>
            <Button label="Modify" icon="pi pi-pencil" onClick={onModify} />
        </div>
    );
};
