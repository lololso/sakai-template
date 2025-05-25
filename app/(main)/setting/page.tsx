'use client';
import React, { useContext, useRef } from 'react';
// import { CustomerConfigsContext } from '../context/CustomerConfigsContext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { CustomerConfigs, CustomerConfigsService } from '@/demo/service/CustomerConfigsService';

export const SettingCustomerConfigsPage: React.FC = () => {
    const { configs, setConfigs } = useContext(CustomerConfigsContext);
    const toast = useRef<Toast>(null);
    const priorityOptions = [
        { label: 'High', value: 'High' },
        { label: 'Medium', value: 'Medium' },
        { label: 'Low', value: 'Low' }
    ];

    const enabledEditor = (options: any) => {
        return <Checkbox checked={options.value === 1} onChange={(e) => options.editorCallback(e.checked ? 1 : 0)} />;
    };

    const priorityEditor = (options: any) => {
        return <Dropdown value={options.value} options={priorityOptions} onChange={(e) => options.editorCallback(e.value)} optionLabel="label" placeholder="Select Priority" />;
    };

    const onCellEditComplete = async (e: any) => {
        const { rowData, field, newValue } = e;
        const updatedRow: CustomerConfigs = { ...rowData, [field]: newValue };
        const updatedList = configs.map((c) => (c.id === updatedRow.id ? updatedRow : c));
        setConfigs(updatedList);
        try {
            await CustomerConfigsService.updateCustomerConfig(updatedRow);
            toast.current?.show({ severity: 'success', summary: 'Updated', detail: `${field} saved` });
        } catch {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: `Failed to save ${field}` });
        }
    };

    return (
        <div className="p-fluid">
            <Toast ref={toast} />
            <DataTable value={configs} editMode="cell" onCellEditComplete={onCellEditComplete} responsiveLayout="scroll">
                <Column field="id" header="ID" style={{ width: '5%' }} />
                <Column field="customerID" header="Customer ID" style={{ width: '10%' }} />
                <Column field="name" header="Name" style={{ width: '25%' }} />
                <Column field="enabled" header="Enabled" editor={enabledEditor} body={(rowData) => <Checkbox checked={rowData.enabled === 1} disabled />} style={{ width: '10%', textAlign: 'center' }} />
                <Column field="priority" header="Priority" editor={priorityEditor} body={(rowData) => rowData.priority} style={{ width: '15%' }} />
                <Column field="online" header="Online" style={{ width: '10%' }} />
                <Column field="action" header="Action" style={{ width: '25%' }} />
            </DataTable>
        </div>
    );
};
export default SettingPage;
