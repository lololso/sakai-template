'use client';
import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import TreeSelector from './TreeSelector'; // 這是彈出的 TreeDialog 組件
import { TreeTableSelectionKeysType } from 'primereact/treetable';

export default function Page1() {
    const [dialogVisible, setDialogVisible] = useState(false); // 控制 Dialog 顯示
    const [equipId, setEquipId] = useState('');
    const [selectedTree, setSelectedTree] = useState<TreeTableSelectionKeysType | null>(null); // 儲存選擇的節點

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-bold">頁面1</h1>

            <div className="p-4 border rounded-md space-y-6">
                <div>
                    <label className="block font-medium mb-1">Equip ID</label>
                    <InputText placeholder="輸入欄" className="w-full" />
                </div>

                <div>
                    <label className="block font-medium mb-1">Source Tree</label>
                    <Button label="點我會跳出樹清單" onClick={() => setDialogVisible(true)} className="w-full md:w-auto" />
                    {selectedTree && <p className="text-sm text-gray-600 mt-2">✅ 已選擇節點：{JSON.stringify(selectedTree)}</p>}
                </div>
            </div>

            <div>
                <Button label="搜尋" onClick={() => console.log('送出 Tree 節點:', selectedTree)} />
            </div>

            <TreeSelector
                visible={dialogVisible}
                onHide={() => setDialogVisible(false)}
                onSelect={(label) => setEquipId(label)} // ✅ 把 node.name 填入 input
            />
        </div>
    );
}
