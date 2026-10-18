const PROMO_CODE = 'SAVE10';
const PROMO_DISCOUNT_RATE = 0.1;
const PROMO_MIN_SUBTOTAL = 20000;
const FREE_DELIVERY_FROM = 50000;
const DELIVERY_PRICE = 30000;

function assertValidQuantity(quantity) {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new RangeError('Количество должно быть положительным целым числом');
  }
}

function assertInStock(product, quantity) {
  if (quantity > product.stock) {
    throw new RangeError('Количество не может превышать остаток на складе');
  }
}

function addToCart(cart, product, quantity) {
  assertValidQuantity(quantity);

  const existingItem = cart.find((item) => item.id === product.id);

  if (!existingItem) {
    assertInStock(product, quantity);
    return [...cart, { ...product, quantity }];
  }

  const newQuantity = existingItem.quantity + quantity;
  assertInStock(existingItem, newQuantity);

  return cart.map((item) =>
      item.id === product.id ? { ...item, quantity: newQuantity } : item
  );
}

function changeQuantity(cart, productId, quantity) {
  assertValidQuantity(quantity);

  const existingItem = cart.find((item) => item.id === productId);
  if (!existingItem) return [...cart];

  assertInStock(existingItem, quantity);

  return cart.map((item) =>
      item.id === productId ? { ...item, quantity } : item
  );
}

function removeFromCart(cart, productId) {
  return cart.filter((item) => item.id !== productId);
}

function calculateCartSubtotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function calculateOrderTotal(cart, promoCode) {
  const subtotal = calculateCartSubtotal(cart);

  const isPromoApplied = promoCode === PROMO_CODE && subtotal >= PROMO_MIN_SUBTOTAL;
  const discount = isPromoApplied ? Math.round(subtotal * PROMO_DISCOUNT_RATE) : 0;

  const delivery = subtotal < FREE_DELIVERY_FROM ? DELIVERY_PRICE : 0;
  const total = subtotal - discount + delivery;

  return { subtotal, discount, delivery, total };
}

const cartApi = { addToCart, changeQuantity, removeFromCart, calculateCartSubtotal, calculateOrderTotal };

if (typeof module !== 'undefined') module.exports = cartApi;
if (typeof window !== 'undefined') window.cartApi = cartApi;
