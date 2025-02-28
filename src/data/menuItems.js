

// import { BarChart, Users, FileText, FileSpreadsheet, Printer, AlertTriangle, Activity } from 'lucide-react';

// export const menuItems = [
//   { id: 'dashboard', label: 'Dashboard', icon: BarChart, path: '/dashboard' },
//   { id: 'vendor-details', label: 'Vendor Details', icon: Users, path: '/vendor-details' },
//   { id: 'cn-without-challan', label: 'CN Without Challan', icon: FileText, path: '/cn-without-challan' },
//   { id: 'cn-details', label: 'CN Details', icon: FileSpreadsheet, path: '/cn-details' },
//   { id: 'bill-status', label: 'Bill Status', icon: Printer, path: '/bill-status' },
//   { id: 'pending-bill-generation', label: 'Pending Bill Generation', icon: AlertTriangle, path: '/pending-bill-generation' },
//   { id: 'bill-delete', label: 'Bill Delete', icon: FileText, path: '/bill-delete' },
//   { id: 'pod-report', label: 'POD Report', icon: FileSpreadsheet, path: '/pod-report' },
//   { id: 'cn-reports', label: 'CN Reports', icon: BarChart, path: '/cn-reports' },
//   { id: 'user-management', label: 'User Management', icon: Users, path: '/user-management' },
//   { id: 'user-log', label: 'User Log', icon: Activity, path: '/user-log' }
// ];

// export const menuItems = [
//   { id: 'dashboard', label: 'Dashboard', icon: BarChart, path: '/dashboard', roles: ['ADMIN', 'BRANCH', 'VENDOR', 'CORDINATOR'] },
//   { id: 'vendor-details', label: 'Vendor Details', icon: Users, path: '/vendor-details', roles: ['ADMIN', 'VENDOR'] },
//   { id: 'cn-without-challan', label: 'CN Without Challan', icon: FileText, path: '/cn-without-challan', roles: ['ADMIN', 'BRANCH'] },
//   { id: 'cn-details', label: 'CN Details', icon: FileSpreadsheet, path: '/cn-details', roles: ['ADMIN', 'BILL VERIFY'] },
//   { id: 'bill-status', label: 'Bill Status', icon: Printer, path: '/bill-status', roles: ['ADMIN', 'ACCOUNTS'] },
//   { id: 'pending-bill-generation', label: 'Pending Bill Generation', icon: AlertTriangle, path: '/pending-bill-generation', roles: ['ADMIN', 'AUDIT'] },
//   { id: 'bill-delete', label: 'Bill Delete', icon: FileText, path: '/bill-delete', roles: ['ADMIN', 'AUDIT'] },
//   { id: 'pod-report', label: 'POD Report', icon: FileSpreadsheet, path: '/pod-report', roles: ['ADMIN', 'ACCOUNTS', 'BILL VERIFY'] },
//   { id: 'cn-reports', label: 'CN Reports', icon: BarChart, path: '/cn-reports', roles: ['ADMIN', 'BILL VERIFY', 'ACCOUNTS'] },
//   { id: 'user-management', label: 'User Management', icon: Users, path: '/user-management', roles: ['ADMIN'] },
//   { id: 'user-log', label: 'User Log', icon: Activity, path: '/user-log', roles: ['ADMIN', 'AUDIT'] }
// ];

// import { BarChart, Users, FileText, FileSpreadsheet, Printer, AlertTriangle, Activity } from 'lucide-react';

// export const menuItems = [
//   { id: 'dashboard', label: 'Dashboard', icon: BarChart, path: '/dashboard', roles: ['ADMIN', 'BRANCH', 'VENDOR', 'CORDINATOR' , 'ACCOUNT' , 'AUDIT'] },
//   { id: 'vendor-details', label: 'Vendor Details', icon: Users, path: '/vendor-details', roles: ['ADMIN'] },
//   { id: 'cn-without-challan', label: 'CN Without Challan', icon: FileText, path: '/cn-without-challan', roles: ['ADMIN', 'BRANCH'] },
//   { id: 'cn-details', label: 'CN Details', icon: FileSpreadsheet, path: '/cn-details', roles: ['ADMIN', 'BILL VERIFY'] },
//   { id: 'bill-status', label: 'Bill Status', icon: Printer, path: '/bill-status', roles: ['ADMIN', 'ACCOUNTS'] },
//   { id: 'lr-details', label: 'LR-Details', icon: Activity, path: '/lr-deta', roles: ['ADMIN', 'AUDIT'] },
//   { id: 'pending-bill-generation', label: 'Pending Bill Generation', icon: AlertTriangle, path: '/pending-bill-generation', roles: ['ADMIN', 'AUDIT'] },
//   { id: 'bill-delete', label: 'Bill Delete', icon: FileText, path: '/bill-delete', roles: ['ADMIN', 'AUDIT'] },
//   { id: 'pod-report', label: 'POD Report', icon: FileSpreadsheet, path: '/pod-report', roles: ['ADMIN', 'ACCOUNTS', 'BILL VERIFY'] },
//   { id: 'cn-reports', label: 'CN Reports', icon: BarChart, path: '/cn-reports', roles: ['ADMIN', 'BILL VERIFY', 'ACCOUNTS'] },
//   { id: 'user-management', label: 'User Management', icon: Users, path: '/user-management', roles: ['ADMIN'] },
//   { id: 'user-log', label: 'User Log', icon: Activity, path: '/user-log', roles: ['ADMIN', 'AUDIT'] }
// ];


import { 
  BarChart, 
  Users, 
  FileText, 
  FileSpreadsheet, 
  Printer, 
  AlertTriangle, 
  Activity 
} from 'lucide-react';



// export const menuItems = [
//   { id: 'dashboard', label: 'Dashboard', icon: BarChart, path: '/dashboard', roles: ['ADMIN', 'VENDOR', 'BRANCH', 'CORDINATOR', 'BILL VERIFY', 'ACCOUNTS', 'AUDIT'] },
//   { id: 'vendor-details', label: 'Vendor Details', icon: Users, path: '/vendor-details', roles: ['ADMIN'] },
//   { id: 'cn-without-challan', label: 'CN Without Challan', icon: FileText, path: '/cn-without-challan', roles: ['ADMIN'] },
//   { id: 'lr-details', label: 'LR Details', icon: Activity, path: '/lr-details', roles: [ 'VENDOR', 'BRANCH'] },
//   { id: 'cn-details', label: 'CN Details', icon: FileSpreadsheet, path: '/cn-details', roles: ['ADMIN'] },
//   { id: 'bill-status', label: 'Bill Status', icon: Printer, path: '/bill-status', roles: ['ADMIN', 'VENDOR', 'BRANCH', 'CORDINATOR', 'BILL VERIFY', 'ACCOUNTS', 'AUDIT'] },
//   { id: 'bill-generate-using-exel-upload', label: 'Bill Generate Using Excel Upload', icon: FileText, path: '/bill-generate-using-exel-upload', roles: ['ADMIN', 'VENDOR'] },
//   { id: 'bill-noc', label: 'Bill NOC', icon: FileText, path: '/bill-noc', roles: ['ADMIN', 'VENDOR'] },
//   { id: 'pending-bill-generation', label: 'Pending Bill Generation', icon: AlertTriangle, path: '/pending-bill-generation', roles: ['ADMIN', 'VENDOR', 'AUDIT', 'ACCOUNTS'] },
//   { id: 'bill-delete', label: 'Bill Delete', icon: FileText, path: '/bill-delete', roles: ['ADMIN'] },
//   { id: 'pod-report', label: 'POD Report', icon: FileSpreadsheet, path: '/pod-report', roles: ['ADMIN'] },
//   { id: 'cn-reports', label: 'CN Reports', icon: BarChart, path: '/cn-reports', roles: ['ADMIN', 'CORDINATOR', 'BILL VERIFY'] },
//   { id: 'user-management', label: 'User Management', icon: Users, path: '/user-management', roles: ['ADMIN'] },
//   { id: 'user-log', label: 'User Log', icon: Activity, path: '/user-log', roles: ['ADMIN'] },
//   { id: 'assigned-vendor', label: 'Assigned Vendor', icon: Users, path: '/assigned-vendor', roles: ['CORDINATOR', 'BILL VERIFY'] },
//   { id: 'posted-bill', label: 'Posted Bill', icon: FileSpreadsheet, path: '/posted-bill', roles: ['AUDIT'] },
//   { id: 'posting-bill', label: 'Posting Bill', icon: FileSpreadsheet, path: '/posting-bill', roles: ['ACCOUNTS'] },
//   { id: 'verify-expaness-of-cn', label: 'verify-expaness-of-cn', icon: FileSpreadsheet, path: '/verify-expance-of-cn', roles: ['CORDINATOR'] }
// ];

export const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart, path: '/dashboard', roles: ['ADMIN', 'VENDOR', 'BRANCH', 'CORDINATOR', 'BILL VERIFY', 'ACCOUNTS', 'AUDIT'] },
  { id: 'vendor-details', label: 'Vendor Details', icon: Users, path: '/vendor-details', roles: ['ADMIN'] },
  { id: 'cn-without-challan', label: 'CN Without Challan', icon: FileText, path: '/cn-without-challan', roles: ['ADMIN'] },
  { id: 'lr-details', label: 'LR Details', icon: Activity, path: '/lr-details', roles: ['VENDOR', 'BRANCH'] },
  { id: 'cn-details', label: 'CN Details', icon: FileSpreadsheet, path: '/cn-details', roles: ['ADMIN'] },
  { id: 'bill-status', label: 'Bill Status', icon: Printer, path: '/bill-status', roles: ['ADMIN', 'VENDOR', 'BRANCH', 'CORDINATOR', 'BILL VERIFY', 'ACCOUNTS', 'AUDIT'] },
  { id: 'bill-generate-using-exel-upload', label: 'Bill Generate Using Excel Upload', icon: FileText, path: '/bill-generate-using-exel-upload', roles: ['VENDOR'] },
  { id: 'bill-noc', label: 'Bill NOC', icon: FileText, path: '/bill-noc', roles: ['VENDOR'] },
  { id: 'pending-bill-generation', label: 'Pending Bill Generation', icon: AlertTriangle, path: '/pending-bill-generation', roles: ['ADMIN', 'VENDOR', 'AUDIT'] },
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
  { id: 'upload-lr-details', label: 'Upload Lr Detail', icon: FileSpreadsheet, path: '/upload-lr-details', roles: ['BRANCH'] },
  { id: 'verify-bill-for-posting', label: 'Verify Bill For Posting', icon: FileSpreadsheet, path: '/verify-bill-for-posting', roles: ['BILL VERIFY'] },


];
