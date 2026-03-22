import {
  Home, FileText, Zap, BarChart2, Image,
  MapPin, Download, Folder, Users, Settings,
  ToolCase
} from "lucide-react";

const navItems = [
  { icon: Home, label: "Dashboard", href: "/admin/" },
  { icon: FileText, label: "Sản Phẩm", href: "/admin/products/" },
  { icon: Zap, label: "Danh mục", href: "/admin/category/" },
  { icon: BarChart2, label: "Nhập Kho", href: "/admin/product_store/" },
  { icon: Image, label: "Khuyến mãi", href: "/admin/promotion/" },
  { icon: ToolCase, label: "Đơn hàng", href: "/admin/order/" },
  { icon: MapPin, label: "Bài viết", href: "/admin/post/" },
  { icon: Download, label: "Chủ đề bài viết", href: "/admin/topic/" },
  { icon: Folder, label: "Liên Hệ", href: "/admin/contact/" },
  { icon: Folder, label: "Banner", href: "/admin/banner/" },
  { icon: Folder, label: "Menu", href: "/admin/menu/" },
  { icon: Users, label: "Thành viên", href: "/admin/user/" },
  { icon: Settings, label: "Cài đặt", href: "/admin/setting/" },
];

export default navItems;
