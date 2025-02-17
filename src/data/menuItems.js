// import { Truck, MapPin, Navigation, Route as RoutePath, Car, Heater as GateEnter, Clock, List, Map, Calendar, AlertTriangle, Boxes, Camera, Activity, FileText, Printer, Users, FileSpreadsheet, Building, BarChart } from 'lucide-react';

// export const menuItems = [
//   { id: 'in-transit', label: 'In-Transit (For Your Branch)', icon: Truck, path: '/intransit' },
//   { id: 'geo-fencing', label: 'Geo Fencing (Nearby)', icon: MapPin, path: '/geo-fencing' },
//   { id: 'track', label: 'Track (My Vehicle)', icon: Navigation, path: '/track' },
//   { id: 'route-master', label: 'Route (Master)', icon: RoutePath, path: '/route-master' },
//   { id: 'ideal-vehicle', label: 'Ideal Vehicle (with Empty)', icon: Car, path: '/ideal-vehicle' },
//   { id: 'gate-entry', label: 'Gate Entry (Auto From GPS)', icon: GateEnter, path: '/gate-entry' },
//   { id: 'delay-vehicle', label: 'Delay Vehicle', icon: Clock, path: '/delay-vehicle' },
//   { id: 'mode-wise-transit', label: 'Mode wise In-Transit (Vehicle)', icon: List, path: '/mode-wise-transit' },
//   { id: 'track-all-vehicle', label: 'Track All Vehicle (5699)', icon: Map, path: '/track-all-vehicle' },
//   { id: 'trip-wise-utilization', label: 'Trip Wise Vehicle Utilization', icon: Calendar, path: '/trip-wise-utilization' },
//   { id: 'transit-delay-vehicle', label: 'In-Transit Delay Vehicle', icon: AlertTriangle, path: '/transit-delay-vehicle' },
//   { id: 'vehicle-fifo', label: 'Vehicle FIFO (Status)', icon: Boxes, path: '/vehicle-fifo' },
//   { id: 'vehicle-load-unload', label: 'Vehicle Load/Unload (Images)', icon: Camera, path: '/vehicle-load-unload' },
//   { id: 'vehicle-live', label: 'Vehicle Live (Status)', icon: Activity, path: '/vehicle-live' },
//   { id: 'device-challan', label: 'Device Challan Status', icon: FileText, path: '/device-challan' },
//   { id: 'sticker-print', label: 'Sticker Print From (Another Branch)', icon: Printer, path: '/sticker-print' },
//   { id: 'lorry-vendor', label: 'Lorry Vendor (Query)', icon: Users, path: '/lorry-vendor' },
//   { id: 'consolidate-eway', label: 'Consolidate Eway (Detail)', icon: FileSpreadsheet, path: '/consolidate-eway' },
//   { id: 'multibranch-sticker', label: 'Sticker Print (>1 Branch)', icon: Building, path: '/multibranch-sticker' },
//   { id: 'req-vs-ideal', label: 'REQ VS IDEAL VEHICLE (Detail)', icon: BarChart, path: '/req-vs-ideal' }
// ];


import { BarChart, Users, FileText, FileSpreadsheet, Printer, AlertTriangle, Activity } from 'lucide-react';

export const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart, path: '/dashboard' },
  { id: 'vendor-details', label: 'Vendor Details', icon: Users, path: '/vendor-details' },
  { id: 'cn-without-challan', label: 'CN Without Challan', icon: FileText, path: '/cn-without-challan' },
  { id: 'cn-details', label: 'CN Details', icon: FileSpreadsheet, path: '/cn-details' },
  { id: 'bill-status', label: 'Bill Status', icon: Printer, path: '/bill-status' },
  { id: 'pending-bill-generation', label: 'Pending Bill Generation', icon: AlertTriangle, path: '/pending-bill-generation' },
  { id: 'bill-delete', label: 'Bill Delete', icon: FileText, path: '/bill-delete' },
  { id: 'pod-report', label: 'POD Report', icon: FileSpreadsheet, path: '/pod-report' },
  { id: 'cn-reports', label: 'CN Reports', icon: BarChart, path: '/cn-reports' },
  { id: 'user-management', label: 'User Management', icon: Users, path: '/user-management' },
  { id: 'user-log', label: 'User Log', icon: Activity, path: '/user-log' }
];

