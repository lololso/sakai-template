'use client';

import React, { useState, useEffect } from 'react';
import { TreeSelect } from 'primereact/treeselect';
import { TreeNode } from 'primereact/treenode';
import { Dropdown } from 'primereact/dropdown';
import { fetchSourceTypes, fetchLocations, fetchSections, fetchIDs } from './services/LocationTreeService';

const SourceLocationSelector = () => {
    const [sourceTypes, setSourceTypes] = useState<string[]>([]);
    const [selectedSourceType, setSelectedSourceType] = useState<string>('');
    const [treeNodes, setTreeNodes] = useState<TreeNode[]>([]);
    const [selectedKey, setSelectedKey] = useState<string | null>(null);

    useEffect(() => {
        fetchSourceTypes().then(setSourceTypes);
        fetchLocations().then(setTreeNodes); // no param needed
    }, []);

    const onExpand = async (node: TreeNode) => {
        if (!node.children) {
            const { level, parentLocation } = node.data || {};
            let children: TreeNode[] = [];

            if (level === 'section') {
                children = await fetchSections(node.key);
            } else if (level === 'id' && selectedSourceType) {
                children = await fetchIDs(node.key, selectedSourceType);
            }

            setTreeNodes((prev) => updateNodeChildren(prev, node.key, children));
        }
    };

    const findNodeByKey = (nodes: TreeNode[], key: string): TreeNode | null => {
        for (const node of nodes) {
            if (node.key === key) return node;
            if (node.children) {
                const found = findNodeByKey(node.children, key);
                if (found) return found;
            }
        }
        return null;
    };

    const handleNodeChange = (value: string) => {
        const selected = findNodeByKey(treeNodes, value);
        if (selected?.leaf) {
            setSelectedKey(value);
        }
    };

    const updateNodeChildren = (nodes: TreeNode[], key: string, children: TreeNode[]): TreeNode[] => {
        return nodes.map((node) => {
            if (node.key === key) {
                return { ...node, children };
            } else if (node.children) {
                return { ...node, children: updateNodeChildren(node.children, key, children) };
            }
            return node;
        });
    };

    return (
        <div className="p-fluid card">
            <div className="field mb-3">
                <label>Source Type</label>
                <Dropdown
                    value={selectedSourceType}
                    options={sourceTypes}
                    onChange={(e) => {
                        setSelectedSourceType(e.value);
                        setSelectedKey(null);
                    }}
                    placeholder="Select Source Type"
                />
            </div>

            <div className="field">
                <label>Select ID</label>
                <TreeSelect
                    value={selectedKey}
                    options={treeNodes}
                    onChange={(e) => handleNodeChange(e.value)}
                    placeholder="Select an ID"
                    className="w-full"
                    selectionMode="single"
                    onNodeExpand={(e) => onExpand(e.node)}
                    filter
                    disabled={!selectedSourceType}
                />
            </div>
        </div>
    );
};

export default SourceLocationSelector;
