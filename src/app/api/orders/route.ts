import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ordersFile = path.join(process.cwd(), 'data', 'orders.json');

export async function GET() {
  try {
    if (!fs.existsSync(ordersFile)) {
      fs.writeFileSync(ordersFile, '[]', 'utf8');
    }
    const data = fs.readFileSync(ordersFile, 'utf8');
    const orders = JSON.parse(data);
    return NextResponse.json({ success: true, orders });
  } catch {
    return NextResponse.json({ success: false, orders: [] });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();
    if (!id || !status) return NextResponse.json({ success: false, error: 'Missing id or status' }, { status: 400 });

    const allowed = ['Processing', 'Shipped', 'Delivered'];
    if (!allowed.includes(status)) return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });

    const data = fs.readFileSync(ordersFile, 'utf8');
    const orders = JSON.parse(data);
    const idx = orders.findIndex((o: { id: string }) => o.id === id);
    if (idx === -1) return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });

    orders[idx].status = status;
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2), 'utf8');
    return NextResponse.json({ success: true, order: orders[idx] });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to update order' }, { status: 500 });
  }
}
