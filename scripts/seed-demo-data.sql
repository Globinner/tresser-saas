-- Seed Demo Data for BLADE Barbershop Management
-- This script adds demo clients, services, inventory, appointments, and queue entries

-- First, we need to get the shop_id from an existing shop or create one
-- This assumes a shop already exists (created when user onboards)

-- =====================================================
-- DEMO SERVICES (9 common barbershop services)
-- =====================================================
INSERT INTO services (shop_id, name, description, duration_minutes, price, is_active, category)
SELECT 
  s.id as shop_id,
  service.name,
  service.description,
  service.duration_minutes,
  service.price,
  true as is_active,
  service.category
FROM shops s
CROSS JOIN (
  VALUES 
    ('Classic Haircut', 'Traditional scissor and clipper cut with hot towel finish', 30, 35.00, 'Haircuts'),
    ('Fade Haircut', 'Skin fade, mid fade, or high fade with precision blending', 45, 45.00, 'Haircuts'),
    ('Buzz Cut', 'Full head buzz cut with even length', 15, 20.00, 'Haircuts'),
    ('Kids Haircut', 'Haircut for children under 12', 25, 25.00, 'Haircuts'),
    ('Beard Trim', 'Shape and trim beard with hot towel and oil', 20, 20.00, 'Beard'),
    ('Beard Shave', 'Full straight razor shave with hot towel treatment', 30, 35.00, 'Beard'),
    ('Hair Color', 'Full head color treatment', 60, 75.00, 'Color'),
    ('Highlights', 'Partial or full highlights', 90, 120.00, 'Color'),
    ('Hair & Beard Combo', 'Haircut plus beard trim package deal', 50, 50.00, 'Packages')
) AS service(name, description, duration_minutes, price, category)
WHERE NOT EXISTS (
  SELECT 1 FROM services WHERE services.shop_id = s.id AND services.name = service.name
)
LIMIT 9;

-- =====================================================
-- DEMO CLIENTS (5 clients with realistic data)
-- =====================================================
INSERT INTO clients (shop_id, first_name, last_name, email, phone, notes, total_visits, total_spent, reminder_opt_in)
SELECT 
  s.id as shop_id,
  client.first_name,
  client.last_name,
  client.email,
  client.phone,
  client.notes,
  client.total_visits,
  client.total_spent,
  true as reminder_opt_in
FROM shops s
CROSS JOIN (
  VALUES 
    ('Marcus', 'Johnson', 'marcus.j@email.com', '(555) 123-4567', 'Prefers skin fade, sensitive scalp. Allergic to certain hair products.', 12, 540.00),
    ('David', 'Chen', 'david.chen@email.com', '(555) 234-5678', 'Regular customer since 2023. Likes mid fade with textured top.', 24, 1080.00),
    ('Alex', 'Thompson', 'alex.t@email.com', '(555) 345-6789', 'Beard enthusiast. Uses premium beard oils. Color treatment every 6 weeks.', 18, 1620.00),
    ('James', 'Williams', 'james.w@email.com', '(555) 456-7890', 'Executive style. Prefers appointments early morning. Tips well.', 8, 400.00),
    ('Michael', 'Rodriguez', 'michael.r@email.com', '(555) 567-8901', 'Buzz cut regular. Quick service preferred. Comes every 2 weeks.', 26, 520.00)
) AS client(first_name, last_name, email, phone, notes, total_visits, total_spent)
WHERE NOT EXISTS (
  SELECT 1 FROM clients WHERE clients.shop_id = s.id AND clients.email = client.email
)
LIMIT 5;

-- =====================================================
-- DEMO INVENTORY CATEGORIES
-- =====================================================
INSERT INTO inventory_categories (shop_id, name)
SELECT 
  s.id as shop_id,
  category.name
FROM shops s
CROSS JOIN (
  VALUES 
    ('Hair Products'),
    ('Beard Products'),
    ('Color & Chemicals'),
    ('Tools & Equipment'),
    ('Consumables')
) AS category(name)
WHERE NOT EXISTS (
  SELECT 1 FROM inventory_categories WHERE inventory_categories.shop_id = s.id AND inventory_categories.name = category.name
);

-- =====================================================
-- DEMO INVENTORY ITEMS
-- =====================================================
INSERT INTO inventory_items (shop_id, category_id, name, description, sku, quantity_in_stock, unit, reorder_level, cost_per_unit, supplier)
SELECT 
  s.id as shop_id,
  ic.id as category_id,
  item.name,
  item.description,
  item.sku,
  item.quantity,
  item.unit,
  item.reorder_level,
  item.cost_per_unit,
  item.supplier
FROM shops s
JOIN inventory_categories ic ON ic.shop_id = s.id
CROSS JOIN (
  VALUES 
    ('Hair Products', 'Pomade Wax - Strong Hold', 'Premium pomade for textured styles', 'PMD-001', 15, 'units', 5, 12.00, 'Beauty Supply Co.'),
    ('Hair Products', 'Hair Gel - Medium Hold', 'Water-based gel for everyday styling', 'GEL-002', 20, 'units', 8, 8.00, 'Beauty Supply Co.'),
    ('Hair Products', 'Sea Salt Spray', 'For natural beach texture look', 'SSS-003', 8, 'bottles', 4, 10.00, 'Pro Barber Supplies'),
    ('Beard Products', 'Beard Oil - Sandalwood', 'Premium beard conditioning oil', 'BRD-001', 12, 'bottles', 5, 15.00, 'Beard Kings Inc.'),
    ('Beard Products', 'Beard Balm', 'Styling balm with natural ingredients', 'BRD-002', 10, 'units', 4, 14.00, 'Beard Kings Inc.'),
    ('Color & Chemicals', 'Hair Color - Black', 'Professional hair dye', 'CLR-001', 6, 'tubes', 3, 18.00, 'Color Masters'),
    ('Color & Chemicals', 'Developer 20 Vol', '20 volume peroxide developer', 'DEV-020', 4, 'bottles', 2, 12.00, 'Color Masters'),
    ('Color & Chemicals', 'Developer 30 Vol', '30 volume peroxide developer', 'DEV-030', 3, 'bottles', 2, 14.00, 'Color Masters'),
    ('Tools & Equipment', 'Clipper Blades - #1', 'Replacement blades for Wahl clippers', 'BLD-001', 4, 'units', 2, 25.00, 'Barber Pro Tools'),
    ('Tools & Equipment', 'Straight Razor Blades', 'Pack of 100 single-edge blades', 'RZR-100', 5, 'boxes', 2, 15.00, 'Barber Pro Tools'),
    ('Consumables', 'Neck Strips', 'Disposable neck protection strips', 'NCK-001', 8, 'boxes', 3, 8.00, 'Salon Essentials'),
    ('Consumables', 'Disposable Capes', 'Single-use cutting capes', 'CPE-001', 3, 'boxes', 2, 20.00, 'Salon Essentials'),
    ('Consumables', 'Sanitizer Spray', 'Tool sanitizer spray', 'SAN-001', 6, 'bottles', 3, 7.00, 'Salon Essentials')
) AS item(category_name, name, description, sku, quantity, unit, reorder_level, cost_per_unit, supplier)
WHERE ic.name = item.category_name
AND NOT EXISTS (
  SELECT 1 FROM inventory_items WHERE inventory_items.shop_id = s.id AND inventory_items.sku = item.sku
);

-- =====================================================
-- DEMO APPOINTMENTS (for today and upcoming days)
-- =====================================================
INSERT INTO appointments (shop_id, client_id, service_id, date, start_time, end_time, status, client_name, client_email, client_phone, total_price)
SELECT 
  s.id as shop_id,
  c.id as client_id,
  sv.id as service_id,
  CURRENT_DATE as date,
  appt.start_time::time,
  appt.end_time::time,
  appt.status,
  c.first_name || ' ' || c.last_name as client_name,
  c.email as client_email,
  c.phone as client_phone,
  sv.price as total_price
FROM shops s
JOIN clients c ON c.shop_id = s.id
JOIN services sv ON sv.shop_id = s.id
CROSS JOIN (
  VALUES 
    (1, 'Classic Haircut', '09:00', '09:30', 'confirmed'),
    (2, 'Fade Haircut', '10:00', '10:45', 'confirmed'),
    (3, 'Hair & Beard Combo', '11:00', '11:50', 'confirmed'),
    (4, 'Classic Haircut', '13:00', '13:30', 'pending'),
    (5, 'Beard Trim', '14:00', '14:20', 'pending')
) AS appt(client_num, service_name, start_time, end_time, status)
WHERE sv.name = appt.service_name
AND c.id = (
  SELECT id FROM clients WHERE shop_id = s.id ORDER BY created_at LIMIT 1 OFFSET appt.client_num - 1
)
AND NOT EXISTS (
  SELECT 1 FROM appointments a 
  WHERE a.shop_id = s.id 
  AND a.date = CURRENT_DATE 
  AND a.start_time = appt.start_time::time
);

-- =====================================================
-- DEMO WALK-IN QUEUE (3 people waiting)
-- =====================================================
INSERT INTO walk_in_queue (shop_id, client_name, client_phone, service_requested, status, position, estimated_wait_minutes, checked_in_at)
SELECT 
  s.id as shop_id,
  queue.client_name,
  queue.phone,
  queue.service,
  'waiting' as status,
  queue.position,
  queue.wait_time,
  NOW() - (queue.wait_time || ' minutes')::interval as checked_in_at
FROM shops s
CROSS JOIN (
  VALUES 
    ('John Smith', '(555) 111-2222', 'Fade Haircut', 1, 15),
    ('Robert Brown', '(555) 333-4444', 'Classic Haircut', 2, 30),
    ('Chris Davis', '(555) 555-6666', 'Buzz Cut', 3, 45)
) AS queue(client_name, phone, service, position, wait_time)
WHERE NOT EXISTS (
  SELECT 1 FROM walk_in_queue wq 
  WHERE wq.shop_id = s.id 
  AND wq.client_name = queue.client_name
  AND wq.status = 'waiting'
);

-- =====================================================
-- DEMO CHEMISTRY RECORDS (for color clients)
-- =====================================================
INSERT INTO client_chemistry (shop_id, client_id, treatment_type, product_name, brand, color_formula, developer_brand, developer_volume, mix_ratio, processing_time_minutes, treatment_date, result_notes)
SELECT 
  s.id as shop_id,
  c.id as client_id,
  chem.treatment_type,
  chem.product_name,
  chem.brand,
  chem.color_formula,
  chem.developer_brand,
  chem.developer_volume,
  chem.mix_ratio,
  chem.processing_time,
  CURRENT_DATE - interval '30 days' as treatment_date,
  chem.result_notes
FROM shops s
JOIN clients c ON c.shop_id = s.id AND c.first_name = 'Alex'
CROSS JOIN (
  VALUES 
    ('Hair Color', 'Professional Color', 'Schwarzkopf', '5N Natural Brown + 6G Golden Brown (1:1)', 'Schwarzkopf', 20, '1:1', 35, 'Great coverage, client very happy with natural result'),
    ('Highlights', 'Blondor Multi Blonde', 'Wella', 'Lightener + 7N toner', 'Wella', 30, '1:2', 45, 'Subtle highlights, no brassiness')
) AS chem(treatment_type, product_name, brand, color_formula, developer_brand, developer_volume, mix_ratio, processing_time, result_notes)
WHERE NOT EXISTS (
  SELECT 1 FROM client_chemistry cc 
  WHERE cc.shop_id = s.id 
  AND cc.client_id = c.id
  AND cc.treatment_type = chem.treatment_type
)
LIMIT 2;

-- =====================================================
-- DEMO TRANSACTIONS (revenue history)
-- =====================================================
INSERT INTO transactions (shop_id, client_id, appointment_id, amount, payment_method, created_at)
SELECT 
  a.shop_id,
  a.client_id,
  a.id as appointment_id,
  a.total_price as amount,
  'card' as payment_method,
  a.created_at
FROM appointments a
WHERE a.status = 'confirmed'
AND NOT EXISTS (
  SELECT 1 FROM transactions t WHERE t.appointment_id = a.id
);

SELECT 'Demo data seeded successfully!' as result;
