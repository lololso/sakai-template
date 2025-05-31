'use client';

// pages/SettingPage.tsx
import React, { useState } from 'react';
import { DefaultSettingPanel } from './components/DefaultSettingPanel';
import { SourceSettingPanel } from './components/SourceSettingPanel';
import { GroupSettingPanel } from './components/GroupSettingPanel';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import axios from 'axios';

// 送出格式定義
interface SettingPayload {
    defaultSetting: {
        active: boolean;
        enabled: boolean;
        memberRoles: string[];
    };
    sources: string[];
    groups: {
        [groupName: string]: string[];
    };
}

const SettingPage: React.FC = () => {
    const [defaultSetting, setDefaultSetting] = useState({
        active: false,
        enabled: false,
        memberRoles: ['x']
    });

    const [sources, setSources] = useState<string[]>(['Source 1', 'Source 2', 'Source 3', 'Source 4']);

    const [groupActions, setGroupActions] = useState<Record<string, string[]>>({
        'Group A': ['Action'],
        'Group B': []
    });

    const handleSaveAll = async () => {
        const payload: SettingPayload = {
            defaultSetting,
            sources,
            groups: groupActions
        };

        try {
            // 模擬儲存動作
            await axios.post('/api/settings', payload);
            alert('Settings saved successfully');
        } catch (err) {
            alert('Save failed');
        }
    };

    return (
        <div className="p-4">
            {/* 頂部區塊：左右兩欄 */}
            <div className="gird mb-4">
                <Card>
                    <DefaultSettingPanel
                        active={defaultSetting.active}
                        enabled={defaultSetting.enabled}
                        members={defaultSetting.memberRoles}
                        onChange={(field, value) => setDefaultSetting((prev) => ({ ...prev, [field]: value }))}
                        onMembersChange={(members) => setDefaultSetting((prev) => ({ ...prev, memberRoles: members }))}
                    />
                </Card>

                <Card>
                    <SourceSettingPanel sources={sources} onModify={() => alert('Modify clicked')} />
                </Card>
            </div>

            {/* Group Setting 區塊 */}
            <Card title="Group Setting" className="mb-4">
                <GroupSettingPanel groupActions={groupActions} onSaveGroup={(groupName, updatedActions) => setGroupActions((prev) => ({ ...prev, [groupName]: updatedActions }))} />
            </Card>

            {/* 儲存按鈕 */}
            <div className="flex justify-end">
                <Button label="Save All Settings" icon="pi pi-save" onClick={handleSaveAll} />
            </div>
        </div>
    );
};

export default SettingPage;
