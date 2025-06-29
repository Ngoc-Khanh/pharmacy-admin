// Import không cần thiết vì sử dụng fetch API để tránh interceptor
import { getAccessToken } from "@/lib/get-token";
import { getLocale } from "@/lib/get-locales";
import { siteConfig } from "@/config";

export type ExportModule = 'users' | 'suppliers' | 'medicines' | 'orders' | 'categories' | 'invoices';

export const ExcelAPI = {
  async exportByModule(module: ExportModule) {
    try {
      // Lấy token và locale một cách async
      const [token, locale] = await Promise.all([getAccessToken(), getLocale()]);
      // Sử dụng fetch API để tránh interceptor transform blob data
      const response = await fetch(`${siteConfig.backend.base_api_url}/v1/admin/excel/export/${module}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Authorization': `Bearer ${token}`,
          'Accept-Language': locale,  
        },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      // Nhận blob data từ response
      const blob = await response.blob();
      // Kiểm tra blob có hợp lệ không
      if (!(blob instanceof Blob) || blob.size === 0) throw new Error('Invalid blob data received');
      // Tạo URL blob và trigger download
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      // Đặt tên file với timestamp
      const timestamp = new Date().toISOString().slice(0, 10);
      link.download = `${module}_export_${timestamp}.xlsx`;
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Cleanup
      window.URL.revokeObjectURL(downloadUrl);
      return true;
    } catch (error) {
      console.error('Excel export error:', error);
      throw error;
    }
  },
};
