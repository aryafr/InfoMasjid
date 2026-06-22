import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export async function POST(request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ valid: false, message: "Kode voucher tidak boleh kosong." }, { status: 400 });
    }

    const voucherDoc = await adminDb.collection('vouchers').doc(code.toUpperCase()).get();

    if (!voucherDoc.exists) {
      return NextResponse.json({ valid: false, message: "Kode voucher tidak valid atau tidak ditemukan." }, { status: 404 });
    }

    const data = voucherDoc.data();

    // Check active status
    if (!data.is_active) {
      return NextResponse.json({ valid: false, message: "Kode voucher sudah tidak aktif." }, { status: 400 });
    }

    // Check expiration
    if (data.valid_until) {
      const validUntil = new Date(data.valid_until);
      const now = new Date();
      if (now > validUntil) {
        return NextResponse.json({ valid: false, message: "Kode voucher sudah kedaluwarsa." }, { status: 400 });
      }
    }

    // Check quota
    if (data.max_uses && data.max_uses > 0) {
      const used = data.used_count || 0;
      if (used >= data.max_uses) {
        return NextResponse.json({ valid: false, message: "Kuota kode voucher sudah habis." }, { status: 400 });
      }
    }

    return NextResponse.json({
      valid: true,
      message: "Voucher berhasil diterapkan!",
      discount_type: data.discount_type,
      discount_value: data.discount_value
    });
  } catch (error) {
    console.error('Voucher Validation Error:', error);
    return NextResponse.json({ valid: false, message: "Terjadi kesalahan sistem saat memvalidasi voucher." }, { status: 500 });
  }
}
