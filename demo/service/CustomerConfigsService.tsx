import { Demo } from '@/types';

export interface CustomerConfigs {
    id: string;
    customerID: number;
    name: string;
    enabled: 0 | 1;
    gender: 0 | 1 | 2;
    priority: 'High' | 'Medium' | 'Low';
    online: 0 | 1;
    action: string;
}

export interface LazyLoadEvent {
    first?: number;
    rows?: number;
    sortField?: string;
    sortOrder?: number;
    filters?: Record<string, any>;
}

export class CustomerConfigsService {
    private data: CustomerConfigs[];

    constructor() {
        // Generate 1000 mock records
        this.data = this.generateData(1000);
    }

    private generateData(count: number): CustomerConfigs[] {
        const priorities: Array<'High' | 'Medium' | 'Low'> = ['High', 'Medium', 'Low'];
        const names = ['Alice', 'Bob', 'Charlie', 'David', 'Eva', 'Frank', 'Grace', 'Hank'];
        const arr: CustomerConfigs[] = [];
        for (let i = 1; i <= count; i++) {
            arr.push({
                id: `SYS${i.toString().padStart(4, '0')}`,
                customerID: 1000 + i,
                name: names[Math.floor(Math.random() * names.length)] + ` ${i}`,
                enabled: Math.random() > 0.5 ? 1 : 0,
                gender: Math.floor(Math.random() * 3) as 0 | 1 | 2,
                priority: priorities[Math.floor(Math.random() * priorities.length)],
                online: Math.random() > 0.5 ? 1 : 0,
                action: `Action ${i}`
            });
        }
        return arr;
    }
    getCustomers(page: number, size: number, filters: Record<string, any>): Promise<{ data: CustomerConfigs[]; totalRecords: number }> {
        let filtered = [...this.data];
        Object.keys(filters).forEach((field) => {
            const value = filters[field];
            if (value != null && value !== '') {
                filtered = filtered.filter((item) => (item[field as keyof CustomerConfigs] as any).toString().toLowerCase().includes(value.toString().toLowerCase()));
            }
        });
        const total = filtered.length;
        const start = page * size;
        const end = start + size;
        return Promise.resolve({ data: filtered.slice(start, end), totalRecords: total });
    }

    updateCustomer(updated: CustomerConfigs): Promise<void> {
        return new Promise((resolve) => {
            const idx = this.data.findIndex((c) => c.id === updated.id);
            if (idx !== -1) {
                this.data[idx] = { ...updated };
            }
            resolve();
        });
    }

    getCustomerConfigs = async (): Promise<CustomerConfigs[]> => {
        return new Promise((resolve) => setTimeout(() => resolve([..._mockData]), 500));
    };

    updateAllEnabled = async (enabled: 0 | 1): Promise<CustomerConfigs[]> => {
        _mockData = _mockData.map((c) => ({ ...c, enabled }));
        return new Promise((resolve) => setTimeout(() => resolve([..._mockData]), 500));
    };

    updateCustomerConfig = async (config: CustomerConfigs): Promise<CustomerConfigs> => {
        _mockData = _mockData.map((c) => (c.id === config.id ? config : c));
        return new Promise((resolve) => setTimeout(() => resolve(config), 500));
    };
}
