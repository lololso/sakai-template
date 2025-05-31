'use client';

import React from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Card } from 'primereact/card';

interface Props {
    active: boolean;
    enabled: boolean;
    members: string[];
    onChange: (field: 'acitve' | 'enabled', value: boolean) => void;
    onMembersChange: (members: string[]) => void;
}

const allMembers = ['x', 'y', 'z'];

export const DefaultSettingPanel: React.FC<Props> = ({ active, enabled, members, onChange, onMembersChange }) => {
    const toggleMember = (name: string) => {
        if (members.includes(name)) {
            onMembersChange(members.filter((m) => m !== name));
        } else {
            onMembersChange([...members, name]);
        }
    };

    return (
        <div className="border p-3 w-full md:w-5">
            <h4>Default Setting</h4>
            <div className="flex flex-col gap-2 mt-2">
                <div className="flex align-items-center">
                    <Checkbox inputId="active" checked={active} onChange={(e) => onChange('active', e.checked!)} />
                    <label htmlFor="active" className="ml-2">
                        Active
                    </label>
                </div>
                <div className="flex align-items-center">
                    <Checkbox inputId="enabled" checked={enabled} onChange={(e) => onChange('enabled', e.checked!)} />
                    <label htmlFor="enabled" className="ml-2">
                        Enabled
                    </label>
                </div>
                <Card className="px-3 py-2">
                    <div className="mt-2  font-medium">GroupMember:</div>
                    <div className="flex flex-col gap-2">
                        {allMembers.map((name) => (
                            <div className="flex align-items-center" key={name}>
                                <Checkbox inputId={name} checked={members.includes(name)} onChange={() => toggleMember(name)} />
                                <label htmlFor={name} className="ml-2">
                                    {name}
                                </label>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};
