'use client';
import React, { useEffect, useState } from 'react';
import { TreeTable } from 'primereact/treetable';
import { Column } from 'primereact/column';
import { TreeNode } from 'primereact/treenode';
import { NodeService } from '@/demo/service/NodeService';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

interface Props {
    visible: boolean;
    onHide: () => void;
    onSelect: (selectedLabel: string) => void; // 將選到的節點名稱回傳給父層
}

export default function TreeSelector({ visible, onHide, onSelect }: Props) {
    const [nodes, setNodes] = useState<TreeNode[]>([]);
    const [selectedKey, setSelectedKey] = useState<string | null>(null);

    useEffect(() => {
        NodeService.getFilesystem().then((data) => setNodes(data));
    }, []);

    const findNodeByKey = (nodes: TreeNode[], key: string | null): TreeNode | null => {
        if (!key) return null;

        for (const node of nodes) {
            if (node.key === key) return node;
            if (node.children) {
                const result = findNodeByKey(node.children, key);
                if (result) return result;
            }
        }

        return null;
    };

    const handleConfirm = () => {
        const selectedNode = findNodeByKey(nodes, selectedKey);

        if (selectedNode && !selectedNode.children) {
            onSelect(selectedNode.data.name); // ✅ 傳回節點名稱
            onHide();
        } else {
            alert('請選擇最末層的項目'); // ✅ 可改成 Toast
        }
    };

    return (
        <Dialog
            header="選擇資料"
            visible={visible}
            onHide={onHide}
            style={{ width: '50vw' }}
            footer={
                <div>
                    <Button label="取消" onClick={onHide} className="p-button-text" />
                    <Button label="確認" onClick={handleConfirm} />
                </div>
            }
        >
            <TreeTable
                value={nodes}
                selectionMode="single"
                selectionKeys={selectedKey}
                onSelectionChange={(e) => {
                    if (typeof e.value === 'string') {
                        setSelectedKey(e.value);
                    } else {
                        setSelectedKey(null);
                    }
                }}
            >
                <Column field="name" header="Name" expander />
                <Column field="size" header="Size" />
                <Column field="type" header="Type" />
            </TreeTable>
        </Dialog>
    );
}
