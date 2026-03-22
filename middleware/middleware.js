import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('user_role')?.value;
  const { pathname } = request.nextUrl;

  // KIỂM TRA LOG Ở TERMINAL (Màn hình đen chạy npm run dev)
  console.log("--- Middleware Check ---");
  console.log("Path:", pathname);
  console.log("Role từ Cookie:", role);

  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    
    // Kiểm tra xem role có đúng là chuỗi 'admin' không
    if (role !== 'admin') {
      console.log("=> Chặn: Không phải admin, chuyển hướng về 403");
      return NextResponse.redirect(new URL('/403', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};