'use client';

import React, { useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import { GroupSettingDialog } from './GroupSettingDialog';

interface Props {
    groupActions: Record<string, string[]>;
    onSaveGroup: (groupName: string, actions: string[]) => void;
}

export const GroupSettingPanel: React.FC<Props> = ({ groupActions, onSaveGroup }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [editGroup, setEditGroup] = useState<string>('');

    const openDialog = (groupName: string) => {
        setEditGroup(groupName);
        setDialogVisible(true);
    };

    const groupNames = Object.keys(groupActions);

    return (
        <div className="border p-3 w-full">
            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                {groupNames.map((group) => (
                    <TabPanel key={group} header={group}>
                        <Button label="Edit" icon="pi pi-cog" onClick={() => openDialog(group)} />
                    </TabPanel>
                ))}
            </TabView>

            <GroupSettingDialog
                visible={dialogVisible}
                groupName={editGroup}
                actions={groupActions[editGroup] ?? []}
                onSave={(actions) => {
                    onSaveGroup(editGroup, actions);
                    setDialogVisible(false);
                }}
                onHide={() => setDialogVisible(false)}
            />
        </div>
    );
};
