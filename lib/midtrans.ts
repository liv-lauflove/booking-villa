import midtransClient from 'midtrans-client';

const isProduction = process.env.NODE_ENV === 'production';

export const snap = new midtransClient.Snap({
  isProduction: false, // We force sandbox for now
  serverKey: process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-dummy',
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || 'SB-Mid-client-dummy'
});
