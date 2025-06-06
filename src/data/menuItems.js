


import { 
  BarChart, 
  Users, 
  FileText, 
  FileSpreadsheet, 
  Printer, 
  AlertTriangle, 
  Activity 
} from 'lucide-react';


export const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart, path: '/dashboard', roles: ['ADMIN', 'VENDOR', 'BRANCH', 'CORDINATOR', 'BILL VERIFY', 'ACCOUNTS', 'AUDIT'] },
  { id: 'vendor-details', label: 'Vendor Details', icon: Users, path: '/vendor-details', roles: ['ADMIN'] },
  { id: 'cn-without-challan', label: 'CN Without Challan', icon: FileText, path: '/cn-without-challan', roles: ['ADMIN'] },
  { id: 'lr-details', label: 'LR Details', icon: Activity, path: '/lr-details', roles: ['VENDOR', 'BRANCH'] },
  { id: 'cn-details', label: 'CN Details', icon: FileSpreadsheet, path: '/cn-details', roles: ['ADMIN'] },
  { id: 'bill-status', label: 'Bill Status', icon: Printer, path: '/bill-status', roles: ['ADMIN', 'VENDOR', 'BRANCH', 'CORDINATOR', 'BILL VERIFY', 'ACCOUNTS', 'AUDIT'] },
  { id: 'bill-generate-using-exel-upload', label: 'Bill Generate Using Excel Upload', icon: FileText, path: '/bill-generate-using-exel-upload', roles: ['VENDOR'] },
  { id: 'bill-noc', label: 'Bill NOC', icon: FileText, path: '/bill-noc', roles: ['VENDOR'] },
  { id: 'Generate-Annexure', label: 'Generate Annexure', icon: AlertTriangle, path: '/Generate-Annexure', roles: ['ADMIN', 'VENDOR', 'AUDIT'] },
  { id: 'bill-delete', label: 'Bill Delete', icon: FileText, path: '/bill-delete', roles: ['ADMIN'] },
  { id: 'pod-report', label: 'POD Report', icon: FileSpreadsheet, path: '/pod-report', roles: ['ADMIN'] },
  { id: 'cn-reports', label: 'CN Reports', icon: BarChart, path: '/cn-reports', roles: ['ADMIN', 'CORDINATOR', 'BILL VERIFY'] },
  { id: 'user-management', label: 'User Management', icon: Users, path: '/user-management', roles: ['ADMIN'] },
  { id: 'user-log', label: 'User Log', icon: Activity, path: '/user-log', roles: ['ADMIN'] },
  { id: 'assigned-vendor', label: 'Assigned Vendor', icon: Users, path: '/assigned-vendor', roles: ['CORDINATOR', 'BILL VERIFY'] },
  { id: 'posted-bill', label: 'Posted Bill', icon: FileSpreadsheet, path: '/posted-bill', roles: ['AUDIT'] },
  { id: 'posting-bill', label: 'Posting Bill', icon: FileSpreadsheet, path: '/posting-bill', roles: ['ACCOUNTS'] },
  { id: 'verify-expaness-of-cn', label: 'Verify Expanses of CN', icon: FileSpreadsheet, path: '/verify-expance-of-cn', roles: ['CORDINATOR'] },
  { id: 'reports', label: 'Reports', icon: FileSpreadsheet, path: '/reports', roles: ['VENDOR'] },
  { id: 'upload-lr-detail', label: 'Upload Lr Detail', icon: FileSpreadsheet, path: '/upload-lr-details', roles: ['BRANCH'] },
  { id: 'verify-bill-for-posting', label: 'Verify Bill For Posting', icon: FileSpreadsheet, path: '/verify-bill-for-posting', roles: ['BILL VERIFY'] },
  { id: 'annexure-details', label: 'Annexure Details', icon: FileSpreadsheet, path: '/annexure-details', roles: ['BRANCH'] },
  { id: 'all-Lr', label: 'All LR', icon: FileSpreadsheet, path: '/all-Lr', roles: ['VENDOR'] },
];
