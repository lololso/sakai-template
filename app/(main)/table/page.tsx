'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DataTable, DataTablePageEvent, DataTableSortEvent, DataTableFilterEvent, DataTableRowEditCompleteEvent } from 'primereact/datatable';
import { Column, ColumnEditorOptions } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { CustomerConfigs, CustomerConfigsService, LazyLoadEvent } from '@/demo/service/CustomerConfigsService';

const priorities = ['High', 'Medium', 'Low'];
const genderMap: Record<number, string> = { 0: 'Unknown', 1: 'Male', 2: 'Female' };

export default function CustomerPage() {
    const service = useRef(new CustomerConfigsService()).current;
    const [customers, setCustomers] = useState<CustomerConfigs[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);
    const [lazyState, setLazyState] = useState<any>({
        first: 0,
        rows: 15,
        sortField: null,
        sortOrder: null,
        filters: {}
    });

    useEffect(() => {
        loadCustomers();
    }, [lazyState]);

    const loadCustomers = () => {
        setLoading(true);
        const pageIndex = ((lazyState.first || 0) / (lazyState.rows || 15)) | 0;
        const size = lazyState.rows || 15;
        const filters = lazyState.filters;
        service.getCustomers(pageIndex, size, filters).then((res) => {
            setCustomers(res.data);
            setTotalRecords(res.totalRecords);
            setLoading(false);
        });
    };

    // Row edit complete handler from template
    const onRowEditComplete = async (e: DataTableRowEditCompleteEvent) => {
        const newData = e.newData as CustomerConfigs;
        const index = e.index as number;
        // update service
        await service.updateCustomer(newData);
        // update local state
        setCustomers((prev) => {
            const arr = [...prev];
            arr[index] = newData;
            return arr;
        });
    };

    // 定義 handler
    const onPage = (e: DataTablePageEvent) => {
        setLazyState((prev) => ({ ...prev, first: e.first, rows: e.rows }));
    };

    const onSort = (e: DataTableSortEvent) => {
        setLazyState((prev) => ({ ...prev, sortField: e.sortField, sortOrder: e.sortOrder! }));
    };

    const onFilter = (e: DataTableFilterEvent) => {
        // 重置分頁回第一頁
        setLazyState((prev) => ({ ...prev, first: 0, filters: e.filters! }));
    };

    // Editors
    const textEditor = (options: ColumnEditorOptions) => <InputText value={options.value as string} onChange={(e) => options.editorCallback!(e.target.value)} />;

    const switchEditor = (options: ColumnEditorOptions) => <InputSwitch checked={options.value === 1} onChange={(e) => options.editorCallback!(e.value ? 1 : 0)} />;

    const dropdownEditor = (options: ColumnEditorOptions) => <Dropdown value={options.value} options={priorities} onChange={(e) => options.editorCallback!(e.value)} />;

    const genderEditor = (options: ColumnEditorOptions) => (
        <Dropdown value={options.value as 0 | 1 | 2} options={Object.entries(genderMap).map(([key, label]) => ({ label, value: Number(key) }))} onChange={(e) => options.editorCallback!(e.value as number)} placeholder="Select Gender" />
    );

    const yesNoBody = (rowData: CustomerConfigs) => (rowData.enabled ? 'Yes' : 'No');
    const genderBody = (rowData: CustomerConfigs) => genderMap[rowData.gender];

    return (
        <div>
            <h2>Customer Configurations</h2>
            <DataTable
                value={customers}
                lazy
                paginator
                first={lazyState.first}
                rows={lazyState.rows}
                totalRecords={totalRecords}
                loading={loading}
                onPage={onPage}
                onSort={onSort}
                onFilter={onFilter}
                sortField={lazyState.sortField!}
                sortOrder={lazyState.sortOrder!}
                filters={lazyState.filters}
                filterDisplay="row"
                editMode="row"
                dataKey="id"
                onRowEditComplete={onRowEditComplete}
            >
                {/* <Column field="id" header="ID" style={{ width: '120px' }} /> */}
                <Column field="customerID" header="Customer ID" style={{ width: '140px' }} />
                <Column field="name" header="Name" editor={textEditor} filter />
                <Column field="enabled" header="Enabled" body={yesNoBody} editor={switchEditor} filter />
                <Column field="gender" header="Gender" body={genderBody} editor={genderEditor} filter />
                <Column field="priority" header="Priority" editor={dropdownEditor} filter />
                <Column field="online" header="Online" body={(row) => (row.online ? '●' : '')} editor={switchEditor} filter />
                <Column field="action" header="Action" editor={textEditor} filter />
                <Column rowEditor headerStyle={{ width: '100px', textAlign: 'center' }} />
            </DataTable>
        </div>
    );
}
