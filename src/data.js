// Starting data. After first load, products and offers live in localStorage
// and are managed from the /admin page.

export const CATEGORIES = ['Kitchen', 'Decor', 'Textiles', 'Wellness']

export const seedProducts = [
  { id: 'p1', name: 'Stoneware Chai Cups (set of 4)', category: 'Kitchen', price: 899, mrp: 1199, stock: 14, emoji: '☕', hue: 24, featured: true, image: '', description: 'Hand-thrown stoneware cups with a speckled glaze. Microwave and dishwasher safe. Each cup holds 150 ml.' },
  { id: 'p2', name: 'Acacia Wood Serving Board', category: 'Kitchen', price: 1249, mrp: 1499, stock: 8, emoji: '🪵', hue: 34, featured: false, image: '', description: 'Single-piece acacia board finished with food-grade oil. Good for cheese, bread or as a chopping board.' },
  { id: 'p3', name: 'Brass Masala Dabba', category: 'Kitchen', price: 1899, mrp: 2299, stock: 5, emoji: '🫙', hue: 46, featured: true, image: '', description: 'Seven-compartment spice box in solid brass with a tight lid and a small spoon.' },
  { id: 'p4', name: 'Terracotta Planter, Medium', category: 'Decor', price: 549, mrp: 699, stock: 22, emoji: '🪴', hue: 14, featured: true, image: '', description: 'Unglazed terracotta planter with drainage hole and saucer. 18 cm across.' },
  { id: 'p5', name: 'Cane Pendant Lampshade', category: 'Decor', price: 2199, mrp: 2799, stock: 4, emoji: '💡', hue: 40, featured: false, image: '', description: 'Handwoven cane shade that throws a warm patterned light. Fits a standard B22 holder.' },
  { id: 'p6', name: 'Block Print Wall Hanging', category: 'Decor', price: 1349, mrp: 1349, stock: 9, emoji: '🖼️', hue: 350, featured: false, image: '', description: 'Hand block-printed cotton panel on a wooden dowel. 45 × 60 cm.' },
  { id: 'p7', name: 'Handloom Cotton Throw', category: 'Textiles', price: 1799, mrp: 2199, stock: 11, emoji: '🧶', hue: 200, featured: true, image: '', description: 'Soft handloom throw in indigo stripes. 130 × 180 cm. Machine wash cold.' },
  { id: 'p8', name: 'Block Print Cushion Covers (pair)', category: 'Textiles', price: 749, mrp: 999, stock: 18, emoji: '🛋️', hue: 330, featured: false, image: '', description: 'Two 40 × 40 cm cotton covers with concealed zips. Inserts not included.' },
  { id: 'p9', name: 'Jute Table Runner', category: 'Textiles', price: 649, mrp: 799, stock: 0, emoji: '🧵', hue: 60, featured: false, image: '', description: 'Natural jute runner with cotton tassels. 33 × 180 cm.' },
  { id: 'p10', name: 'Soy Wax Candle, Sandalwood', category: 'Wellness', price: 499, mrp: 599, stock: 30, emoji: '🕯️', hue: 280, featured: true, image: '', description: 'Hand-poured soy wax candle in a reusable glass jar. Burns for about 30 hours.' },
  { id: 'p11', name: 'Neem Wood Comb', category: 'Wellness', price: 249, mrp: 299, stock: 40, emoji: '🪮', hue: 100, featured: false, image: '', description: 'Wide-tooth comb carved from neem wood. Gentle on the scalp and static free.' },
  { id: 'p12', name: 'Cold Process Soap Trio', category: 'Wellness', price: 599, mrp: 749, stock: 16, emoji: '🧼', hue: 160, featured: false, image: '', description: 'Three 100 g bars: rose clay, charcoal and turmeric. Made with coconut and olive oils.' },
]

export const seedOffer = {
  active: true,
  text: 'Festive offer: 15% off everything',
  code: 'FESTIVE15',
  percent: 15,
}

export const FREE_SHIPPING_ABOVE = 999
export const SHIPPING_FEE = 79

export const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN')
