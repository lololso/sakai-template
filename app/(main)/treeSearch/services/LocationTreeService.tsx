'use client';

import { TreeNode } from 'primereact/treenode';

export const fetchSourceTypes = async (): Promise<string[]> => {
    // TODO: ✅ 改為 call API: /api/source-types
    return ['TypeA', 'TypeB'];
};

// ✅ mock: Location 資料
export const fetchLocations = async () => {
    // TODO: ✅ 改為 call API: /api/locations
    return [
        {
            key: 'loc1',
            label: 'Location 1',
            data: { level: 'location' },
            leaf: false
        },
        {
            key: 'loc2',
            label: 'Location 2',
            data: { level: 'location' },
            leaf: false
        }
    ];
};

// ✅ mock: Section 資料
export const fetchSections = async (locationId: string) => {
    // TODO: ✅ 改為 call API: /api/sections?locationId=${locationId}
    return [
        {
            key: `${locationId}-sec1`,
            label: 'Section 1',
            data: { level: 'section' },
            leaf: false
        },
        {
            key: `${locationId}-sec2`,
            label: 'Section 2',
            data: { level: 'section' },
            leaf: false
        }
    ];
};

// ✅ mock: ID 資料
export const fetchIDs = async (sectionId: string, sourceType: string) => {
    // TODO: ✅ 改為 call API: /api/ids?sectionId=${sectionId}&sourceType=${sourceType}
    return [
        {
            key: `${sectionId}-${sourceType}-id1`,
            label: `ID 1 (${sourceType})`,
            leaf: true
        },
        {
            key: `${sectionId}-${sourceType}-id2`,
            label: `ID 2 (${sourceType})`,
            leaf: true
        }
    ];
};

// ✅ 預埋 loader：根據層級與來源條件，決定打哪支 API
export const loadChildrenByNode = async (node: any, sourceType: string) => {
    const level = node.data?.level;

    if (level === 'location') {
        return await fetchSections(node.key); // ✅ 第二層需 locationId
    }

    if (level === 'section') {
        return await fetchIDs(node.key, sourceType); // ✅ 第三層需 sectionId + sourceType
    }

    return [];
};
