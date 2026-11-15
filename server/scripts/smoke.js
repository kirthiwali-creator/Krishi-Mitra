const BASE = process.env.API_URL || 'http://localhost:5001/api';
let failed = 0;

const check = (name, ok) => {
  console.log((ok ? 'PASS  ' : 'FAIL  ') + name);
  if (!ok) failed += 1;
};

const call = async (method, path, body, token) => {
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
    body: body ? JSON.stringify(body) : undefined
  });
  let data = null;
  try {
    data = await res.json();
  } catch (err) {
    data = null;
  }
  return { status: res.status, data };
};

async function main() {
  const tag = Date.now();
  const farmerBody = {
    name: 'Test Farmer',
    email: 'tf' + tag + '@test.in',
    password: 'secret123',
    role: 'farmer',
    phone: '9876543210',
    state: 'Karnataka',
    district: 'Mandya'
  };
  const buyerBody = { name: 'Test Buyer', email: 'tb' + tag + '@test.in', password: 'secret123', role: 'buyer', phone: '9123456780' };

  let r = await call('GET', '/health');
  check('health endpoint', r.status === 200);

  r = await call('POST', '/auth/register', farmerBody);
  check('farmer registers', r.status === 201 && r.data.token);
  const farmerToken = r.data.token;

  r = await call('POST', '/auth/register', farmerBody);
  check('duplicate email rejected', r.status === 409);

  r = await call('POST', '/auth/register', { ...buyerBody, email: 'bad' + tag + '@test.in', phone: '123' });
  check('invalid phone rejected', r.status === 400 && r.data.code === 'VALIDATION');

  r = await call('POST', '/auth/register', buyerBody);
  check('buyer registers', r.status === 201 && r.data.token);
  const buyerToken = r.data.token;

  r = await call('POST', '/auth/login', { email: farmerBody.email, password: 'secret123' });
  check('login works', r.status === 200 && r.data.user.role === 'farmer');

  r = await call('POST', '/auth/login', { email: farmerBody.email, password: 'wrongpass' });
  check('wrong password rejected', r.status === 401);

  r = await call('GET', '/auth/me', null, buyerToken);
  check('token returns profile', r.status === 200 && r.data.user.role === 'buyer');

  const cropName = 'SmokeCrop' + tag;
  r = await call('POST', '/crops', { name: cropName, category: 'grain', pricePerKg: 25, quantityKg: 100, minOrderKg: 5 }, farmerToken);
  check('farmer creates crop', r.status === 201 && r.data.crop._id);
  const cropId = r.data.crop && r.data.crop._id;

  r = await call('POST', '/crops', { name: cropName, category: 'grain', pricePerKg: 25, quantityKg: 100 }, buyerToken);
  check('buyer cannot create crop', r.status === 403);

  r = await call('POST', '/crops', { name: cropName, category: 'grain', pricePerKg: -3, quantityKg: 100 }, farmerToken);
  check('invalid price rejected', r.status === 400);

  r = await call('GET', '/crops?q=' + cropName);
  check('search finds crop', r.status === 200 && r.data.crops.some((c) => c._id === cropId));

  r = await call('GET', '/crops?q=' + cropName + '&category=fruit');
  check('category filter excludes crop', r.status === 200 && r.data.total === 0);

  r = await call('GET', '/crops?q=' + cropName + '&minPrice=30');
  check('price filter excludes crop', r.status === 200 && r.data.total === 0);

  r = await call('GET', '/crops?q=' + cropName + '&minPrice=20&maxPrice=30&sort=priceLow');
  check('price range includes crop', r.status === 200 && r.data.total === 1);

  const order = { cropId, quantityKg: 10, deliveryAddress: '5 Test Street, Bengaluru', contactPhone: '9123456780' };
  r = await call('POST', '/orders', order, buyerToken);
  check('buyer places order', r.status === 201 && r.data.order.totalPrice === 250);
  const orderId = r.data.order && r.data.order._id;

  r = await call('GET', '/crops/' + cropId);
  check('stock reduced after order', r.data.crop.quantityKg === 90);

  r = await call('POST', '/orders', { ...order, quantityKg: 5000 }, buyerToken);
  check('over-stock order rejected', r.status === 400 && r.data.code === 'INSUFFICIENT_STOCK');

  r = await call('POST', '/orders', { ...order, quantityKg: 2 }, buyerToken);
  check('below minimum order rejected', r.status === 400 && r.data.code === 'MIN_ORDER');

  r = await call('POST', '/orders', order, farmerToken);
  check('farmer cannot place order', r.status === 403);

  r = await call('PATCH', '/orders/' + orderId + '/status', { status: 'delivered' }, farmerToken);
  check('skipping steps rejected', r.status === 400 && r.data.code === 'INVALID_TRANSITION');

  for (const status of ['accepted', 'shipped', 'delivered']) {
    r = await call('PATCH', '/orders/' + orderId + '/status', { status }, farmerToken);
    check('order ' + status, r.status === 200 && r.data.order.status === status);
  }

  r = await call('POST', '/orders', { ...order, quantityKg: 20 }, buyerToken);
  const cancelId = r.data.order._id;
  r = await call('PATCH', '/orders/' + cancelId + '/status', { status: 'cancelled' }, buyerToken);
  check('buyer cancels pending order', r.status === 200 && r.data.order.status === 'cancelled');
  r = await call('GET', '/crops/' + cropId);
  check('stock restored after cancel', r.data.crop.quantityKg === 90);

  r = await call('POST', '/orders', { ...order, quantityKg: 15 }, buyerToken);
  const rejectId = r.data.order._id;
  r = await call('PATCH', '/orders/' + rejectId + '/status', { status: 'rejected' }, farmerToken);
  check('farmer rejects order', r.status === 200 && r.data.order.status === 'rejected');
  r = await call('GET', '/crops/' + cropId);
  check('stock restored after reject', r.data.crop.quantityKg === 90);

  r = await call('GET', '/orders/mine', null, farmerToken);
  check('farmer sees 3 orders', r.status === 200 && r.data.orders.length === 3);
  r = await call('GET', '/orders/mine?status=delivered', null, buyerToken);
  check('buyer filters delivered orders', r.status === 200 && r.data.orders.length === 1);

  r = await call('GET', '/dashboard/stats', null, farmerToken);
  check('farmer stats revenue', r.status === 200 && r.data.revenue === 250 && r.data.totalOrders === 3);
  r = await call('GET', '/dashboard/stats', null, buyerToken);
  check('buyer stats spent', r.status === 200 && r.data.spent === 250);

  r = await call('PUT', '/crops/' + cropId, { pricePerKg: 30 }, farmerToken);
  check('farmer updates price', r.status === 200 && r.data.crop.pricePerKg === 30);

  r = await call('GET', '/info/sources');
  check('info sources available', r.status === 200 && r.data.sources.length > 0);
  r = await call('GET', '/info/guides');
  check('crop guides available', r.status === 200 && r.data.guides.length > 0);

  r = await call('DELETE', '/crops/' + cropId, null, farmerToken);
  check('farmer deletes crop without open orders', r.status === 200);

  console.log(failed === 0 ? '\nAll checks passed' : '\n' + failed + ' check(s) failed');
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error('Smoke test could not run. Is the server running?', err.message);
  process.exit(1);
});
