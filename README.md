# Trang Quản Trị (Admin Dashboard) - TechShop

Chào mừng bạn đến với trang quản trị của dự án TechShop\! Đây là một giao diện quản trị mạnh mẽ và hiện đại, được xây dựng để giúp các quản trị viên dễ dàng theo dõi và quản lý mọi hoạt động của cửa hàng công nghệ.

Dự án được xây dựng bằng **React** và **Vite**, mang lại trải nghiệm phát triển nhanh chóng và hiệu suất cao cho người dùng cuối.

## 🚀 Công Nghệ Sử Dụng

Dự án này được xây dựng với các công nghệ và thư viện hiện đại:

  * **Nền tảng:** [React 19](https://react.dev/) & [Vite](https://vitejs.dev/)
  * **Quản lý định tuyến:** [React Router DOM](https://reactrouter.com/)
  * **Gọi API:** [Axios](https://axios-http.com/)
  * **Quản lý trạng thái:** React Hooks (useState, useEffect, useContext), Context API
  * **Biểu đồ & Trực quan hóa dữ liệu:** [Recharts](https://recharts.org/)
  * **Icons:** [Lucide React](https://lucide.dev/)
  * **Styling:** CSS thuần & CSS Modules

## 📋 Yêu Cầu

Để chạy được dự án này, bạn cần cài đặt:

  * [Node.js](https://nodejs.org/) (phiên bản 18.x hoặc 20.x được khuyến nghị)
  * `npm` hoặc `yarn`
  * **Quan trọng:** Backend của dự án phải đang chạy và có thể truy cập được tại địa chỉ `http://localhost:8080`.

## 🛠️ Hướng Dẫn Cài Đặt và Chạy Dự Án

Thực hiện theo các bước dưới đây để khởi chạy dự án trên máy của bạn:

1.  **Clone repository**

    ```bash
    git clone https://github.com/WEBSITE-QU-N-LI-BAN-HANG-CONG-NGH/FrontEnd-Admin
    cd FrontEnd-Admin
    ```

2.  **Cài đặt các gói phụ thuộc**

    Sử dụng `npm` hoặc `yarn`:

    ```bash
    npm install
    ```

    hoặc

    ```bash
    yarn install
    ```

3.  **Chạy server development**

    ```bash
    npm run dev
    ```

6.  **Truy cập ứng dụng**

    Mở trình duyệt và truy cập vào [http://localhost:5175](http://localhost:5175) (dựa trên cấu hình trong `vite.config.js`). Giờ đây bạn có thể thấy trang đăng nhập của quản trị viên.

## 📁 Cấu Trúc Thư Mục

Dưới đây là tổng quan về cấu trúc các thư mục quan trọng trong `src`:

```
/src
├── components/         # Các component UI tái sử dụng
│   ├── common/         # Components chung (Loading, Toast, Alert...)
│   ├── features/       # Components dành riêng cho các tính năng (dashboard, products...)
│   └── layout/         # Components cấu trúc layout (Header, Sidebar, Layout)
├── contexts/           # React Context (ví dụ: ToastContext)
├── hooks/              # Các custom hooks chứa logic (ví dụ: useAuth, useProducts)
├── pages/              # Các component trang chính, tương ứng với các route
│   ├── admin/          # Các trang quản trị (Dashboard, ProductManagement...)
│   └── auth/           # Các trang xác thực (Login, NotFound)
├── services/           # Logic gọi API, tương tác với backend
├── styles/             # Các file CSS toàn cục và cho từng phần
├── utils/              # Các hàm tiện ích (ví dụ: format tiền tệ, ngày tháng)
├── AppRouter.jsx       # Định nghĩa các routes của ứng dụng
└── main.jsx            # Điểm bắt đầu của ứng dụng React
```

## ✨ Tính Năng Chính

Trang quản trị cung cấp đầy đủ các công cụ cần thiết để vận hành một hệ thống bán hàng hiệu quả:

  * **📊 Bảng điều khiển (Dashboard):**

      * Hiển thị các số liệu thống kê quan trọng như tổng sản phẩm, hàng trong kho, và số lượng đã bán.
      * Biểu đồ trực quan về doanh thu theo khoảng thời gian tùy chọn (tuần, tháng, hoặc ngày cụ thể).
      * Biểu đồ tròn phân tích tỷ lệ doanh thu theo từng danh mục sản phẩm.
      * Danh sách các đơn hàng gần đây và các sản phẩm bán chạy nhất.

  * **📦 Quản lý Sản phẩm:**

      * Xem danh sách tất cả sản phẩm với bộ lọc và sắp xếp nâng cao (theo tên, giá, số lượng, danh mục).
      * Thêm, xem chi tiết, và xóa sản phẩm một cách dễ dàng.
      * Giao diện modal để xem chi tiết thông tin sản phẩm mà không cần rời khỏi trang.

  * **🛒 Quản lý Đơn hàng:**

      * Theo dõi tất cả đơn hàng theo trạng thái (chờ xác nhận, đã xác nhận, đang giao, đã giao, đã hủy).
      * Tìm kiếm và lọc đơn hàng theo mã đơn, khách hàng, hoặc khoảng thời gian.
      * Xem chi tiết từng đơn hàng, bao gồm thông tin khách hàng, địa chỉ giao hàng, và các sản phẩm đã đặt.
      * Cập nhật trạng thái và xóa đơn hàng.

  * **👥 Quản lý Người dùng:**

      * Xem danh sách khách hàng và người bán trong hệ thống.
      * Lọc người dùng theo vai trò (khách hàng, người bán) và tìm kiếm theo email hoặc tên.
      * Xem chi tiết thông tin người dùng, bao gồm lịch sử mua hàng và tổng chi tiêu.
      * Khóa hoặc mở khóa tài khoản người dùng.

  * **🔐 Xác thực & Phân quyền:**

      * Trang đăng nhập an toàn dành cho quản trị viên.
      * Sử dụng Access Token và Refresh Token để duy trì phiên đăng nhập và tăng cường bảo mật.
      * Các tuyến đường (routes) được bảo vệ, chỉ cho phép quản trị viên truy cập vào các trang quản lý.