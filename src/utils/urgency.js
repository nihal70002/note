export const getFakeStockCount = () => Math.floor(Math.random() * 5) + 3;

const productCardTemplates = [
  (count) => `Only ${count} left`,
  (count) => `Only ${count} items remaining`,
  () => 'Selling fast',
  () => 'Limited Time Offer',
];

const conversionHookTemplates = [
  () => '23 people viewed this today',
  () => 'Trending product',
  () => 'Popular choice this week',
];

const cartBannerTemplates = [
  'Products in your cart are selling fast',
  'Complete your order before offer ends',
];

const pickRandom = (items) => items[Math.floor(Math.random() * items.length)];

export const createProductCardUrgency = () => {
  const fakeStock = getFakeStockCount();
  const message = pickRandom(productCardTemplates)(fakeStock);
  const hook = pickRandom(conversionHookTemplates)();

  return { fakeStock, message, hook };
};

export const createProductDetailUrgency = () => {
  const fakeStock = 2;
  const message = `Only ${fakeStock} item left`;

  return { fakeStock, message };
};

export const createCartUrgencyMessage = () => pickRandom(cartBannerTemplates);
