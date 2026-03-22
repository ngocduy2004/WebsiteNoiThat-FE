import Link from 'next/link';

export default function Error403() {
    return (
        <div style={{ textAlign: 'center', padding: '100px' }}>
            <h1 style={{ fontSize: '72px', color: 'red' }}>403</h1>
            <h2>BẠN KHÔNG CÓ QUYỀN TRUY CẬP</h2>
            <p>Trang này chỉ dành cho quản trị viên.</p>
            <Link href="/" style={{ color: 'blue', textDecoration: 'underline' }}>
                Quay về trang chủ
            </Link>
        </div>
    );
}