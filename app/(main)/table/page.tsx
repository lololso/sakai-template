'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DataTable, DataTablePageEvent, DataTableSortEvent, DataTableFilterEvent, DataTableRowEditCompleteEvent } from 'primereact/datatable';
import { Column, ColumnEditorOptions } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { Toast } from 'primereact/toast';
import { CustomerConfigs, CustomerConfigsService } from './CustomerConfigsService';
// import { useSession } from 'next-auth/react'; // NextAuth.js

const priorities = ['High', 'Medium', 'Low'];
const genderMap: Record<number, string> = { 0: 'Unknown', 1: 'Male', 2: 'Female' };

// api 的參數 - 由其他component 取得
interface CustomerPageProps {
    parentId: string;
}

export default function CustomerPage() {
    // Toast 彈出提示訊息
    const toast = useRef<Toast>(null);
    const service = useRef(new CustomerConfigsService()).current;
    const [customers, setCustomers] = useState<CustomerConfigs[]>([]);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    // 選擇row
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerPageProps | null>(null);

    // lazyState 管理分頁/排序/篩選
    const [lazyState, setLazyState] = useState<{
        first: number;
        rows: number;
        sortField: string | null;
        sortOrder: number | null;
        filters: Record<string, any>;
    }>({
        first: 0,
        rows: 15,
        sortField: null,
        sortOrder: null,
        filters: {}
    });

    // 為了簡化示範，這裡暫時不使用真正的 Session 取得使用者
    // 先預設一個常量，未來要改成從 Session 拿
    const defaultModifier = 'System';

    useEffect(() => {
        loadCustomers();
    }, [lazyState]);

    // useEffect(() => {
    //     loadCustomers();
    // }, [lazyState, parentId]);

    // 從後端取得數據
    const loadCustomers = () => {
        setLoading(true);

        const pageIndex = Math.floor((lazyState.first || 0) / lazyState.rows);
        const size = lazyState.rows;
        const sortField = lazyState.sortField;
        const sortOrder = lazyState.sortOrder;
        const filters = lazyState.filters;

        // 把 PrimeReact filters 轉成最簡單 { field: value }
        const simpleFilters: Record<string, any> = {};
        Object.entries(lazyState.filters || {}).forEach(([field, meta]) => {
            if (meta && (meta as any).value != null && (meta as any).value !== '') {
                simpleFilters[field] = (meta as any).value;
            }
        });

        // // 4.3 构造带 parentId 的后端 GET API
        //     假定后端接口：GET /api/customers?parentId=xxx ，直接返回整包 CustomerConfigs[]
        // fetch(`/api/customers?parentId=${encodeURIComponent(parentId)}`)
        //     .then((res) => {
        //         if (!res.ok) throw new Error(`API fetch failed: ${res.status}`);
        //         return res.json();
        //     })
        //     .then((data: CustomerConfigs[]) => {
        //         // data 就是“后端返回的整包数据”（不分页、不筛选、不排序）
        //         // 下面在前端进行“筛选 → 排序 → 分页切片”

        //         // 4.4 在前端做“筛选”（仅示范对字符串做 contains，对数字或其他可以自行扩展）
        //         let filtered = data.filter((item) => {
        //             return Object.entries(simpleFilters).every(([field, value]) => {
        //                 const fieldVal = (item as any)[field];
        //                 if (fieldVal == null) return false;
        //                 // 如果是字符串类型，就做“包含”
        //                 if (typeof fieldVal === 'string') {
        //                     return (fieldVal as string).toLowerCase().includes(String(value).toLowerCase());
        //                 }
        //                 // 如果值是数字或布尔，也可做“等于”
        //                 return String(fieldVal) === String(value);
        //             });
        //         });

        //         // 4.5 在前端做“排序”（如果 sortField 不为空）
        //         if (sortField) {
        //             filtered.sort((a, b) => {
        //                 const aVal = (a as any)[sortField];
        //                 const bVal = (b as any)[sortField];
        //                 if (aVal == null && bVal == null) return 0;
        //                 if (aVal == null) return sortOrder === 1 ? -1 : 1;
        //                 if (bVal == null) return sortOrder === 1 ? 1 : -1;
        //                 // 简单区分数值 vs 字符串
        //                 if (typeof aVal === 'number' && typeof bVal === 'number') {
        //                     return sortOrder === 1 ? aVal - bVal : bVal - aVal;
        //                 }
        //                 const aStr = String(aVal).toLowerCase();
        //                 const bStr = String(bVal).toLowerCase();
        //                 if (aStr < bStr) return sortOrder === 1 ? -1 : 1;
        //                 if (aStr > bStr) return sortOrder === 1 ? 1 : -1;
        //                 return 0;
        //             });
        //         }

        //         // 4.6 在前端做“分页切片”
        //         const start = pageIndex * size;
        //         const end = start + size;
        //         const pageSlice = filtered.slice(start, end);

        //         // 4.7 把结果 set 到本地 state 中
        //         setCustomers(pageSlice);
        //         setTotalRecords(filtered.length);
        //     })
        //     .catch((err) => {
        //         console.error('loadCustomers API error, fallback to mock service:', err);
        //         // 如果后端接口失效，则退回到原先的 mock Service 逻辑
        //         const pageIndex2 = Math.floor((lazyState.first || 0) / lazyState.rows);
        //         const size2 = lazyState.rows;
        //         service.getCustomers(pageIndex2, size2, simpleFilters).then((res) => {
        //             setCustomers(res.data);
        //             setTotalRecords(res.totalRecords);
        //         });
        //     })
        //     .finally(() => {
        //         setLoading(false);
        //     });

        // 取得mock資料
        service.getCustomers(pageIndex, size, simpleFilters).then((res) => {
            setCustomers(res.data);
            setTotalRecords(res.totalRecords);
            setLoading(false);
        });
    };

    // Row Editor 完成後的 callback
    const onRowEditComplete = async (e: DataTableRowEditCompleteEvent<CustomerConfigs>) => {
        const updatedRecord = e.newData as CustomerConfigs;
        const idx = e.index as number;

        // 先寫入預設的「System」
        updatedRecord.whoModified = defaultModifier;
        updatedRecord.modifiedAt = new Date().toISOString();

        // update service
        try {
            // 1. 後端預埋updated api
            // await fetch(`api/customers/${updatedRecord.id}`, {
            //     method: 'PUT',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(updatedRecord)
            // });

            // 2. 本地 mock service 更新
            await service.updateCustomer(updatedRecord);

            // 3. 同步更新畫面上的 customers state (只改該 index)
            setCustomers((prev) => {
                const arr = [...prev];
                arr[idx] = updatedRecord;
                return arr;
            });

            // 4. ★ 弹出 “保存成功” 的提示
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Record updated',
                life: 2000 // 提示2秒后自动消失
            });

            // 这里用 setTimeout 0ms，让上述 updateCustomer 完成后再触发一次 loadCustomers
            setTimeout(() => {
                // 重新拉“当前页”的切片，拿到刚刚更新过后的那条
                loadCustomers();
            }, 0);
        } catch (error) {
            console.error('更新失敗', error);
        }
    };

    // handle物件
    const handleSelectionChange = (e: DataTableRowEditCompleteEvent<CustomerConfigs>) => {
        setSelectedCustomer(e.value);
    };

    // 定義 lazy load 條件
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
    const onlineBody = (row: CustomerConfigs) => (row.online ? '●' : '');

    return (
        <div>
            <Toast ref={toast} />
            <h2>Customer Configurations</h2>
            <DataTable<CustomerConfigs>
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
                selectionMode="single"
                selection={selectedCustomer}
                onSelectionChange={handleSelectionChange}
            >
                {/* <Column field="id" header="ID" style={{ width: '120px' }} /> */}
                <Column field="customerID" header="Customer ID" style={{ width: '140px' }} />
                <Column field="name" header="Name" editor={textEditor} filter />
                <Column field="enabled" header="Enabled" body={yesNoBody} editor={switchEditor} filter />
                <Column field="gender" header="Gender" body={genderBody} editor={genderEditor} filter />
                <Column field="priority" header="Priority" editor={dropdownEditor} filter />
                <Column field="online" header="Online" body={(row) => (row.online ? '●' : '')} editor={switchEditor} filter />
                <Column field="action" header="Action" editor={textEditor} filter />
                {/* 新增「誰修改」與「修改時間」欄位 */}
                <Column field="whoModified" header="Who Modified" style={{ width: '140px' }} />
                <Column field="modifiedAt" header="Modified At" style={{ width: '180px' }} />
                <Column rowEditor headerStyle={{ width: '100px', textAlign: 'center' }} />
            </DataTable>
        </div>
    );
}
